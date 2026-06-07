/* global process */
import express from "express";
import cors    from "cors";
import axios   from "axios";
import puppeteer    from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

const app  = express();
const PORT = 3002;

const ADZUNA_APP_ID  = process.env.VITE_ADZUNA_APP_ID  || "";
const ADZUNA_APP_KEY = process.env.VITE_ADZUNA_APP_KEY || "";

app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176"] }));
app.use(express.json());

// ── Shared browser ────────────────────────────────────────────────────────────
let browser = null;
async function getBrowser() {
  if (browser && browser.connected) return browser;
  browser = await puppeteer.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    args: ["--no-sandbox", "--disable-setuid-sandbox",
           "--disable-blink-features=AutomationControlled", "--disable-dev-shm-usage"],
  });
  console.log("Browser ready");
  return browser;
}

// ── State → city slug maps ────────────────────────────────────────────────────
const STATE_TO_SLUG = {
  "Andhra Pradesh": "andhra-pradesh", "Arunachal Pradesh": "arunachal-pradesh",
  "Assam": "assam", "Bihar": "patna", "Chhattisgarh": "raipur",
  "Goa": "goa", "Gujarat": "ahmedabad", "Haryana": "gurgaon",
  "Himachal Pradesh": "shimla", "Jharkhand": "ranchi", "Karnataka": "bangalore",
  "Kerala": "kochi", "Madhya Pradesh": "indore", "Maharashtra": "mumbai",
  "Manipur": "imphal", "Meghalaya": "shillong", "Mizoram": "aizawl",
  "Nagaland": "kohima", "Odisha": "bhubaneswar", "Punjab": "chandigarh",
  "Rajasthan": "jaipur", "Sikkim": "gangtok", "Tamil Nadu": "chennai",
  "Telangana": "hyderabad", "Tripura": "agartala", "Uttar Pradesh": "noida",
  "Uttarakhand": "dehradun", "West Bengal": "kolkata",
  "Andaman & Nicobar Islands": "andaman", "Chandigarh": "chandigarh",
  "Dadra & Nagar Haveli and Daman & Diu": "daman", "Delhi (NCT)": "delhi",
  "Jammu & Kashmir": "jammu", "Ladakh": "leh", "Lakshadweep": "lakshadweep",
  "Puducherry": "pondicherry",
};

// City name used in Adzuna "where" param
const STATE_TO_CITY = {
  "Karnataka": "Bangalore", "Maharashtra": "Mumbai", "Tamil Nadu": "Chennai",
  "Telangana": "Hyderabad", "Delhi (NCT)": "Delhi", "West Bengal": "Kolkata",
  "Gujarat": "Ahmedabad", "Haryana": "Gurgaon", "Uttar Pradesh": "Noida",
  "Punjab": "Chandigarh", "Rajasthan": "Jaipur", "Kerala": "Kochi",
  "Madhya Pradesh": "Indore", "Odisha": "Bhubaneswar", "Bihar": "Patna",
};

// ── Time helpers ──────────────────────────────────────────────────────────────
function tfToHours(tf) {
  if (!tf) return Infinity;
  if (tf.endsWith("h")) return parseInt(tf);
  if (tf.endsWith("d")) return parseInt(tf) * 24;
  return Infinity;
}
function tfToMaxDaysOld(tf) {
  if (!tf) return null;
  if (tf.endsWith("h")) return 1;
  if (tf.endsWith("d")) return parseInt(tf);
  return null;
}
function hoursAgoFromDate(iso) {
  return (Date.now() - new Date(iso).getTime()) / 3_600_000;
}
function footerToHoursAgo(label = "") {
  const l = (label || "").toLowerCase().trim();
  if (!l) return Infinity;
  if (l.includes("just now")) return 0;
  const m = l.match(/(\d+)\s*min/);   if (m) return parseInt(m[1]) / 60;
  const h = l.match(/(\d+)\+?\s*hour/); if (h) return parseInt(h[1]);
  const d = l.match(/(\d+)\+?\s*day/);  if (d) return parseInt(d[1]) * 24;
  const w = l.match(/(\d+)\+?\s*week/); if (w) return parseInt(w[1]) * 168;
  if (l.includes("month") || l.includes("30+")) return 720;
  return Infinity;
}
function tfToJobAge(tf) {
  if (!tf) return "";
  if (["1h","2h","3h","6h","12h","24h"].includes(tf)) return "1";
  if (tf === "3d") return "3";
  if (tf === "7d") return "7";
  return "";
}

