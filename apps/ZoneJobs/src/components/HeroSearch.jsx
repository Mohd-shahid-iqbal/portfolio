import { useState, useRef, useEffect } from "react";
import { Search, X, TrendingUp } from "./Icons";

const SUGGESTIONS = [
  // Roles
  "Software Engineer", "Frontend Developer", "Backend Developer",
  "Full Stack Developer", "DevOps Engineer", "Data Scientist",
  "Data Analyst", "Data Engineer", "Machine Learning Engineer",
  "Product Manager", "UI/UX Designer", "Mobile Developer",
  "Android Developer", "iOS Developer", "Cloud Architect",
  "Solutions Architect", "Scrum Master", "Business Analyst",
  "QA Engineer", "Cybersecurity Analyst", "Database Administrator",
  "Technical Writer", "HR Manager", "Finance Analyst",
  "Sales Executive", "Marketing Manager",
  // Technologies
  "React", "Angular", "Vue", "Node.js", "Python", "Java",
  "Spring Boot", "Django", "FastAPI", "TypeScript", "Go",
  "Kotlin", "Swift", "Flutter", "React Native",
  "AWS", "Azure", "GCP", "Docker", "Kubernetes",
  "PostgreSQL", "MongoDB", "Redis", "GraphQL",
  "TensorFlow", "PyTorch", "Scikit-learn",
  "Salesforce", "SAP", "Power BI", "Tableau",
];

const POPULAR = [
  "React Developer", "Python Developer", "Data Scientist",
  "DevOps Engineer", "Full Stack Developer", "Product Manager",
  "Java Developer", "Machine Learning Engineer", "UI/UX Designer",
  "Android Developer",
];

export default function HeroSearch({ onSearch }) {
  const [query, setQuery]       = useState("");
  const [open, setOpen]         = useState(false);
  const [highlighted, setHigh]  = useState(-1);
  const inputRef = useRef(null);
  const boxRef   = useRef(null);

  const filtered = query.trim().length > 0
    ? SUGGESTIONS.filter((s) =>
        s.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : [];

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const submit = (value) => {
    const q = (value ?? query).trim();
    if (!q) return;
    setQuery(q);
    setOpen(false);
    onSearch(q);
  };

  const handleKey = (e) => {
    if (!open || filtered.length === 0) {
      if (e.key === "Enter") submit();
      return;
    }
    if (e.key === "ArrowDown") { e.preventDefault(); setHigh((h) => Math.min(h + 1, filtered.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setHigh((h) => Math.max(h - 1, 0)); }
    if (e.key === "Enter")     { e.preventDefault(); if (highlighted >= 0) submit(filtered[highlighted]); else submit(); }
    if (e.key === "Escape")    { setOpen(false); setHigh(-1); }
  };

  const clear = () => { setQuery(""); setOpen(false); inputRef.current?.focus(); };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Search input */}
      <div ref={boxRef} className="relative">
        <div className={`flex items-center gap-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl dark:shadow-slate-900/60 border-2 transition-all ${
          open ? "border-indigo-400 dark:border-indigo-500" : "border-transparent"
        }`}>
          <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 ml-4 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); setHigh(-1); }}
            onFocus={() => { if (query) setOpen(true); }}
            onKeyDown={handleKey}
            placeholder="Search by role, designation, or technology..."
            className="flex-1 py-4 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-base focus:outline-none"
          />
          {query && (
            <button onClick={clear} className="p-1.5 mr-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => submit()}
            className="m-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold text-sm transition-colors shrink-0"
          >
            Search
          </button>
        </div>

        {/* Autocomplete dropdown */}
        {open && filtered.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl dark:shadow-slate-900/60 border border-slate-100 dark:border-slate-700 overflow-hidden z-50">
            {filtered.map((s, i) => (
              <button
                key={s}
                onMouseDown={(e) => { e.preventDefault(); submit(s); }}
                onMouseEnter={() => setHigh(i)}
                className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors ${
                  i === highlighted
                    ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60"
                }`}
              >
                <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {highlightMatch(s, query)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Popular searches */}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mr-1">
          <TrendingUp className="w-3.5 h-3.5" /> Popular:
        </span>
        {POPULAR.map((tag) => (
          <button
            key={tag}
            onClick={() => { setQuery(tag); submit(tag); }}
            className="text-xs px-3 py-1.5 rounded-full bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all shadow-sm"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}

function highlightMatch(text, query) {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1 || !query) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}
