import { useState, useRef, useEffect } from "react";
import { MapPin, ChevronDown, X, Check } from "./Icons";
import { INDIA_STATES } from "../data/states";

const SPECIAL = [
  { code: "ALL",    name: "All India",    desc: "Search across all states" },
  { code: "REMOTE", name: "Remote / WFH", desc: "Work from home & remote jobs" },
];

export default function StateSelector({ value = [], onChange }) {
  const [open, setOpen]     = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (name) => {
    if (name === "All India") {
      onChange(value.includes("All India") ? [] : ["All India"]);
      return;
    }
    const withoutAll = value.filter((v) => v !== "All India");
    if (withoutAll.includes(name)) {
      onChange(withoutAll.filter((v) => v !== name));
    } else {
      onChange([...withoutAll, name]);
    }
  };

  const remove = (name, e) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== name));
  };

  const filteredStates = INDIA_STATES.filter(
    (s) => !search || s.name.toLowerCase().includes(search.toLowerCase())
  );

  const label =
    value.length === 0 ? "Select state, region, or Remote" :
    value.length === 1 ? value[0] :
    `${value.length} locations selected`;

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center pl-10 pr-9 py-3 rounded-xl bg-slate-50 dark:bg-slate-700/60 border text-sm text-left transition-all ${
          open
            ? "border-indigo-400 dark:border-indigo-500 ring-2 ring-indigo-100 dark:ring-indigo-900/40"
            : "border-slate-200 dark:border-slate-600"
        }`}
      >
        <MapPin className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
        <span className={`truncate flex-1 ${value.length > 0 ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-500"}`}>
          {label}
        </span>
        <ChevronDown className={`absolute right-3.5 w-4 h-4 text-slate-400 pointer-events-none transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl dark:shadow-slate-900/60 overflow-hidden">
          <div className="p-2 border-b border-slate-100 dark:border-slate-700">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search state..."
              autoFocus
              className="w-full px-3 py-1.5 text-sm bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-500"
            />
          </div>

          <div className="max-h-64 overflow-y-auto">
            {!search && (
              <>
                {SPECIAL.map((opt) => (
                  <OptionRow
                    key={opt.code}
                    name={opt.name}
                    desc={opt.desc}
                    checked={value.includes(opt.name)}
                    onToggle={toggle}
                    special
                  />
                ))}
                <div className="mx-3 my-1 border-t border-slate-100 dark:border-slate-700" />
              </>
            )}

            {filteredStates.map((s) => (
              <OptionRow
                key={s.code}
                name={s.name}
                checked={value.includes(s.name)}
                onToggle={toggle}
              />
            ))}

            {filteredStates.length === 0 && (
              <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-4">
                No states match "{search}"
              </p>
            )}
          </div>
        </div>
      )}

      {/* Selected chips */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {value.map((v) => (
            <span
              key={v}
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700"
            >
              {v}
              <button
                type="button"
                onClick={(e) => remove(v, e)}
                className="ml-0.5 hover:text-indigo-900 dark:hover:text-indigo-100"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function OptionRow({ name, desc, checked, onToggle, special }) {
  return (
    <button
      type="button"
      onClick={() => onToggle(name)}
      className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors ${
        checked
          ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
          : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60"
      }`}
    >
      <span
        className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 transition-colors ${
          checked
            ? "bg-indigo-600 border-indigo-600 dark:bg-indigo-500 dark:border-indigo-500"
            : "border-slate-300 dark:border-slate-600"
        }`}
      >
        {checked && <Check className="w-2.5 h-2.5 text-white" />}
      </span>
      <span className="min-w-0">
        <span className={special ? "font-medium" : ""}>{name}</span>
        {desc && (
          <span className="block text-[11px] text-slate-400 dark:text-slate-500">{desc}</span>
        )}
      </span>
    </button>
  );
}
