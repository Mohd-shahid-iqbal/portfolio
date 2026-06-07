import { Search, TrendingUp, MapPin } from "./Icons";
import { useStats } from "../hooks/useStats";
import { useCountUp } from "../hooks/useCountUp";
import HeroSearch from "./HeroSearch";

function formatCount(n) {
  if (n >= 10000000) return `${(n / 10000000).toFixed(1)}Cr+`;
  if (n >= 100000)   return `${(n / 100000).toFixed(1)}L+`;
  if (n >= 1000)     return `${(n / 1000).toFixed(0)}k+`;
  return `${n}+`;
}

function StatItem({ icon, value, label, loading }) {
  const count = useCountUp(value, { enabled: !loading && value != null });
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-1">
        {icon}
      </div>
      <span className="text-2xl font-bold text-slate-900 dark:text-white min-w-16 text-center">
        {loading ? (
          <span className="inline-block w-14 h-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        ) : (
          formatCount(count)
        )}
      </span>
      <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
    </div>
  );
}

export default function Hero({ onHeroSearch }) {
  const { stats, loading } = useStats();

  const statItems = [
    { icon: <Search className="w-5 h-5" />, value: stats?.totalJobs,      label: "Active Jobs"    },
    { icon: <MapPin  className="w-5 h-5" />, value: stats?.statesCount,    label: "States & UTs"   },
    { icon: <TrendingUp className="w-5 h-5"/>, value: stats?.totalCompanies, label: "Top Companies"  },
  ];

  return (
    <section className="relative overflow-hidden bg-linear-to-br from-indigo-50 via-white to-orange-50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950 py-14 sm:py-18 lg:py-24 transition-colors">
      {/* Blobs */}
      <div className="absolute top-0 -right-20 w-96 h-96 bg-indigo-200/40 dark:bg-indigo-900/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-20 w-80 h-80 bg-orange-200/30 dark:bg-orange-900/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
          <TrendingUp className="w-4 h-4" />
          Latest jobs updated daily across India
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight mb-4">
          Find Your Dream Job
          <br />
          <span className="text-indigo-600 dark:text-indigo-400">Anywhere in India</span>
        </h1>

        <p className="max-w-xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-8">
          Search by role, designation or technology — powered by Naukri, Adzuna, Remotive &amp; more.
        </p>

        {/* Hero search bar */}
        <HeroSearch onSearch={onHeroSearch} />

        {/* Live stats */}
        <div className="flex flex-wrap justify-center gap-10 mt-12">
          {statItems.map((s) => (
            <StatItem key={s.label} {...s} loading={loading} />
          ))}
        </div>
      </div>
    </section>
  );
}
