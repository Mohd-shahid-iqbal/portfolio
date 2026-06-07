import { Navigation } from "@/components/navigation/Navigation";
import { HeroModule } from "@/modules/hero";
import { AboutModule } from "@/modules/about";
import { SkillsModule } from "@/modules/skills";
import { ExperienceModule } from "@/modules/experience";
import { ProjectsModule } from "@/modules/projects";
import { EducationModule } from "@/modules/education";
import { ContactModule } from "@/modules/contact";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#03040a]">
      <Navigation />

      {/* Modules — each is an independently maintained section */}
      <HeroModule />

      <div className="section-divider max-w-5xl mx-auto px-8" />
      <AboutModule />

      <div className="section-divider max-w-5xl mx-auto px-8" />
      <SkillsModule />

      <div className="section-divider max-w-5xl mx-auto px-8" />
      <ExperienceModule />

      <div className="section-divider max-w-5xl mx-auto px-8" />
      <ProjectsModule />

      <div className="section-divider max-w-5xl mx-auto px-8" />
      <EducationModule />

      <div className="section-divider max-w-5xl mx-auto px-8" />
      <ContactModule />

      {/* Footer */}
      <footer className="py-10 text-center border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs">
                SI
              </div>
              <span className="text-slate-400 text-sm">Mohd Shahid Iqbal</span>
            </div>
            <p className="text-slate-600 text-xs">
              Built with Next.js · Turborepo · Tailwind CSS · Framer Motion · Storybook
            </p>
            <p className="text-slate-600 text-xs">
              © {new Date().getFullYear()} · All rights reserved
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