// ── Deduplication ─────────────────────────────────────────────────────────────
function deduplicate(jobs) {
  const seen = new Set();
  return jobs.filter((j) => {
    const key = `${j.title}|${j.company}`.toLowerCase().replace(/\s+/g, "");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function detectJobType(title = "", desc = "") {
  const t = `${title} ${desc}`.toLowerCase();
  if (t.includes("remote") || t.includes("work from home") || t.includes("wfh")) return "Remote";
  if (t.includes("hybrid")) return "Hybrid";
  if (t.includes("internship") || t.includes("intern")) return "Internship";
  if (t.includes("contract") || t.includes("freelance")) return "Contract";
  if (t.includes("part time") || t.includes("part-time")) return "Part-time";
  return "Full-time";
}

// ════════════════════════════════════════════════════════════════════════════
// SOURCE 1 — Naukri (puppeteer)
// ════════════════════════════════════════════════════════════════════════════
async function fetchFromNaukri({ keyword, state, page, timeFilter }) {
  const isAllIndia = state === "All India" || state === "Remote / WFH";
  const slug    = isAllIndia ? "" : (STATE_TO_SLUG[state] || state.toLowerCase().replace(/[\s&()]/g, "-"));
  const kw      = keyword.toLowerCase().replace(/\s+/g, "-");
  const jobAge  = tfToJobAge(timeFilter);
  const base    = isAllIndia
    ? (page > 1 ? `/${kw}-jobs-${page}` : `/${kw}-jobs`)
    : (page > 1 ? `/${kw}-jobs-in-${slug}-${page}` : `/${kw}-jobs-in-${slug}`);
  const url     = `https://www.naukri.com${base}${jobAge ? `?jobAge=${jobAge}` : ""}`;

  console.log(`[Naukri] ${url}`);
  let pg = null;
  try {
    const b = await getBrowser();
    pg = await b.newPage();
    await pg.setViewport({ width: 1280, height: 800 });
    await pg.setExtraHTTPHeaders({ "Accept-Language": "en-US,en;q=0.9" });

    let raw = null, total = 0;
    pg.on("response", async (resp) => {
      if (resp.url().includes("jobapi/v3/search") && resp.status() === 200) {
        try { const j = await resp.json(); raw = j.jobDetails || []; total = j.noOfJobs || 0; }
        catch { /* consumed */ }
      }
    });

    await pg.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
    if (!raw) { raw = await scrapeDOM(pg); total = raw.length * 10; }
    await pg.close();

    const maxH = tfToHours(timeFilter);
    let jobs = raw.map(normalizeNaukri);
    if (isFinite(maxH)) {
      jobs = jobs.filter((j) => footerToHoursAgo(j._footer) <= maxH);
    }
    jobs.forEach((j) => delete j._footer);
    return { jobs, total };
  } catch (err) {
    if (pg) await pg.close().catch(() => {});
    console.error("[Naukri]", err.message);
    return { jobs: [], total: 0 };
  }
}

async function scrapeDOM(pg) {
  return pg.evaluate(() => {
    const cards = document.querySelectorAll("article.jobTuple, .cust-job-tuple, [class*='srp-jobtuple']");
    return Array.from(cards).map((c) => {
      // Priority: data attribute → job-listings href → title anchor
      const jobLink =
        c.querySelector("a[href*='job-listings']")?.href ||
        c.querySelector("a.title[href], a[class*='title'][href], h2 a[href], h3 a[href]")?.href ||
        "";

      // Extract numeric job ID from the URL (14+ digit number at end of slug)
      const idMatch = jobLink.match(/[/-](\d{14,})/);
      const jobId   = c.getAttribute("data-job-id") ||
                      c.querySelector("[data-job-id]")?.getAttribute("data-job-id") ||
                      (idMatch ? idMatch[1] : null);

      return {
        jobId,
        title: c.querySelector("[class*='title'],.title")?.innerText?.trim() || "",
        companyName: c.querySelector("[class*='comp-name'],.comp-name")?.innerText?.trim() || "",
        companyLogo: c.querySelector("img.logoImage,img[class*='logo']")?.src || null,
        location: [{ label: c.querySelector("[class*='loc'],.loc")?.innerText?.trim() || "" }],
        experienceText: c.querySelector("[class*='exp'],.exp")?.innerText?.trim() || "",
        salary: { label: c.querySelector("[class*='sal'],.sal")?.innerText?.trim() || "" },
        jobDescription: c.querySelector("[class*='job-desc'],.job-desc")?.innerText?.trim() || "",
        tagsAndSkills: "",
        footerPlaceholderLabel: c.querySelector("[class*='job-post-day'],[class*='postDate']")?.innerText?.trim() || "",
        jdURL: jobLink.replace("https://www.naukri.com", ""),
        placeholders: [
          { type:"location",   label: c.querySelector("[class*='loc'],.loc")?.innerText?.trim() || "" },
          { type:"experience", label: c.querySelector("[class*='exp'],.exp")?.innerText?.trim() || "" },
          { type:"salary",     label: c.querySelector("[class*='sal'],.sal")?.innerText?.trim() || "" },
        ],
      };
    });
  });
}

function buildNaukriUrl(j) {
  if (j.jdURL?.startsWith("http")) return j.jdURL;
  if (j.jdURL) return `https://www.naukri.com${j.jdURL}`;
  // Construct from jobId — Naukri job URLs end with the numeric job ID
  if (j.jobId) {
    const slug = (j.title || "job").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return `https://www.naukri.com/job-listings-${slug}-${j.jobId}`;
  }
  const kw = (j.title || "jobs").toLowerCase().replace(/\s+/g, "-");
  return `https://www.naukri.com/${kw}-jobs`;
}

function normalizeNaukri(j) {
  const loc = (j.placeholders||[]).find((p)=>p.type==="location")?.label
           || (j.location||[]).map((l)=>l.label).join(", ");
  const exp = (j.placeholders||[]).find((p)=>p.type==="experience")?.label || j.experienceText || "";
  const sal = (j.placeholders||[]).find((p)=>p.type==="salary")?.label    || j.salary?.label || null;
  const skills = (j.tagsAndSkills||"").split(",").map((s)=>s.trim()).filter(Boolean).slice(0,6);
  const footer = j.footerPlaceholderLabel || "";
  const posted = new Date();
  const dm = footer.match(/(\d+)\s*day/i);
  const hm = footer.match(/(\d+)\s*hour/i);
  const mm = footer.match(/(\d+)\s*min/i);
  if (dm) posted.setDate(posted.getDate()-parseInt(dm[1]));
  else if (hm) posted.setHours(posted.getHours()-parseInt(hm[1]));
  else if (mm) posted.setMinutes(posted.getMinutes()-parseInt(mm[1]));
  return {
    id: `naukri-${j.jobId||Math.random()}`,
    source: "naukri",
    title: j.title||"Untitled",
    company: j.companyName||"Unknown",
    companyLogo: j.logoPathV3||j.companyLogo||null,
    location: loc, experience: exp, salary: sal||null,
    description: j.jobDescription||"",
    skills, jobType: detectJobType(j.title, j.jobDescription),
    category: j.functionalArea||"General",
    postedAt: posted.toISOString(),
    _footer: footer,
    url: buildNaukriUrl(j),
  };
}

// ════════════════════════════════════════════════════════════════════════════
// SOURCE 2 — Adzuna India
// ════════════════════════════════════════════════════════════════════════════
async function fetchFromAdzuna({ keyword, state, page, timeFilter }) {
  if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) return { jobs: [], total: 0 };
  const where   = STATE_TO_CITY[state] || state;
  const maxDays = tfToMaxDaysOld(timeFilter);
  const params  = {
    app_id: ADZUNA_APP_ID, app_key: ADZUNA_APP_KEY,
    results_per_page: 20, what: keyword, where,
    sort_by: "date", "content-type": "application/json",
    ...(maxDays ? { max_days_old: maxDays } : {}),
  };
  try {
    const { data } = await axios.get(
      `https://api.adzuna.com/v1/api/jobs/in/search/${page}`,
      { params, timeout: 8000 }
    );
    console.log(`[Adzuna] ${data.count} total for "${keyword}" in ${where}`);
    return {
      jobs: (data.results || []).map(normalizeAdzuna),
      total: data.count || 0,
    };
  } catch (err) {
    console.error("[Adzuna]", err.message);
    return { jobs: [], total: 0 };
  }
}

function normalizeAdzuna(j) {
  let salary = null;
  if (j.salary_min && j.salary_max) {
    salary = `₹${(j.salary_min/100000).toFixed(1)}L – ₹${(j.salary_max/100000).toFixed(1)}L PA`;
  } else if (j.salary_min) {
    salary = `From ₹${(j.salary_min/100000).toFixed(1)}L PA`;
  }
  return {
    id: `adzuna-${j.id}`,
    source: "adzuna",
    title: j.title||"Untitled",
    company: j.company?.display_name||"Unknown",
    companyLogo: null,
    location: j.location?.display_name||"",
    experience: "", salary,
    description: j.description||"",
    skills: [],
    jobType: detectJobType(j.title, j.description),
    category: j.category?.label||"General",
    postedAt: j.created||new Date().toISOString(),
    url: j.redirect_url||"https://www.adzuna.in",
  };
}

// ════════════════════════════════════════════════════════════════════════════
// SOURCE 3 — Remotive (remote jobs, no auth)
// ════════════════════════════════════════════════════════════════════════════
async function fetchFromRemotive({ keyword, timeFilter }) {
  try {
    const { data } = await axios.get("https://remotive.com/api/remote-jobs", {
      params: { search: keyword, limit: 20 },
      timeout: 8000,
    });
    const maxH = tfToHours(timeFilter);
    let jobs = (data.jobs || []).map(normalizeRemotive);
    if (isFinite(maxH)) {
      jobs = jobs.filter((j) => hoursAgoFromDate(j.postedAt) <= maxH);
    }
    console.log(`[Remotive] ${data["job-count"]} total, returning ${jobs.length}`);
    return { jobs, total: data["job-count"] || 0 };
  } catch (err) {
    console.error("[Remotive]", err.message);
    return { jobs: [], total: 0 };
  }
}

function normalizeRemotive(j) {
  return {
    id: `remotive-${j.id}`,
    source: "remotive",
    title: j.title||"Untitled",
    company: j.company_name||"Unknown",
    companyLogo: j.company_logo||null,
    location: j.candidate_required_location||"Remote",
    experience: "",
    salary: j.salary||null,
    description: j.description?.replace(/<[^>]*>/g,"").slice(0,300)||"",
    skills: (j.tags||[]).slice(0,6),
    jobType: "Remote",
    category: j.category||"General",
    postedAt: j.publication_date||new Date().toISOString(),
    url: j.url||"https://remotive.com",
  };
}

// ════════════════════════════════════════════════════════════════════════════
// SOURCE 5 — LinkedIn (public search, no login required)
// ════════════════════════════════════════════════════════════════════════════
const LI_GEO_INDIA = "102713980";

const STATE_TO_LI_LOCATION = {
  "Karnataka":       "Bengaluru, Karnataka, India",
  "Maharashtra":     "Mumbai, Maharashtra, India",
  "Tamil Nadu":      "Chennai, Tamil Nadu, India",
  "Telangana":       "Hyderabad, Telangana, India",
  "Delhi (NCT)":     "New Delhi, Delhi, India",
  "West Bengal":     "Kolkata, West Bengal, India",
  "Gujarat":         "Ahmedabad, Gujarat, India",
  "Haryana":         "Gurugram, Haryana, India",
  "Uttar Pradesh":   "Noida, Uttar Pradesh, India",
  "Punjab":          "Chandigarh, Punjab, India",
  "Rajasthan":       "Jaipur, Rajasthan, India",
  "Kerala":          "Kochi, Kerala, India",
  "Madhya Pradesh":  "Indore, Madhya Pradesh, India",
  "Odisha":          "Bhubaneswar, Odisha, India",
  "Bihar":           "Patna, Bihar, India",
  "Andhra Pradesh":  "Visakhapatnam, Andhra Pradesh, India",
  "Chhattisgarh":    "Raipur, Chhattisgarh, India",
  "Jharkhand":       "Ranchi, Jharkhand, India",
  "Assam":           "Guwahati, Assam, India",
};

function tfToLinkedInTPR(tf) {
  const map = {
    "1h": "r3600", "2h": "r7200", "3h": "r10800", "6h": "r21600",
    "12h": "r43200", "24h": "r86400", "3d": "r259200", "7d": "r604800",
  };
  return map[tf] || "";
}

async function fetchFromLinkedIn({ keyword, state, page, timeFilter }) {
  const isAllIndia = state === "All India" || state === "Remote / WFH";
  const location   = isAllIndia ? "India" : (STATE_TO_LI_LOCATION[state] || `${state}, India`);
  const start    = (page - 1) * 25;
  const tpr      = tfToLinkedInTPR(timeFilter);

  const qs = new URLSearchParams({
    keywords: keyword,
    location,
    geoId: LI_GEO_INDIA,
    sortBy: "DD",
    start: String(start),
    ...(tpr ? { f_TPR: tpr } : {}),
  });

  const url = `https://www.linkedin.com/jobs/search?${qs}`;
  console.log(`[LinkedIn] ${url}`);

  let pg = null;
  try {
    const b = await getBrowser();
    pg = await b.newPage();
    await pg.setViewport({ width: 1440, height: 900 });
    await pg.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    });

    await pg.goto(url, { waitUntil: "domcontentloaded", timeout: 35000 });

    // Wait for job cards; if none appear within 10s, bail gracefully
    await pg.waitForSelector(
      "ul.jobs-search__results-list li, .base-search-card",
      { timeout: 10000 }
    ).catch(() => {});

    const raw = await pg.evaluate(() => {
      const cards = document.querySelectorAll(
        "ul.jobs-search__results-list li, [class*='jobs-search-results__list-item']"
      );
      return Array.from(cards).slice(0, 25).map((card) => {
        const titleEl    = card.querySelector("h3.base-search-card__title, .job-title, h3[class*='title']");
        const companyEl  = card.querySelector("h4.base-search-card__subtitle a, h4.base-search-card__subtitle, [class*='company-name']");
        const locationEl = card.querySelector("span.job-search-card__location, [class*='location']");
        const timeEl     = card.querySelector("time");
        const linkEl     = card.querySelector("a.base-card__full-link, a[href*='/jobs/view/']");
        const imgEl      = card.querySelector("img.artdeco-entity-image, img[class*='company-logo']");

        return {
          title:    titleEl?.innerText?.trim()  || "",
          company:  companyEl?.innerText?.trim() || "",
          location: locationEl?.innerText?.trim() || "",
          postedAt: timeEl?.getAttribute("datetime") || "",
          url:      linkEl?.href || "",
          logo:     imgEl?.src  || null,
        };
      }).filter((j) => j.title && j.url);
    });

    await pg.close();
    console.log(`[LinkedIn] ${raw.length} jobs scraped`);

    const maxH = tfToHours(timeFilter);
    let jobs = raw.map(normalizeLinkedIn);
    if (isFinite(maxH)) {
      jobs = jobs.filter((j) => hoursAgoFromDate(j.postedAt) <= maxH);
    }
    return { jobs, total: raw.length > 0 ? raw.length * 8 : 0 };
  } catch (err) {
    if (pg) await pg.close().catch(() => {});
    console.error("[LinkedIn]", err.message);
    return { jobs: [], total: 0 };
  }
}

