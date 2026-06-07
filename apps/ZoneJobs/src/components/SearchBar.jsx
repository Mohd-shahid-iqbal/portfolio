import { useState } from "react";
import { Search } from "./Icons";
import StateSelector from "./StateSelector";

function SearchForm({ initialKeywords, onSearch, loading }) {
  const [keywords, setKeywords] = useState(initialKeywords || "");
  const [states, setStates]     = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (states.length === 0) return;
    onSearch({ keywords, states });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {/* Keywords */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="Job title, skills, e.g. React, Java, MBA..."
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 transition-all"
        />
      </div>

      {/* Multi-state selector */}
      <StateSelector value={states} onChange={setStates} />

      {/* Submit */}
      <button
        type="submit"
        disabled={states.length === 0 || loading}
        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-200 dark:shadow-indigo-900/40"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Searching...
          </>
        ) : (
          <>
            <Search className="w-4 h-4" />
            Find Jobs
          </>
        )}
      </button>
    </form>
  );
}

export default function SearchBar({ onSearch, loading, prefillKeywords }) {
  return (
    <section id="search" className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg dark:shadow-slate-900/50 p-6 sm:p-8 border border-slate-100 dark:border-slate-700 transition-colors">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Search Jobs</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
        Pick one or more states — or choose All India / Remote.
      </p>
      <SearchForm
        key={prefillKeywords}
        initialKeywords={prefillKeywords}
        onSearch={onSearch}
        loading={loading}
      />
    </section>
  );
}
