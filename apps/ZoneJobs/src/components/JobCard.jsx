import { MapPin, Clock, DollarSign, Building2, ExternalLink, Bookmark, Briefcase } from "./Icons";
import { useState } from "react";

const SOURCE_META = {
  naukri:    { label: "Naukri",    style: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800" },
  adzuna:    { label: "Adzuna",    style: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800" },
  remotive:  { label: "Remotive",  style: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800" },
  arbeitnow: { label: "Arbeitnow", style: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800" },
  linkedin:  { label: "LinkedIn",  style: "bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800" },
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

const TYPE_COLORS = {
  "Full-time":   "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
  "Part-time":   "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
  "Contract":    "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  "Remote":      "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
  "Hybrid":      "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400",
  "Internship":  "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400",
};

export default function JobCard({ job }) {
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const typeColor = TYPE_COLORS[job.jobType] || "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300";

  const initials   = job.company?.slice(0, 2).toUpperCase() || "JB";
  const sourceMeta = SOURCE_META[job.source] || SOURCE_META.naukri;

  return (
    <div className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-700 hover:shadow-lg dark:hover:shadow-slate-900/50 transition-all duration-200 overflow-hidden flex flex-col">
      <div className="p-5 sm:p-6 flex flex-col flex-1">

        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Logo / initials */}
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={job.company}
                className="w-11 h-11 rounded-xl object-contain bg-white border border-slate-100 dark:border-slate-700 p-1 shrink-0"
                onError={(e) => { e.target.style.display = "none"; }}
              />
            ) : (
              <div className="w-11 h-11 rounded-xl bg-linear-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 flex items-center justify-center shrink-0 font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base leading-snug line-clamp-2">
                {job.title}
              </h3>
              <div className="flex items-center gap-1 mt-0.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-xs text-slate-500 dark:text-slate-400 truncate">{job.company}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Source badge */}
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${sourceMeta.style}`}>
              {sourceMeta.label}
            </span>

            <button
            onClick={() => setSaved((s) => !s)}
            aria-label="Save job"
            className={`p-1.5 rounded-lg transition-colors shrink-0 ${
              saved
                ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30"
                : "text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
          </button>
          </div>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-x-3 gap-y-1.5 mb-4">
          {job.location && (
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate max-w-35">{job.location}</span>
            </div>
          )}
          {job.experience && (
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <Briefcase className="w-3.5 h-3.5 shrink-0" />
              {job.experience}
            </div>
          )}
          {job.salary && (
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <DollarSign className="w-3.5 h-3.5 shrink-0" />
              {job.salary}
            </div>
          )}
          <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            {timeAgo(job.postedAt)}
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${typeColor}`}>
            {job.jobType}
          </span>
          {job.category && job.category !== "General" && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
              {job.category}
            </span>
          )}
        </div>

        {/* Skills chips from Naukri */}
        {job.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {job.skills.map((skill) => (
              <span
                key={skill}
                className="text-xs px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        {job.description && (
          <>
            <p className={`text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-2 ${expanded ? "" : "line-clamp-2"}`}>
              {job.description}
            </p>
            {job.description.length > 100 && (
              <button
                onClick={() => setExpanded((e) => !e)}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline mb-3 block"
              >
                {expanded ? "Show less" : "Read more"}
              </button>
            )}
          </>
        )}

        {/* CTA — pushed to bottom */}
        <div className="mt-auto pt-2">
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-sm font-semibold transition-colors"
          >
            Apply on {sourceMeta.label}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