function normalizeLinkedIn(j) {
  return {
    id:          `linkedin-${Math.random().toString(36).slice(2)}`,
    source:      "linkedin",
    title:       j.title   || "Untitled",
    company:     j.company || "Unknown",
    companyLogo: j.logo    || null,
    location:    j.location || "",
    experience:  "",
    salary:      null,
    description: "",
    skills:      [],
    jobType:     detectJobType(j.title, ""),
    category:    "General",
    postedAt:    j.postedAt || new Date().toISOString(),
    url:         j.url || "https://www.linkedin.com/jobs",
  };
}

// ════════════════════════════════════════════════════════════════════════════
// SOURCE 4 — Arbeitnow (no auth, tech jobs)
// ════════════════════════════════════════════════════════════════════════════
async function fetchFromArbeitnow({ keyword, page, timeFilter }) {
  try {
    const { data } = await axios.get("https://www.arbeitnow.com/api/job-board-api", {
      params: { page },
      timeout: 8000,
    });
    const kw   = keyword.toLowerCase();
    const maxH = tfToHours(timeFilter);
    let jobs = (data.data || [])
      .filter((j) => {
        const text = `${j.title} ${j.tags?.join(" ")||""} ${j.description||""}`.toLowerCase();
        return text.includes(kw) || kw.length < 4;
      })
      .map(normalizeArbeitnow);

    if (isFinite(maxH)) {
      jobs = jobs.filter((j) => hoursAgoFromDate(j.postedAt) <= maxH);
    }
    console.log(`[Arbeitnow] returning ${jobs.length}`);
    return { jobs, total: data.meta?.total || jobs.length };
  } catch (err) {
    console.error("[Arbeitnow]", err.message);
    return { jobs: [], total: 0 };
  }
}

