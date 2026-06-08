export const personalInfo = {
  name: "Mohd Shahid Iqbal",
  firstName: "Shahid",
  title: "Frontend Developer",
  roles: [
    "Frontend Developer",
    "React Specialist",
    "Micro Frontend Architect",
    "UI/UX Engineer",
  ],
  tagline:
    "Crafting high-performance trading platforms & enterprise web experiences",
  email: "khansaif59@gmail.com",
  phone: "+91 9654627814",
  linkedin: "https://www.linkedin.com/in/mohd-shahid-iqbal-2b690713b",
  location: "New Delhi, India",
  summary:
    "Distinguished Frontend Developer with over 5 years of experience specializing in React and modern web technologies. Expert in architecting high-performance systems, including real-time trading platforms handling concurrent data for 6000+ stocks. Proven track record in optimizing application stability, implementing Micro Frontends, and mentoring engineering teams to achieve high-quality deliverables.",
};

export const stats = [
  {
    value: "5+",
    label: "Years Experience",
    description: "Building production apps",
  },
  {
    value: "6K+",
    label: "Stocks Streamed",
    description: "Live concurrent WebSocket feeds",
  },
  {
    value: "60%",
    label: "Reusability Boost",
    description: "Via Storybook component system",
  },
  {
    value: "50%",
    label: "UI Lag Reduced",
    description: "React memoization & optimization",
  },
];

export const skillCategories = [
  {
    id: "languages",
    label: "Languages",
    color: "indigo" as const,
    icon: "code",
    skills: ["JavaScript (ES6+)", "TypeScript", "Java", "HTML5", "CSS3"],
  },
  {
    id: "frontend",
    label: "Frontend",
    color: "violet" as const,
    icon: "layout",
    skills: [
      "React",
      "Next.js",
      "Micro Frontends",
      "Storybook",
      "React Native",
    ],
  },
  {
    id: "backend",
    label: "Backend",
    color: "cyan" as const,
    icon: "server",
    skills: ["Node.js", "Express.js", "Spring Boot"],
  },
  {
    id: "styling",
    label: "UI & Styling",
    color: "emerald" as const,
    icon: "palette",
    skills: [
      "Tailwind CSS",
      "Chakra UI",
      "Material UI (MUI)",
      "Styled Components",
    ],
  },
  {
    id: "devops",
    label: "DevOps & Tools",
    color: "amber" as const,
    icon: "settings",
    skills: ["CI/CD Pipelines", "Docker", "Maven", "Git", "Jenkins", "Jira"],
  },
  {
    id: "databases",
    label: "Databases",
    color: "rose" as const,
    icon: "database",
    skills: ["MySQL", "SQL Server", "MongoDB"],
  },
];

