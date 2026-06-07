import { useState } from "react";
import { useTheme } from "./hooks/useTheme";
import { fetchJobs } from "./services/jobsApi";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ResumeUpload from "./components/ResumeUpload";
import ResumeTags from "./components/ResumeTags";
import SearchBar from "./components/SearchBar";
import TimeFilter from "./components/TimeFilter";
import JobList from "./components/JobList";
import Footer from "./components/Footer";

export default function App() {
  const { theme, toggleTheme } = useTheme();

  // Resume state
  const [parsing, setParsing]         = useState(false);
  const [parseError, setParseError]   = useState("");
  const [tags, setTags]               = useState([]);
  const [prefillKeywords, setPrefill] = useState("");

  // Job search state
  const [timeFilter, setTimeFilter]   = useState("");
  const [jobs, setJobs]               = useState(null);
  const [total, setTotal]             = useState(0);
  const [page, setPage]               = useState(1);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [activeSearch, setActive]     = useState(null);

  // ── Resume handlers ───────────────────────────────────────────────────────
  const handleResumeUpload = (file) => {
    if (!file) { setTags([]); setPrefill(""); setParseError(""); }
  };
  const handleParseStart = () => { setParsing(true); setParseError(""); setTags([]); };
  const handleParseDone  = (result) => {
    setParsing(false);
    if (!result) { setTags([]); return; }
    setTags(result.tags);
    if (result.searchQuery) setPrefill(result.searchQuery);
  };
  const handleParseError = (msg) => { setParsing(false); setParseError(msg); };

  const handleTagClick  = (tag) => {
    setPrefill(tag.label);
    document.getElementById("search")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  const handleTagRemove = (tag) => setTags((prev) => prev.filter((t) => t !== tag));

  // ── Job search ────────────────────────────────────────────────────────────
  const runSearch = async ({ keywords, states }, newPage = 1, tf = timeFilter) => {
    setLoading(true);
    setError("");
    setPage(newPage);
    setActive({ keywords, states });
    try {
      const result = await fetchJobs({ states, keywords, page: newPage, timeFilter: tf });
      setJobs(result.jobs);
      setTotal(result.total);
      if (newPage === 1) {
        setTimeout(() => {
          document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch     = (params, pg = 1) => runSearch(params, pg);
  const handlePageChange = (newPage) => {
    if (activeSearch) { runSearch(activeSearch, newPage); window.scrollTo({ top: 0, behavior: "smooth" }); }
  };
  const handleTimeFilterChange = (val) => {
    setTimeFilter(val);
    if (activeSearch) runSearch(activeSearch, 1, val);
  };

  // Hero search bar → pre-fills keywords and scrolls to the state selector
  const handleHeroSearch = (keyword) => {
    setPrefill(keyword);
    document.getElementById("search")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      <Header theme={theme} toggleTheme={toggleTheme} />

      <main>
        <Hero onHeroSearch={handleHeroSearch} />

        {/* Upload + Search section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">

            {/* Resume upload panel */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 sm:p-8 transition-colors">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Your Resume</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
                  Upload to auto-extract skills and search matching jobs.
                </p>
                <ResumeUpload
                  onResumeUpload={handleResumeUpload}
                  onParseStart={handleParseStart}
                  onParseDone={handleParseDone}
                  onParseError={handleParseError}
                />
                {parseError && (
                  <p className="mt-3 text-xs text-red-600 dark:text-red-400">{parseError}</p>
                )}
                <ResumeTags
                  tags={tags}
                  parsing={parsing}
                  onTagClick={handleTagClick}
                  onTagRemove={handleTagRemove}
                />
              </div>
            </div>

            {/* Search + filter panel */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              <SearchBar
                onSearch={handleSearch}
                loading={loading}
                prefillKeywords={prefillKeywords}
              />
              <TimeFilter value={timeFilter} onChange={handleTimeFilterChange} />

              {/* Tips */}
              <div className="bg-linear-to-br from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 rounded-2xl p-6 text-white">
                <h3 className="font-semibold text-lg mb-2">Pro Tips</h3>
                <ul className="space-y-2">
                  {[
                    "Search by role in the hero bar — it fills the keyword field automatically",
                    "Upload your resume to auto-extract and search by your skills",
                    "Click any skill tag to instantly search that technology",
                  ].map((tip) => (
                    <li key={tip} className="flex items-start gap-2 text-sm text-indigo-100">
                      <span className="text-indigo-300 mt-0.5 shrink-0">→</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section id="results" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 scroll-mt-20">
          <JobList
            jobs={jobs}
            loading={loading}
            error={error}
            total={total}
            page={page}
            onPageChange={handlePageChange}
            states={activeSearch?.states}
            timeFilter={timeFilter}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}
