import { Clock } from "./Icons";

const FILTERS = [
  { label: "Any time", value: "" },
  { label: "1 hour",   value: "1h" },
  { label: "2 hours",  value: "2h" },
  { label: "3 hours",  value: "3h" },
  { label: "6 hours",  value: "6h" },
  { label: "12 hours", value: "12h" },
  { label: "24 hours", value: "24h" },
  { label: "3 days",   value: "3d" },
  { label: "7 days",   value: "7d" },
];

export default function TimeFilter({ value, onChange }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-4 sm:p-5 transition-colors">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-indigo-500" />
        <span className="text-sm font-semibold text-slate-900 dark:text-white">Posted within</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => onChange(f.value)}
            className={`
              px-3 py-1.5 rounded-full text-xs font-medium border transition-all
              ${value === f.value
                ? "bg-indigo-600 dark:bg-indigo-500 text-white border-indigo-600 dark:border-indigo-500 shadow-sm"
                : "bg-slate-50 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400"
              }
            `}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
