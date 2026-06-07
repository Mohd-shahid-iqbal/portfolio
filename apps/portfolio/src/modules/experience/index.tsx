"use client";

import { motion } from "framer-motion";
import { experience } from "@/lib/data";

export function ExperienceModule() {
  return (
    <section id="experience" className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute right-0 top-1/3 w-96 h-96 bg-violet-600/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
            Career
            <span className="w-6 h-px bg-indigo-400" />
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            Professional Experience
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            5+ years building high-impact products across trading, e-commerce, and enterprise software.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/50 via-violet-500/30 to-transparent" />

          <div className="space-y-10">
            {experience.map((exp, idx) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className={`relative flex flex-col md:flex-row gap-0 md:gap-8 ${
                  idx % 2 === 0 ? "" : "md:flex-row-reverse"
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-8 md:left-1/2 top-8 -translate-x-1/2 z-10">
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white/20 shadow-lg"
                    style={{
                      backgroundColor: exp.color,
                      boxShadow: `0 0 16px ${exp.color}60`,
                    }}
                  />
                  {exp.current && (
                    <div
                      className="absolute inset-0 rounded-full animate-ping opacity-60"
                      style={{ backgroundColor: exp.color }}
                    />
                  )}
                </div>

                {/* Date label — hidden on mobile */}
                <div
                  className={`hidden md:flex items-start justify-end w-[calc(50%-2rem)] pt-6 pr-8 ${
                    idx % 2 === 0 ? "" : "justify-start pl-8 pr-0"
                  }`}
                >
                  <span className="text-sm font-medium text-slate-500 whitespace-nowrap">
                    {exp.period}
                  </span>
                </div>

                {/* Card */}
                <div
                  className={`ml-16 md:ml-0 md:w-[calc(50%-2rem)] ${
                    idx % 2 === 0 ? "md:pl-8" : "md:pr-8"
                  }`}
                >
                  <div
                    className={`group relative rounded-2xl border bg-white/5 backdrop-blur-sm p-6 hover:-translate-y-1 transition-all duration-300 hover:shadow-xl ${
                      exp.current
                        ? "border-indigo-500/40 shadow-lg shadow-indigo-500/10"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    {/* Current badge */}
                    {exp.current && (
                      <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-indigo-500 text-white text-xs font-bold shadow-lg">
                        Current
                      </div>
                    )}

                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-white font-bold text-lg leading-tight">
                          {exp.role}
                        </h3>
                        <p className="text-indigo-400 font-medium text-sm mt-0.5">
                          {exp.company}
                        </p>
                        <p className="text-slate-500 text-xs mt-1 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {exp.location}
                        </p>
                      </div>
                      {/* Mobile date */}
                      <span className="md:hidden text-xs text-slate-500 whitespace-nowrap shrink-0 mt-1">
                        {exp.period}
                      </span>
                    </div>

                    {/* Highlights */}
                    <ul className="space-y-2.5 mb-5">
                      {exp.highlights.map((h, hi) => (
                        <li key={hi} className="flex items-start gap-2.5 text-sm text-slate-400">
                          <div
                            className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: exp.color }}
                          />
                          {h}
                        </li>
                      ))}
                    </ul>

                    {/* Tech stack */}
                    <div className="flex flex-wrap gap-1.5">
                      {exp.tech.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-md text-xs font-mono bg-white/8 text-slate-400 border border-white/10"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
