import { X } from "./Icons";

const SOURCES = [
  { key: "naukri",    label: "Naukri",    active: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-300 dark:border-orange-700", hover: "hover:bg-orange-50 dark:hover:bg-orange-900/10 hover:border-orange-200 dark:hover:border-orange-800" },
  { key: "linkedin",  label: "LinkedIn",  active: "bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 border-sky-300 dark:border-sky-700",                   hover: "hover:bg-sky-50 dark:hover:bg-sky-900/10 hover:border-sky-200 dark:hover:border-sky-800" },
  { key: "adzuna",    label: "Adzuna",    active: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-700",              hover: "hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:border-blue-200 dark:hover:border-blue-800" },
  { key: "remotive",  label: "Remotive",  active: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700",        hover: "hover:bg-green-50 dark:hover:bg-green-900/10 hover:border-green-200 dark:hover:border-green-800" },
  { key: "arbeitnow", label: "Arbeitnow", active: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-700",  hover: "hover:bg-purple-50 dark:hover:bg-purple-900/10 hover:border-purple-200 dark:hover:border-purple-800" },
];

const JOB_TYPES = ["Full-time", "Remote", "Hybrid", "Contract", "Internship", "Part-time"];

const BASE_CHIP = "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700";

function CountBadge({ count, active }) {
  return (
    <span className={`text-[10px] font-bold px-1 py-0.5 rounded-full leading-none ${
      active ? "bg-white/40 dark:bg-black/20" : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
    }`}>
      {count}
    </span>
  );
}

export default function JobFilters({ jobs = [], activeSources, activeTypes, onSourcesChange, onTypesChange }) {
  const sourceCounts = {};
  const typeCounts   = {};
  jobs.forEach((j) => {
    sourceCounts[j.source] = (sourceCounts[j.source] || 0) + 1;
    typeCounts[j.jobType]  = (typeCounts[j.jobType]  || 0) + 1;
  });

  const toggleSource = (key) => {
    const next = new Set(activeSources);
    next.has(key) ? next.delete(key) : next.add(key);
    onSourcesChange(next);
  };

  const toggleType = (type) => {
    const next = new Set(activeTypes);
    next.has(type) ? next.delete(type) : next.add(type);
    onTypesChange(next);
  };

  const hasFilters    = activeSources.size > 0 || activeTypes.size > 0;
  const visibleSrc    = SOURCES.filter((s)  => sourceCounts[s.key] > 0);
  const visibleTypes  = JOB_TYPES.filter((t) => typeCounts[t] > 0);

  if (visibleSrc.length === 0 && visibleTypes.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-4 mb-5 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
          Filter Results
        </p>
        {hasFilters && (
          <button
            onClick={() => { onSourcesChange(new Set()); onTypesChange(new Set()); }}
            className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <X className="w-3 h-3" /> Clear all
          </button>
        )}
      </div>

      {/* Source portal chips */}
      {visibleSrc.length > 0 && (
        <div className="mb-3">
          <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mb-2">Job Portal</p>
          <div className="flex flex-wrap gap-1.5">
            {visibleSrc.map((s) => {
              const on = activeSources.has(s.key);
              return (
                <button
                  key={s.key}
                  onClick={() => toggleSource(s.key)}
                  className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-all ${
                    on ? s.active : `${BASE_CHIP} ${s.hover}`
                  }`}
                >
                  {s.label}
                  <CountBadge count={sourceCounts[s.key]} active={on} />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Job type chips */}
      {visibleTypes.length > 0 && (
        <div>
          <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mb-2">Job Type</p>
          <div className="flex flex-wrap gap-1.5">
            {visibleTypes.map((t) => {
              const on = activeTypes.has(t);
              return (
                <button
                  key={t}
                  onClick={() => toggleType(t)}
                  className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-all ${
                    on
                      ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700"
                      : `${BASE_CHIP} hover:bg-indigo-50 dark:hover:bg-indigo-900/10 hover:border-indigo-200 dark:hover:border-indigo-700`
                  }`}
                >
                  {t === "Remote" ? "🌐 Remote" : t}
                  <CountBadge count={typeCounts[t]} active={on} />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