export const experience = [
  {
    id: "pocketful",
    company: "Pace Stock Broking Services Pvt. Ltd.",
    product: "Pocketful",
    role: "SDE III (Frontend)",
    location: "New Delhi",
    period: "March 2023 – Present",
    current: true,
    color: "#6366f1",
    highlights: [
      "Architected Micro Frontend architecture to modularize the trading platform, enabling independent deployments and scaling of specific stock management modules.",
      "Built highly responsive and accessible trading dashboard using Tailwind CSS and Chakra UI, ensuring seamless UX across all devices.",
      "Engineered robust data management system handling live data streams for 6,000+ stocks concurrently via optimized WebSocket pipelines.",
      "Implemented Storybook with Tailwind CSS, increasing UI component reusability by 60% and accelerating the feature release cycle by 3 weeks.",
      "Integrated CI/CD pipelines automating testing and deployment processes for swift, stable application updates.",
      "Reduced UI lag by 50% during peak market volatility via high-concurrency data engine using WebSockets and React memoization.",
    ],
    tech: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Chakra UI",
      "WebSockets",
      "Storybook",
      "MFE",
      "CI/CD",
    ],
  },
  {
    id: "vendify",
    company: "Vendify Private Limited",
    product: "Vendify",
    role: "Senior React Developer",
    location: "Noida, Delhi NCR",
    period: "May 2022 – March 2023",
    current: false,
    color: "#8b5cf6",
    highlights: [
      "Utilized Material UI (MUI) to rapidly prototype and deploy enterprise-grade web applications focusing on clean design and modularity.",
      "Provided technical guidance to junior developers, fostering team confidence through collaborative code reviews.",
      "Identified, diagnosed, and remediated complex website performance bottlenecks and formatting errors.",
    ],
    tech: ["React", "Material UI", "JavaScript", "REST APIs", "Git"],
  },
  {
    id: "simpana",
    company: "Simpana Technology Private Limited",
    product: "Simpana",
    role: "Software Developer",
    location: "Ghaziabad, UP",
    period: "Aug 2020 – May 2022",
    current: false,
    color: "#06b6d4",
    highlights: [
      "Full Stack Developer implementing and updating application modules for Inventory and Warehouse Management systems.",
      "Developed cross-platform mobile applications using React Native for both iOS and Android platforms.",
      "Managed backend data architecture using SQL Server and Spring Boot RESTful APIs.",
    ],
    tech: ["React Native", "Spring Boot", "SQL Server", "Java", "JavaScript"],
  },
];

