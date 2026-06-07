export async function fetchJobs({ states, keywords = "", page = 1, timeFilter = "" }) {
  const statesStr = Array.isArray(states) ? states.join(",") : (states || "");
  const params = new URLSearchParams({
    states: statesStr,
    keywords,
    page,
    ...(timeFilter ? { timeFilter } : {}),
  });

  const res = await fetch(`/api/jobs?${params}`);
  const data = await res.json();

  const primaryState = Array.isArray(states) ? states[0] : states;

  if (!res.ok) {
    console.warn("Job fetch failed, using mock data:", data.error);
    return getMockJobs(primaryState, keywords);
  }

  if (!data.jobs || data.jobs.length === 0) {
    return getMockJobs(primaryState, keywords, timeFilter);
  }

  return { jobs: data.jobs, total: data.total };
}

// ── Fallback mock data ───────────────────────────────────────────────────────

function getMockJobs(state, keywords, timeFilter = "") {
  const titles = [
    "Senior Software Engineer", "Product Manager", "Data Scientist",
    "DevOps Engineer", "Frontend Developer", "Backend Engineer",
    "Full Stack Developer", "UX Designer", "Digital Marketing Manager",
    "Sales Executive", "Cloud Architect", "Machine Learning Engineer",
    "React Developer", "Node.js Developer", "QA Engineer",
    "Cybersecurity Analyst", "Database Administrator", "Scrum Master",
    "Business Analyst", "Java Developer", "Python Developer",
  ];

  const companies = [
    "Infosys", "TCS", "Wipro", "HCL Technologies", "Tech Mahindra",
    "Flipkart", "Swiggy", "Zomato", "Razorpay", "Freshworks",
    "Zoho Corp", "Byju's", "Ola Cabs", "Paytm", "PhonePe",
    "HDFC Bank Tech", "Cognizant", "Accenture India", "IBM India", "Capgemini",
  ];

  const types = ["Full-time", "Part-time", "Contract", "Remote", "Hybrid", "Internship"];
  const salaries = [
    "₹6L – ₹10L PA", "₹10L – ₹18L PA", "₹18L – ₹30L PA",
    "₹8L – ₹14L PA", "₹4L – ₹7L PA", "₹25L – ₹45L PA",
    "₹3L – ₹5L PA", null,
  ];
  const stateCity = {
    Karnataka: "Bengaluru", Maharashtra: "Mumbai", "Tamil Nadu": "Chennai",
    Telangana: "Hyderabad", "Delhi (NCT)": "New Delhi", "West Bengal": "Kolkata",
    Gujarat: "Ahmedabad", Haryana: "Gurugram", Punjab: "Chandigarh",
    "Uttar Pradesh": "Noida",
  };
  const city = stateCity[state] || state;
  const kw = keywords.toLowerCase();
  const pool = kw ? titles.filter((t) => t.toLowerCase().includes(kw)) : titles;
  const src = pool.length ? pool : titles;

  // Determine max age in hours for mock spread
  const maxH = timeFilter
    ? timeFilter.endsWith("h") ? parseInt(timeFilter)
    : timeFilter.endsWith("d") ? parseInt(timeFilter) * 24
    : 168
    : 168;

  const jobs = Array.from({ length: 20 }, (_, i) => {
    const hoursAgo = Math.floor(Math.random() * maxH);
    const posted = new Date();
    posted.setHours(posted.getHours() - hoursAgo);
    return {
      id: `mock-${state}-${i}-${Date.now()}`,
      source: "naukri",
      title: src[i % src.length],
      company: companies[i % companies.length],
      companyLogo: null,
      location: `${city}, ${state}`,
      experience: `${i % 5 + 1}-${i % 5 + 4} Yrs`,
      salary: salaries[i % salaries.length],
      description: `${companies[i % companies.length]} is hiring a ${src[i % src.length]} in ${city}. You will work on exciting products, collaborate cross-functionally, and drive impact at scale.`,
      skills: ["Communication", "Problem Solving", "Teamwork"].slice(0, 2),
      jobType: types[i % types.length],
      category: "IT & Software",
      postedAt: posted.toISOString(),
      url: `https://www.naukri.com/${src[i % src.length].toLowerCase().replace(/\s+/g, "-")}-jobs`,
    };
  });

  return { jobs, total: 250 };
}
