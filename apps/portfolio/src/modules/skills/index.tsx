"use client";

import { motion } from "framer-motion";
import { skillCategories } from "@/lib/data";

const colorMap = {
  indigo: {
    border: "border-indigo-500/30",
    bg: "bg-indigo-500/10",
    text: "text-indigo-300",
    headBg: "bg-indigo-500/15",
    headText: "text-indigo-200",
    glow: "hover:shadow-indigo-500/20",
    dot: "bg-indigo-400",
  },
  violet: {
    border: "border-violet-500/30",
    bg: "bg-violet-500/10",
    text: "text-violet-300",
    headBg: "bg-violet-500/15",
    headText: "text-violet-200",
    glow: "hover:shadow-violet-500/20",
    dot: "bg-violet-400",
  },
  cyan: {
    border: "border-cyan-500/30",
    bg: "bg-cyan-500/10",
    text: "text-cyan-300",
    headBg: "bg-cyan-500/15",
    headText: "text-cyan-200",
    glow: "hover:shadow-cyan-500/20",
    dot: "bg-cyan-400",
  },
  emerald: {
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10",
    text: "text-emerald-300",
    headBg: "bg-emerald-500/15",
    headText: "text-emerald-200",
    glow: "hover:shadow-emerald-500/20",
    dot: "bg-emerald-400",
  },
  amber: {
    border: "border-amber-500/30",
    bg: "bg-amber-500/10",
    text: "text-amber-300",
    headBg: "bg-amber-500/15",
    headText: "text-amber-200",
    glow: "hover:shadow-amber-500/20",
    dot: "bg-amber-400",
  },
  rose: {
    border: "border-rose-500/30",
    bg: "bg-rose-500/10",
    text: "text-rose-300",
    headBg: "bg-rose-500/15",
    headText: "text-rose-200",
    glow: "hover:shadow-rose-500/20",
    dot: "bg-rose-400",
  },
};

const categoryIcons: Record<string, string> = {
  languages: "{ }",
  frontend: "⚛️",
  backend: "⚙️",
  styling: "🎨",
  devops: "🚀",
  databases: "🗄️",
};

export function SkillsModule() {
  return (
    <section id="skills" className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="inline-flex items-center gap-2 text-sm font-medium text-indigo-400 uppercase tracking-widest mb-4">
            <span className="w-6 h-px bg-indigo-400" />
            What I Use
            <span className="w-6 h-px bg-indigo-400" />
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            Technical Skills
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            A curated toolkit built over 5+ years of crafting production-grade applications.
          </p>
        </motion.div>

        {/* Skill grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skillCategories.map((cat, catIdx) => {
            const colors = colorMap[cat.color];
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: catIdx * 0.08 }}
                className={`group relative rounded-2xl border ${colors.border} bg-white/5 backdrop-blur-sm p-6 hover:-translate-y-1 hover:shadow-lg ${colors.glow} transition-all duration-300`}
              >
                {/* Category header */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className={`w-10 h-10 rounded-xl ${colors.headBg} ${colors.border} border flex items-center justify-center text-lg font-mono font-bold ${colors.headText}`}
                  >
                    {categoryIcons[cat.id]}
                  </div>
                  <h3 className="text-white font-semibold text-base">{cat.label}</h3>
                </div>

                {/* Skill badges */}
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill, skillIdx) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: catIdx * 0.08 + skillIdx * 0.04 }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${colors.bg} ${colors.text} border ${colors.border} font-mono hover:scale-105 transition-transform cursor-default`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                      {skill}
                    </motion.span>
                  ))}
                </div>

                {/* Subtle gradient accent at bottom */}
                <div
                  className={`absolute bottom-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, currentColor, transparent)",
                  }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Bottom banner */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 p-6 rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-500/10 via-violet-500/5 to-cyan-500/10 backdrop-blur-sm text-center"
        >
          <p className="text-slate-300 text-sm">
            <span className="text-indigo-400 font-semibold">Always learning.</span>{" "}
            Currently deepening expertise in{" "}
            <span className="text-violet-400 font-medium">React Server Components</span>,{" "}
            <span className="text-cyan-400 font-medium">Module Federation 2.0</span>, and{" "}
            <span className="text-indigo-400 font-medium">Edge Runtime performance</span>.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
