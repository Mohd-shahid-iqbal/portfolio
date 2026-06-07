import { X, Loader2, Sparkles, ChevronDown, ChevronUp } from "./Icons";
import { useState } from "react";

const TYPE_STYLES = {
  role:       "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700",
  experience: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700",
  education:  "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700",
  languages:  "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700",
  frontend:   "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-700",
  backend:    "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-700",
  mobile:     "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700",
  databases:  "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700",
  cloud:      "bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-700",
  data:       "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-700",
  tools:      "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600",
  finance:    "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700",
  marketing:  "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-700",
};

const TYPE_LABELS = {
  role: "Role", experience: "Experience", education: "Education",
  languages: "Languages", frontend: "Frontend", backend: "Backend",
  mobile: "Mobile", databases: "Databases", cloud: "Cloud & DevOps",
  data: "Data & AI", tools: "Tools", finance: "Finance", marketing: "Marketing",
};

const INITIAL_VISIBLE = 12;

export default function ResumeTags({ tags, parsing, onTagClick, onTagRemove }) {
  const [showAll, setShowAll] = useState(false);

  if (parsing) {
    return (
      <div className="flex items-center gap-3 py-4">
        <Loader2 className="w-5 h-5 text-indigo-500 animate-spin flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-slate-900 dark:text-white">Analysing your resume…</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Extracting skills and experience</p>
        </div>
      </div>
    );
  }

  if (!tags || tags.length === 0) return null;

  const visible = showAll ? tags : tags.slice(0, INITIAL_VISIBLE);
  const hasMore = tags.length > INITIAL_VISIBLE;

  // Group by type for the legend hint
  const types = [...new Set(tags.map((t) => t.type))];

  return (
    <div className="mt-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-indigo-500" />
        <span className="text-sm font-semibold text-slate-900 dark:text-white">
          Extracted from resume
        </span>
        <span className="ml-auto text-xs text-slate-400 dark:text-slate-500">
          {tags.length} tag{tags.length !== 1 ? "s" : ""} · click to search
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {visible.map((tag, i) => {
          const style = TYPE_STYLES[tag.type] || TYPE_STYLES.tools;
          return (
            <button
              key={`${tag.label}-${i}`}
              onClick={() => onTagClick?.(tag)}
              className={`
                inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                border transition-all hover:scale-105 hover:shadow-sm active:scale-95
                ${style}
              `}
            >
              {tag.label}
              <span
                role="button"
                aria-label={`Remove ${tag.label}`}
                onClick={(e) => { e.stopPropagation(); onTagRemove?.(tag); }}
                className="opacity-50 hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </span>
            </button>
          );
        })}
      </div>

      {/* Show more / less */}
      {hasMore && (
        <button
          onClick={() => setShowAll((s) => !s)}
          className="mt-3 flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          {showAll ? (
            <><ChevronUp className="w-3.5 h-3.5" /> Show fewer</>
          ) : (
            <><ChevronDown className="w-3.5 h-3.5" /> Show {tags.length - INITIAL_VISIBLE} more</>
          )}
        </button>
      )}

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-wrap gap-x-4 gap-y-1.5">
        {types.map((type) => (
          <span key={type} className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full inline-block ${TYPE_STYLES[type]?.split(" ")[0] || "bg-slate-200"}`} />
            {TYPE_LABELS[type] || type}
          </span>
        ))}
      </div>
    </div>
  );
}
