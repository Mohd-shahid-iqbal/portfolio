import { Briefcase, Heart } from "./Icons";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 transition-colors mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white">
              Zone<span className="text-indigo-600 dark:text-indigo-400">Jobs</span>
            </span>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for job seekers across the US
          </p>

          <p className="text-xs text-slate-400 dark:text-slate-500">
            © {new Date().getFullYear()} ZoneJobs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
