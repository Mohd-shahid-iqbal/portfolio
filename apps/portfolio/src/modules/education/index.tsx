"use client";

import { motion } from "framer-motion";
import { education } from "@/lib/data";

export function EducationModule() {
  return (
    <section id="education" className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-violet-600/6 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
            Academic Background
            <span className="w-6 h-px bg-indigo-400" />
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
            Education
          </h2>
        </motion.div>

        {/* Education cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {education.map((edu, idx) => (
            <motion.div
              key={edu.degree}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 hover:-translate-y-1 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300"
            >
              {/* Degree abbreviation badge */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white mb-6 shadow-lg"
                style={{
                  background:
                    idx === 0
                      ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                      : "linear-gradient(135deg, #06b6d4, #6366f1)",
                }}
              >
                {edu.short}
              </div>

              <h3 className="text-white font-bold text-xl leading-tight mb-1">
                {edu.degree}
              </h3>
              <p className="text-indigo-400 font-medium text-sm mb-1">{edu.university}</p>
              <p className="text-slate-500 text-xs flex items-center gap-1 mb-6">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {edu.location} · {edu.period}
              </p>

              {/* CGPA */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/8">
                <div>
                  <div className="text-slate-500 text-xs mb-0.5">CGPA</div>
                  <div
                    className="text-3xl font-black"
                    style={{
                      background:
                        idx === 0
                          ? "linear-gradient(135deg, #6366f1, #a78bfa)"
                          : "linear-gradient(135deg, #06b6d4, #6366f1)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {edu.cgpa}
                  </div>
                  <div className="text-slate-500 text-xs">/ 10.0</div>
                </div>

                {/* Progress arc */}
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      fill="none"
                      stroke="rgba(255,255,255,0.06)"
                      strokeWidth="6"
                    />
                    <motion.circle
                      cx="32"
                      cy="32"
                      r="26"
                      fill="none"
                      stroke={idx === 0 ? "#8b5cf6" : "#06b6d4"}
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 26}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 26 }}
                      whileInView={{
                        strokeDashoffset:
                          2 * Math.PI * 26 * (1 - parseFloat(edu.cgpa) / 10),
                      }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: idx * 0.2 + 0.3 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {Math.round((parseFloat(edu.cgpa) / 10) * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-slate-500 text-xs mt-3">{edu.highlight}</p>
            </motion.div>
          ))}
        </div>

        {/* University note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 text-center"
        >
          <p className="text-slate-600 text-sm">
            Both degrees from{" "}
            <span className="text-slate-400 font-medium">Jamia Hamdard University</span>
            , New Delhi — a leading UGC-recognized institution.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