function normalizeArbeitnow(j) {
  return {
    id: `arbeitnow-${j.slug}`,
    source: "arbeitnow",
    title: j.title||"Untitled",
    company: j.company_name||"Unknown",
    companyLogo: null,
    location: j.remote ? "Remote" : (j.location||"International"),
    experience: "",
    salary: null,
    description: j.description?.replace(/<[^>]*>/g,"").slice(0,300)||"",
    skills: (j.tags||[]).slice(0,6),
    jobType: j.remote ? "Remote" : detectJobType(j.title, j.description),
    category: (j.job_types||[])[0]||"General",
    postedAt: j.created_at
      ? new Date(j.created_at * 1000).toISOString()
      : new Date().toISOString(),
    url: j.url||"https://www.arbeitnow.com",
  };
}

// ════════════════════════════════════════════════════════════════════════════
// /api/jobs  — parallel fetch from all sources
// ════════════════════════════════════════════════════════════════════════════
app.get("/api/jobs", async (req, res) => {
  const { states: statesParam, state: legacyState, keywords = "", page = 1, timeFilter = "" } = req.query;

  const rawStates = ((statesParam || legacyState || "")).split(",").map((s) => s.trim()).filter(Boolean);
  if (rawStates.length === 0) return res.status(400).json({ error: "states is required" });

  const hasAllIndia = rawStates.includes("All India");
  const hasRemote   = rawStates.includes("Remote / WFH");
  const normalStates = rawStates.filter((s) => s !== "All India" && s !== "Remote / WFH");

  const keyword = keywords.trim() || "software developer";
  // Append "remote" to keyword when Remote / WFH is selected and not already present
  const effectiveKeyword = hasRemote && !keyword.toLowerCase().includes("remote")
    ? `${keyword} remote`
    : keyword;
  const pageNum = Math.max(1, Number(page));

  // Determine states to query location-based sources (Naukri, LinkedIn, Adzuna)
  // Cap at 2 Naukri scrapes to keep response time reasonable
  const locationStates = hasAllIndia
    ? ["All India"]
    : normalStates.length > 0
    ? normalStates.slice(0, 2)
    : ["All India"];

  if (hasRemote && locationStates[0] !== "All India") {
    locationStates.push("Remote / WFH");
  }

  const primaryState  = locationStates[0];
  const extraStates   = locationStates.slice(1);

  // Run all sources in parallel; Naukri runs once per location state (capped at 2)
  const naukriPromises = locationStates.slice(0, 2).map((s) =>
    fetchFromNaukri({ keyword: effectiveKeyword, state: s, page: pageNum, timeFilter })
  );

  const [naukriResults, adzunaR, remotiveR, arbeitnowR, linkedinR] = await Promise.allSettled([
    Promise.all(naukriPromises).then((results) => ({
      jobs:  results.flatMap((r) => r.jobs),
      total: results.reduce((sum, r) => sum + r.total, 0),
    })),
    fetchFromAdzuna({ keyword: effectiveKeyword, state: primaryState, page: pageNum, timeFilter }),
    fetchFromRemotive({ keyword: effectiveKeyword, timeFilter }),
    fetchFromArbeitnow({ keyword: effectiveKeyword, page: pageNum, timeFilter }),
    fetchFromLinkedIn({ keyword: effectiveKeyword, state: primaryState, page: pageNum, timeFilter }),
  ]);

  // Also run Adzuna for extra states (fast HTTP calls, no Puppeteer)
  const extraAdzunaResults = await Promise.allSettled(
    extraStates.map((s) =>
      fetchFromAdzuna({ keyword: effectiveKeyword, state: s, page: pageNum, timeFilter })
    )
  );

  const get = (r) => (r.status === "fulfilled" ? r.value : { jobs: [], total: 0 });

  const naukri    = get(naukriResults);
  const adzuna    = get(adzunaR);
  const remotive  = get(remotiveR);
  const arbeitnow = get(arbeitnowR);
  const linkedin  = get(linkedinR);
  const extraAdzuna = extraAdzunaResults.map(get);

  const merged = deduplicate([
    ...naukri.jobs,
    ...linkedin.jobs,
    ...adzuna.jobs,
    ...extraAdzuna.flatMap((r) => r.jobs),
    ...remotive.jobs,
    ...arbeitnow.jobs,
  ]).sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));

  const total = naukri.total + adzuna.total + remotive.total + linkedin.total
    + extraAdzuna.reduce((sum, r) => sum + r.total, 0);

  console.log(
    `Merged: Naukri=${naukri.jobs.length} LinkedIn=${linkedin.jobs.length} ` +
    `Adzuna=${adzuna.jobs.length} Remotive=${remotive.jobs.length} ` +
    `Arbeitnow=${arbeitnow.jobs.length} → ${merged.length} unique`
  );

  return res.json({ jobs: merged, total });
});

