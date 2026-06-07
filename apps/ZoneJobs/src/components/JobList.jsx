import { useState } from "react";
import { ChevronLeft, ChevronRight, Frown } from "./Icons";
import JobCard from "./JobCard";
import JobFilters from "./JobFilters";

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 sm:p-6 animate-pulse">
      <div className="flex gap-3 mb-4">
        <div className="w-11 h-11 rounded-xl bg-slate-200 dark:bg-slate-700 shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
        </div>
      </div>
      <div className="flex gap-3 mb-4">
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-24" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-20" />
      </div>
      <div className="flex gap-2 mb-4">
        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-full w-16" />
        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-full w-20" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
      </div>
      <div className="h-9 bg-slate-200 dark:bg-slate-700 rounded-xl" />
    </div>
  );
}

const TIME_LABELS = {
  "1h": "last 1 hour", "2h": "last 2 hours", "3h": "last 3 hours",
  "6h": "last 6 hours", "12h": "last 12 hours", "24h": "last 24 hours",
  "3d": "last 3 days", "7d": "last 7 days",
};

const SOURCE_STYLE = {
  naukri:    { label: "Naukri",    bar: "bg-orange-500", pill: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800" },
  linkedin:  { label: "LinkedIn",  bar: "bg-sky-500",    pill: "bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800" },
  adzuna:    { label: "Adzuna",    bar: "bg-blue-500",   pill: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800" },
  remotive:  { label: "Remotive",  bar: "bg-green-500",  pill: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800" },
  arbeitnow: { label: "Arbeitnow", bar: "bg-purple-500", pill: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800" },
};

function SourceBreakdown({ jobs }) {
  const counts = {};
  jobs.forEach((j) => {
    if (!j.source) return;
    counts[j.source] = (counts[j.source] || 0) + 1;
  });
  const total  = jobs.length || 1;
  const entries = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([src, n]) => ({ src, n, pct: Math.round((n / total) * 100) }));

  if (entries.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-4 mb-5 transition-colors">
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
        Jobs by Portal
      </p>

      {/* Stacked progress bar */}
      <div className="flex h-2.5 rounded-full overflow-hidden gap-px mb-4">
        {entries.map(({ src, pct }) => (
          <div
            key={src}
            style={{ width: `${pct}%` }}
            className={`${SOURCE_STYLE[src]?.bar ?? "bg-slate-400"} transition-all`}
            title={`${SOURCE_STYLE[src]?.label ?? src}: ${pct}%`}
          />
        ))}
      </div>

      {/* Pill list */}
      <div className="flex flex-wrap gap-2">
        {entries.map(({ src, n, pct }) => {
          const s = SOURCE_STYLE[src] ?? { label: src, pill: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600" };
          return (
            <span
              key={src}
              className={`inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border font-medium ${s.pill}`}
            >
              <span className={`w-2 h-2 rounded-full ${s.bar} shrink-0`} />
              {s.label}
              <span className="font-bold">{n}</span>
              <span className="opacity-60">({pct}%)</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

// Inner component owns filter state — remounted via `key` when jobs changes,
// so useState initialises fresh without needing an effect.
function FilterableGrid({ jobs, page, onPageChange, totalPages }) {
  const [activeSources, setActiveSources] = useState(new Set());
  const [activeTypes,   setActiveTypes]   = useState(new Set());

  const filteredJobs = jobs.filter((job) => {
    if (activeSources.size > 0 && !activeSources.has(job.source)) return false;
    if (activeTypes.size   > 0 && !activeTypes.has(job.jobType))  return false;
    return true;
  });

  const isFiltered = activeSources.size > 0 || activeTypes.size > 0;

  return (
    <>
      {/* Source breakdown */}
      <SourceBreakdown jobs={jobs} />

      {/* Filter bar */}
      <JobFilters
        jobs={jobs}
        activeSources={activeSources}
        activeTypes={activeTypes}
        onSourcesChange={setActiveSources}
        onTypesChange={setActiveTypes}
      />

      {/* No results after filtering */}
      {filteredJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-2xl">
            🔍
          </div>
          <p className="font-semibold text-slate-900 dark:text-white">No jobs match your filters</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Try removing some portal or job-type filters.
          </p>
        </div>
      ) : (
        <>
          {/* Filtered count hint */}
          {isFiltered && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">
              Showing {filteredJobs.length} of {jobs.length} loaded jobs
            </p>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {/* Pagination — only when not filtering client-side */}
          {!isFiltered && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                  return (
                    <button
                      key={p}
                      onClick={() => onPageChange(p)}
                      className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                        p === page
                          ? "bg-indigo-600 dark:bg-indigo-500 text-white shadow-md"
                          : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default function JobList({ jobs, loading, error, total, page, onPageChange, states, timeFilter }) {
  const totalPages   = Math.ceil(total / 20);
  const stateLabel   = Array.isArray(states) && states.length > 0 ? states.join(", ") : (states || "");
  const gridKey      = jobs ? (jobs[0]?.id || "empty") : "none";

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-40 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
          <Frown className="w-8 h-8 text-red-500" />
        </div>
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">Something went wrong</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!jobs) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <div className="w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
          <span className="text-3xl">🗺️</span>
        </div>
        <div>
          <p className="text-lg font-semibold text-slate-900 dark:text-white">Ready to explore?</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
            Select a state (or All India / Remote) and search to discover the latest job opportunities.
          </p>
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
          <Frown className="w-8 h-8 text-amber-500" />
        </div>
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">No jobs found</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Try different keywords, a different state, or a wider time range.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Results header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            {total.toLocaleString()} jobs in{" "}
            <span className="text-indigo-600 dark:text-indigo-400">{stateLabel}</span>
          </p>
          {timeFilter && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Posted in {TIME_LABELS[timeFilter] || timeFilter}
            </p>
          )}
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Page {page} of {totalPages}
          </p>
        </div>
      </div>

      <FilterableGrid
        key={gridKey}
        jobs={jobs}
        page={page}
        onPageChange={onPageChange}
        totalPages={totalPages}
      />
    </div>
  );
}
