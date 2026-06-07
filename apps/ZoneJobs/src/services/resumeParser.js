import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl;

// ── Dictionaries ────────────────────────────────────────────────────────────

const SKILLS = {
  languages: [
    "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "C", "Go",
    "Rust", "Ruby", "PHP", "Swift", "Kotlin", "Dart", "Scala", "R",
    "MATLAB", "Shell", "Bash", "PowerShell", "SQL", "GraphQL",
  ],
  frontend: [
    "React", "Angular", "Vue", "Next.js", "Nuxt", "Svelte", "HTML", "CSS",
    "Sass", "Tailwind", "Bootstrap", "Material UI", "Chakra UI", "Redux",
    "Zustand", "React Query", "Webpack", "Vite", "Babel",
  ],
  backend: [
    "Node.js", "Express", "Django", "Flask", "FastAPI", "Spring Boot",
    "Laravel", "Rails", "NestJS", "Gin", "ASP.NET", "Fiber", "Hapi",
  ],
  mobile: [
    "React Native", "Flutter", "Android", "iOS", "Expo", "SwiftUI",
    "Jetpack Compose", "Ionic",
  ],
  databases: [
    "MySQL", "PostgreSQL", "MongoDB", "Redis", "Cassandra", "DynamoDB",
    "SQLite", "Oracle", "Firebase", "Supabase", "Elasticsearch",
    "Neo4j", "CouchDB",
  ],
  cloud: [
    "AWS", "Azure", "GCP", "Google Cloud", "Heroku", "Vercel", "Netlify",
    "DigitalOcean", "Cloudflare", "Docker", "Kubernetes", "Terraform",
    "Ansible", "Jenkins", "GitHub Actions", "CircleCI", "ArgoCD",
  ],
  data: [
    "Machine Learning", "Deep Learning", "NLP", "Computer Vision",
    "TensorFlow", "PyTorch", "Keras", "Scikit-learn", "Pandas", "NumPy",
    "Spark", "Hadoop", "Kafka", "Airflow", "Power BI", "Tableau",
    "Data Analysis", "Data Science", "Data Engineering",
  ],
  tools: [
    "Git", "GitHub", "GitLab", "Bitbucket", "Jira", "Confluence",
    "Figma", "Postman", "Swagger", "Linux", "Unix", "REST API",
    "Microservices", "Agile", "Scrum", "Kanban", "CI/CD",
  ],
  finance: [
    "Excel", "SAP", "Tally", "QuickBooks", "Financial Modeling",
    "Accounting", "GST", "Taxation", "Auditing", "Fintech",
  ],
  marketing: [
    "SEO", "SEM", "Google Ads", "Facebook Ads", "Content Marketing",
    "Email Marketing", "Social Media", "HubSpot", "Salesforce",
    "CRM", "Growth Hacking", "Digital Marketing",
  ],
};

const ROLES = [
  "Software Engineer", "Software Developer", "Frontend Developer",
  "Backend Developer", "Full Stack Developer", "Full Stack Engineer",
  "DevOps Engineer", "Site Reliability Engineer", "SRE",
  "Data Scientist", "Data Analyst", "Data Engineer",
  "Machine Learning Engineer", "AI Engineer", "ML Engineer",
  "Product Manager", "Product Owner",
  "UI/UX Designer", "UX Designer", "UI Designer", "Graphic Designer",
  "Android Developer", "iOS Developer", "Mobile Developer",
  "Cloud Architect", "Solutions Architect", "System Architect",
  "QA Engineer", "Test Engineer", "SDET",
  "Business Analyst", "Systems Analyst",
  "Database Administrator", "DBA",
  "Cybersecurity Engineer", "Security Analyst",
  "Network Engineer", "IT Support",
  "Technical Writer", "Scrum Master", "Agile Coach",
  "Sales Executive", "Marketing Manager", "HR Manager",
  "Finance Analyst", "Chartered Accountant", "CA",
];

const DEGREES = [
  "B.Tech", "BE", "B.E.", "M.Tech", "ME", "M.E.", "MCA", "BCA",
  "MBA", "PGDM", "B.Sc", "M.Sc", "BBA", "B.Com", "M.Com",
  "PhD", "Ph.D", "B.Arch", "M.Arch",
];

// ── Text extraction ──────────────────────────────────────────────────────────

async function extractTextFromPDF(file) {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  const pages = await Promise.all(
    Array.from({ length: pdf.numPages }, (_, i) =>
      pdf.getPage(i + 1).then((p) => p.getTextContent())
    )
  );
  return pages
    .flatMap((page) => page.items.map((item) => item.str))
    .join(" ");
}

async function extractTextFromDOCX(file) {
  const { default: mammoth } = await import("mammoth");
  const buffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });
  return result.value;
}

export async function extractTextFromResume(file) {
  const ext = file.name.split(".").pop().toLowerCase();
  if (ext === "pdf") return extractTextFromPDF(file);
  if (ext === "docx" || ext === "doc") return extractTextFromDOCX(file);
  throw new Error("Unsupported file type");
}

// ── Tag extraction ───────────────────────────────────────────────────────────

function matchTokens(text, tokens) {
  const lower = text.toLowerCase();
  return tokens.filter((token) => {
    const t = token.toLowerCase();
    const idx = lower.indexOf(t);
    if (idx === -1) return false;
    const before = idx === 0 || /\W/.test(lower[idx - 1]);
    const after = idx + t.length >= lower.length || /\W/.test(lower[idx + t.length]);
    return before && after;
  });
}

function extractExperience(text) {
  const patterns = [
    /(\d+)\+?\s*years?\s+of\s+experience/i,
    /(\d+)\+?\s*years?\s+experience/i,
    /experience\s+of\s+(\d+)\+?\s*years?/i,
    /(\d+)\+?\s*yrs?\s+exp/i,
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (m) return `${m[1]}+ Years Exp`;
  }
  return null;
}

function extractRole(text) {
  for (const role of ROLES) {
    const re = new RegExp(`\\b${role.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    if (re.test(text)) return role;
  }
  return null;
}

function extractDegree(text) {
  for (const deg of DEGREES) {
    const re = new RegExp(`\\b${deg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    if (re.test(text)) return deg;
  }
  return null;
}

export function parseResumeTags(text) {
  const allSkills = Object.values(SKILLS).flat();
  const found = matchTokens(text, allSkills);

  const categorized = {};
  for (const [cat, tokens] of Object.entries(SKILLS)) {
    const hits = tokens.filter((t) => found.includes(t));
    if (hits.length) categorized[cat] = hits;
  }

  const role = extractRole(text);
  const experience = extractExperience(text);
  const degree = extractDegree(text);

  const tags = [];

  if (role) tags.push({ label: role, type: "role" });
  if (experience) tags.push({ label: experience, type: "experience" });
  if (degree) tags.push({ label: degree, type: "education" });

  for (const [cat, skills] of Object.entries(categorized)) {
    for (const skill of skills) {
      tags.push({ label: skill, type: cat });
    }
  }

  // Build a smart search query from role + top skills
  const topSkills = found.slice(0, 5);
  const searchQuery = role
    ? role
    : topSkills[0] || "";

  return { tags, searchQuery, rawSkills: found };
}