// ════════════════════════════════════════════════════════════════════════════
// /api/stats  — real counts from all sources
// ════════════════════════════════════════════════════════════════════════════
const statsCache = { data: null, at: 0 };
const STATS_TTL  = 10 * 60 * 1000;

app.get("/api/stats", async (req, res) => {
  if (statsCache.data && Date.now() - statsCache.at < STATS_TTL) {
    return res.json(statsCache.data);
  }

  // Run Naukri broad search + Adzuna + Remotive in parallel
  const [naukriStat, adzunaStat, remotiveStat] = await Promise.allSettled([
    fetchNaukriStats(),
    fetchAdzunaStats(),
    fetchRemotiveStats(),
  ]);

  const nJ = naukriStat.status  === "fulfilled" ? naukriStat.value  : { totalJobs: 0, companies: 0 };
  const aJ = adzunaStat.status  === "fulfilled" ? adzunaStat.value  : { totalJobs: 0 };
  const rJ = remotiveStat.status=== "fulfilled" ? remotiveStat.value: { totalJobs: 0 };

  const stats = {
    totalJobs:      (nJ.totalJobs || 5000000) + (aJ.totalJobs || 0) + (rJ.totalJobs || 0),
    statesCount:    Object.keys(STATE_TO_SLUG).length,
    totalCompanies: nJ.companies || 500,
  };

  console.log("Stats:", stats);
  statsCache.data = stats;
  statsCache.at   = Date.now();
  return res.json(stats);
});

