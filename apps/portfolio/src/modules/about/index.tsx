"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { personalInfo } from "@/lib/data";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
  }),
};


const ORBIT_TECHS = [
  { name: "React",      label: "⚛  React",      color: "#61DAFB", bg: "rgba(97,218,251,0.08)",  border: "rgba(97,218,251,0.22)" },
  { name: "TypeScript", label: "TS TypeScript",  color: "#60A5FA", bg: "rgba(96,165,250,0.08)",  border: "rgba(96,165,250,0.22)" },
  { name: "Next.js",    label: "▲  Next.js",     color: "#e2e8f0", bg: "rgba(226,232,240,0.06)", border: "rgba(226,232,240,0.18)" },
  { name: "Redux",      label: "⊕  Redux",       color: "#A78BFA", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.22)" },
  { name: "Tailwind",   label: "✦  Tailwind",    color: "#38BDF8", bg: "rgba(56,189,248,0.08)",  border: "rgba(56,189,248,0.22)" },
  { name: "Node.js",    label: "⬡  Node.js",     color: "#4ADE80", bg: "rgba(74,222,128,0.08)",  border: "rgba(74,222,128,0.22)" },
  { name: "Webpack",    label: "⊞  Webpack",     color: "#818CF8", bg: "rgba(129,140,248,0.08)", border: "rgba(129,140,248,0.22)" },
  { name: "GraphQL",    label: "◈  GraphQL",     color: "#F472B6", bg: "rgba(244,114,182,0.08)", border: "rgba(244,114,182,0.22)" },
];

export function AboutModule() {
  const ref = useRef<HTMLDivElement>(null);
  const ORBIT_R = 148; // px from center to badge center
  const SIZE    = 340; // container px

  return (
    <section id="about" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background glow */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── LEFT: Orbital tech stack ── */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex justify-center lg:justify-start"
          >
            {/* Inject keyframes */}
            <style>{`
              @keyframes orbit-cw  { to { transform: rotate( 360deg); } }
              @keyframes orbit-ccw { to { transform: rotate(-360deg); } }
            `}</style>

            <div className="relative pb-10" style={{ width: SIZE, height: SIZE }}>

              {/* Centre glow */}
              <div
                className="absolute rounded-full blur-3xl pointer-events-none"
                style={{
                  width: 200, height: 200,
                  left: "50%", top: "50%",
                  transform: "translate(-50%,-50%)",
                  background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, rgba(167,139,250,0.1) 50%, transparent 100%)",
                }}
              />

              {/* Outer dashed orbit track */}
              <div
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: ORBIT_R * 2,
                  height: ORBIT_R * 2,
                  left: "50%", top: "50%",
                  transform: "translate(-50%,-50%)",
                  border: "1px dashed rgba(99,102,241,0.18)",
                }}
              />

              {/* ── Avatar ── */}
              <div
                className="absolute rounded-full overflow-hidden bg-gradient-to-br from-indigo-950 to-slate-900 shadow-2xl shadow-indigo-500/20"
                style={{
                  width: 156, height: 156,
                  left: "50%", top: "50%",
                  transform: "translate(-50%,-50%)",
                  border: "2px solid rgba(99,102,241,0.4)",
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div
                      className="font-black leading-none"
                      style={{
                        fontSize: "3.8rem",
                        background: "linear-gradient(135deg, #6366f1, #a78bfa, #06b6d4)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      SI
                    </div>
                    <div className="text-slate-400 text-xs font-medium mt-1">Frontend Dev</div>
                  </div>
                </div>
              </div>

              {/* ── Rotating ring — items orbit + counter-rotate to stay upright ── */}
              <div
                className="absolute inset-0"
                style={{ animation: "orbit-cw 22s linear infinite", transformOrigin: "center" }}
              >
                {ORBIT_TECHS.map((tech, i) => {
                  const angle = ((360 / ORBIT_TECHS.length) * i - 90) * (Math.PI / 180);
                  const x = ORBIT_R * Math.cos(angle);
                  const y = ORBIT_R * Math.sin(angle);
                  return (
                    <div
                      key={tech.name}
                      style={{
                        position: "absolute",
                        left: `calc(50% + ${x}px)`,
                        top:  `calc(50% + ${y}px)`,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <div style={{ animation: "orbit-ccw 22s linear infinite", transformOrigin: "center" }}>
                        <div
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap backdrop-blur-sm shadow-lg"
                          style={{
                            background: tech.bg,
                            border: `1px solid ${tech.border}`,
                            color: tech.color,
                          }}
                        >
                          {tech.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Experience badge */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-xl bg-[#0b0d1a] border border-white/15 shadow-xl flex items-center gap-3 whitespace-nowrap">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm">
                  5+
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">Years Experience</div>
                  <div className="text-slate-500 text-xs">Frontend Development</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <div className="space-y-8">
            <div>
              <motion.p
                custom={0}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="inline-flex items-center gap-2 text-sm font-medium text-indigo-400 uppercase tracking-widest mb-3"
              >
                <span className="w-6 h-px bg-indigo-400" />
                About Me
              </motion.p>
              <motion.h2
                custom={1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight"
              >
                Turning complex ideas into{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  seamless experiences
                </span>
              </motion.h2>
            </div>

            <motion.p
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-slate-400 text-lg leading-relaxed"
            >
              {personalInfo.summary}
            </motion.p>

            {/* Key facts */}
            <motion.div
              custom={3}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: "📍", label: "Location", value: "New Delhi, India" },
                { icon: "🎓", label: "Degree", value: "MCA — Jamia Hamdard" },
                { icon: "💼", label: "Status", value: "Open to opportunities" },
                { icon: "⚡", label: "Specialty", value: "React & Micro Frontends" },
              ].map((fact) => (
                <div
                  key={fact.label}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/8"
                >
                  <span className="text-xl">{fact.icon}</span>
                  <div>
                    <div className="text-slate-500 text-xs">{fact.label}</div>
                    <div className="text-white text-sm font-medium">{fact.value}</div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Action buttons */}
            <motion.div
              custom={4}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="flex flex-wrap gap-3"
            >
              <a
                href="mailto:khansaif59@gmail.com"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white hover:opacity-90 transition-all hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)" }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Let's Connect
              </a>
              <a
                href="https://linkedin.com/in/shahid"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-slate-300 border border-white/15 bg-white/5 hover:bg-white/10 hover:text-white transition-all hover:-translate-y-0.5"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
