"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/lib/data";
import { PreviewModal } from "@/components/PreviewModal";

const colorMap = {
  indigo: {
    badge: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    tag: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    dot: "bg-indigo-400",
    glow: "hover:shadow-indigo-500/20 hover:border-indigo-500/40",
    metric: "text-indigo-300",
  },
  violet: {
    badge: "bg-violet-500/15 text-violet-300 border-violet-500/30",
    tag: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    dot: "bg-violet-400",
    glow: "hover:shadow-violet-500/20 hover:border-violet-500/40",
    metric: "text-violet-300",
  },
  cyan: {
    badge: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    tag: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    dot: "bg-cyan-400",
    glow: "hover:shadow-cyan-500/20 hover:border-cyan-500/40",
    metric: "text-cyan-300",
  },
  emerald: {
    badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    tag: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    dot: "bg-emerald-400",
    glow: "hover:shadow-emerald-500/20 hover:border-emerald-500/40",
    metric: "text-emerald-300",
  },
  amber: {
    badge: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    tag: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    dot: "bg-amber-400",
    glow: "hover:shadow-amber-500/20 hover:border-amber-500/40",
    metric: "text-amber-300",
  },
};

type ColorKey = keyof typeof colorMap;

type FilterType = "all" | "featured";

export function ProjectsModule() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [previewProject, setPreviewProject] = useState<{ src: string; title: string } | null>(null);

  const filtered = filter === "featured" ? projects.filter((p) => p.featured) : projects;

  return (
    <section id="projects" className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute left-1/3 top-0 w-[500px] h-[500px] bg-indigo-600/6 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="inline-flex items-center gap-2 text-sm font-medium text-indigo-400 uppercase tracking-widest mb-4">
            <span className="w-6 h-px bg-indigo-400" />
            Portfolio
            <span className="w-6 h-px bg-indigo-400" />
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            Selected Projects
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Real-world products and systems I&apos;ve architected and shipped.
          </p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex justify-center gap-2 mb-10"
        >
          {(["all", "featured"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filter === f
                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
                  : "text-slate-400 hover:text-white border border-transparent hover:border-white/10"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Project grid */}
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, idx) => {
              const colors = colorMap[project.color as ColorKey];
              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className={`group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col ${colors.glow}`}
                >
                  {/* Featured star */}
                  {project.featured && (
                    <div className="absolute top-4 right-4">
                      <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${colors.badge}`}>
                        Featured
                      </span>
                    </div>
                  )}

                  {/* Category */}
                  <div className="mb-4">
                    <span className={`text-xs font-semibold uppercase tracking-widest ${colors.metric}`}>
                      {project.category}
                    </span>
                  </div>

                  {/* Title & subtitle */}
                  <h3 className="text-white font-bold text-xl leading-tight mb-1">
                    {project.title}
                  </h3>
                  <p className={`text-sm font-medium mb-4 ${colors.metric}`}>
                    {project.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-slate-400 text-sm leading-relaxed mb-5 flex-1">
                    {project.description}
                  </p>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-2 mb-5 p-3 rounded-xl bg-black/20 border border-white/5">
                    {project.metrics.map((m) => (
                      <div key={m.label} className="text-center">
                        <div className={`font-bold text-sm ${colors.metric}`}>{m.value}</div>
                        <div className="text-slate-600 text-xs mt-0.5">{m.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className={`px-2 py-0.5 rounded-md text-xs font-mono border ${colors.tag}`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Storybook link for component library */}
                  {project.storybookLink && (
                    <div className="mt-4 pt-4 border-t border-white/8">
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M16.71.243l-.12 2.71a.18.18 0 00.29.15l1.06-.8.9.7a.18.18 0 00.28-.14L19 .243h-2.29zM5.232 5.125l-.55-1.94c-.04-.16-.26-.18-.34-.03l-1.28 1.96L.892 5.7c-.17.1-.17.34-.01.44l1.65 1.04-.38 1.99c-.04.18.14.33.31.26l1.64-.86 1.64.86c.17.07.35-.08.31-.26l-.38-1.99 1.65-1.04c.16-.1.16-.34-.01-.44l-2.15-.57zM3.56 11.532c-.14-.27-.52-.27-.66 0l-.77 1.46-1.63.24c-.3.04-.42.4-.2.6l1.18 1.15-.28 1.62c-.05.3.26.53.53.38l1.46-.77 1.46.77c.27.15.58-.08.53-.38l-.28-1.62 1.18-1.15c.22-.2.1-.56-.2-.6l-1.63-.24-.77-1.46zM22.14 8.37c0-3.87-3.32-7-7.43-7-2.76 0-5.16 1.5-6.43 3.73A10.95 10.95 0 004.74 3.5C2.13 3.5 0 5.5 0 7.96c0 2.47 2.13 4.47 4.74 4.47h.37l.14.25c1.22 2.08 3.47 3.5 6.06 3.5 3.87 0 7-3.13 7-7 0-.28-.02-.56-.05-.83A6.98 6.98 0 0022.14 8.37z" />
                        </svg>
                        <span className="text-indigo-400 font-medium">Storybook</span>
                        <span>component library available</span>
                        <span className="ml-auto px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-400 text-xs border border-indigo-500/30">
                          Run: npm run storybook
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Live preview button */}
                  {project.livePreviewPath && (
                    <div className="mt-4 pt-4 border-t border-white/8">
                      <button
                        onClick={() =>
                          setPreviewProject({
                            src: project.livePreviewPath!,
                            title: project.title,
                          })
                        }
                        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg border ${colors.badge} hover:opacity-90`}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Live Preview
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Preview modal */}
      {previewProject && (
        <PreviewModal
          src={previewProject.src}
          title={previewProject.title}
          onClose={() => setPreviewProject(null)}
        />
      )}
    </section>
  );
}