async function fetchNaukriStats() {
  let pg = null;
  try {
    const b = await getBrowser();
    pg = await b.newPage();
    await pg.setViewport({ width: 1280, height: 800 });
    let totalJobs = 0, companies = 0;
    pg.on("response", async (resp) => {
      if (resp.url().includes("jobapi/v3/search") && resp.status() === 200) {
        try {
          const j = await resp.json();
          totalJobs = j.noOfJobs      || 0;
          companies = j.noOfCompanies || 0;
        } catch { /* skip */ }
      }
    });
    await pg.goto("https://www.naukri.com/jobs-in-india", { waitUntil: "networkidle2", timeout: 30000 });
    await pg.close();
    console.log(`[Naukri stats] jobs=${totalJobs} companies=${companies}`);
    return { totalJobs, companies };
  } catch {
    if (pg) await pg.close().catch(() => {});
    return { totalJobs: 0, companies: 0 };
  }
}

async function fetchAdzunaStats() {
  if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) return { totalJobs: 0 };
  try {
    const { data } = await axios.get("https://api.adzuna.com/v1/api/jobs/in/search/1", {
      params: { app_id: ADZUNA_APP_ID, app_key: ADZUNA_APP_KEY,
                results_per_page: 1, what: "developer", "content-type": "application/json" },
      timeout: 8000,
    });
    console.log(`[Adzuna stats] count=${data.count}`);
    return { totalJobs: data.count || 0 };
  } catch {
    return { totalJobs: 0 };
  }
}

async function fetchRemotiveStats() {
  try {
    const { data } = await axios.get("https://remotive.com/api/remote-jobs",
      { params: { limit: 1 }, timeout: 8000 });
    return { totalJobs: data["job-count"] || 0 };
  } catch {
    return { totalJobs: 0 };
  }
}

// ── Graceful shutdown ─────────────────────────────────────────────────────────
process.on("SIGINT", async () => {
  if (browser) await browser.close();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`ZoneJobs server → http://localhost:${PORT}`);
  getBrowser().catch(console.error);
});