export const projects = [
  {
    id: "pocketful-trading",
    title: "Pocketful Trading Platform",
    subtitle: "Real-time stock trading dashboard",
    description:
      "High-performance Micro Frontend trading platform handling live data streams for 6,000+ concurrent stocks. Features real-time WebSocket integration, advanced charting, and a component-driven UI built with Storybook.",
    metrics: [
      { label: "Live Stocks", value: "6,000+" },
      { label: "UI Lag Reduced", value: "50%" },
      { label: "Component Reuse", value: "60%↑" },
    ],
    tech: [
      "React",
      "TypeScript",
      "WebSockets",
      "Tailwind CSS",
      "Chakra UI",
      "MFE",
      "Storybook",
    ],
    color: "indigo",
    category: "Trading Platform",
    featured: true,
  },
  {
    id: "mfe-architecture",
    title: "Micro Frontend Architecture",
    subtitle: "Modular monolith → distributed UI",
    description:
      "Designed and implemented a scalable Micro Frontend architecture that decomposed a monolithic trading app into independently deployable modules, enabling team autonomy and faster release cycles.",
    metrics: [
      { label: "Release Cycle", value: "3wk faster" },
      { label: "Modules", value: "Independent" },
      { label: "Teams Unblocked", value: "✓" },
    ],
    tech: [
      "Module Federation",
      "React",
      "Webpack",
      "CI/CD",
      "Docker",
      "Jenkins",
    ],
    color: "violet",
    category: "Architecture",
    featured: true,
  },
  {
    id: "ui-component-library",
    title: "Design System & Component Library",
    subtitle: "Storybook-powered UI components",
    description:
      "Built a comprehensive design system with Storybook, standardizing UI components across the entire organization. Includes interactive documentation, accessibility checks, and automated visual testing.",
    metrics: [
      { label: "Components", value: "50+" },
      { label: "Dev Velocity", value: "60%↑" },
      { label: "Consistency", value: "100%" },
    ],
    tech: [
      "Storybook",
      "React",
      "Tailwind CSS",
      "TypeScript",
      "Chromatic",
      "A11y",
    ],
    color: "cyan",
    category: "Design System",
    featured: true,
    storybookLink: true,
  },
  {
    id: "vendify-ecommerce",
    title: "Vendify E-commerce Platform",
    subtitle: "Enterprise-grade web application",
    description:
      "Built enterprise-grade e-commerce web application with Material UI, focusing on clean design, modularity, and performance. Mentored junior developers and established code quality standards.",
    metrics: [
      { label: "Performance", value: "Optimized" },
      { label: "Team", value: "Mentored" },
      { label: "Stack", value: "React + MUI" },
    ],
    tech: ["React", "Material UI", "JavaScript", "Node.js", "REST APIs"],
    color: "emerald",
    category: "E-commerce",
    featured: false,
  },
  {
    id: "zonejobs",
    title: "ZoneJobs",
    subtitle: "AI-powered India job aggregator",
    description:
      "Full-stack job portal aggregating live listings from Naukri, Adzuna & Remotive across all 28 Indian states. Upload your resume — the client-side PDF/DOCX parser extracts skills and auto-populates the search. Puppeteer-powered scraper with stealth mode, state-based filtering, time-range filters, and dark/light mode.",
    metrics: [
      { label: "Job Sources", value: "3 APIs" },
      { label: "States", value: "36 UTs" },
      { label: "Resume Parse", value: "Client-side" },
    ],
    tech: [
      "React 19",
      "Tailwind v4",
      "Puppeteer",
      "Express",
      "PDF.js",
      "Mammoth",
      "Vite",
    ],
    color: "cyan",
    category: "Full-Stack · SaaS",
    featured: true,
    livePreviewPath: "/demos/zonejobs/index.html",
  },
  {
    id: "wake-guard",
    title: "Wake Guard",
    subtitle: "Screen sleep prevention tool",
    description:
      "Interactive tool that uses the browser's Wake Lock API to prevent your screen from sleeping. Features orbiting particle rings, pulsing wave animations, a live active-duration timer, and graceful re-acquisition when tabs regain focus.",
    metrics: [
      { label: "API", value: "Wake Lock" },
      { label: "Animations", value: "Pure CSS" },
      { label: "Re-acquire", value: "Auto" },
    ],
    tech: ["React 19", "Wake Lock API", "CSS Animations", "Vite"],
    color: "violet",
    category: "Browser API Tool",
    featured: true,
    livePreviewPath: "/demos/wake-guard/index.html",
  },
  {
    id: "feed-delay-dashboard",
    title: "Feed Delay Dashboard",
    subtitle: "Real-time WebSocket market data monitor",
    description:
      "Live stock market dashboard that connects to Pocketful's WebSocket feed and measures the delay between exchange trade time and data arrival. Tracks NIFTY 50, Bank Nifty, SENSEX and MCX with sparklines, flash ticks, and per-instrument latency history.",
    metrics: [
      { label: "Instruments", value: "Live 4" },
      { label: "Protocol", value: "Binary WS" },
      { label: "Latency", value: "Tracked" },
    ],
    tech: ["React 19", "WebSockets", "Binary Protocol", "Vite", "Sparklines"],
    color: "indigo",
    category: "Trading Tool",
    featured: true,
    livePreviewPath: "/demos/feed-delay/index.html",
  },
  {
    id: "inventory-management",
    title: "Inventory & Warehouse System",
    subtitle: "Full-stack management platform",
    description:
      "Full-stack inventory and warehouse management system built with React Native (mobile) and Spring Boot (backend), featuring real-time stock tracking, barcode scanning, and SQL Server integration.",
    metrics: [
      { label: "Platform", value: "Cross-platform" },
      { label: "Backend", value: "Spring Boot" },
      { label: "DB", value: "SQL Server" },
    ],
    tech: ["React Native", "Spring Boot", "SQL Server", "Java", "REST APIs"],
    color: "amber",
    category: "Mobile + Backend",
    featured: false,
  },
];

export const education = [
  {
    degree: "Masters in Computer Application",
    short: "MCA",
    university: "Jamia Hamdard University",
    location: "New Delhi",
    period: "Aug 2017 – Aug 2020",
    cgpa: "8.7",
    highlight: "Gold standard CGPA",
  },
  {
    degree: "Bachelors in Computer Application",
    short: "BCA",
    university: "Jamia Hamdard University",
    location: "New Delhi",
    period: "Aug 2014 – Aug 2017",
    cgpa: "6.5",
    highlight: "Foundation in CS",
  },
];
