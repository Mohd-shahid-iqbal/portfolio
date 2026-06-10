import Link from "next/link";
import type { BlogPost, Block } from "@/lib/blog-data";

// ─── Color maps ─────────────────────────────────────────────────────────────

const tagColors: Record<string, string> = {
  indigo: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
  violet: "bg-violet-500/10 text-violet-300 border-violet-500/20",
  cyan: "bg-cyan-500/10  text-cyan-300  border-cyan-500/20",
};

// ─── Block renderer ──────────────────────────────────────────────────────────

function Block({ block, index }: { block: Block; index: number }) {
  switch (block.type) {
    case "p":
      return (
        <p className="text-slate-300 leading-relaxed text-[1.05rem]">
          {block.text}
        </p>
      );

    case "h2":
      return (
        <h2 className="text-2xl font-bold text-white mt-10 mb-1">
          {block.text}
        </h2>
      );

    case "h3":
      return (
        <h3 className="text-lg font-semibold text-indigo-300 mt-6 mb-1">
          {block.text}
        </h3>
      );

    case "quote":
      return (
        <blockquote className="border-l-4 border-indigo-500 pl-5 py-1 bg-indigo-500/5 rounded-r-xl">
          <p className="text-indigo-200 italic leading-relaxed">{block.text}</p>
        </blockquote>
      );

    case "tip":
      return (
        <div className="flex gap-3 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
          <span className="text-cyan-400 text-lg leading-none mt-0.5">💡</span>
          <p className="text-cyan-200 text-sm leading-relaxed">{block.text}</p>
        </div>
      );

    case "bullets":
      return (
        <ul className="flex flex-col gap-2 pl-1">
          {block.items.map((item, i) => (
            <li
              key={i}
              className="flex gap-3 text-slate-300 text-[1.05rem] leading-relaxed"
            >
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      );

    case "steps":
      return (
        <div className="flex flex-col gap-3">
          {block.items.map((item, i) => (
            <div
              key={i}
              className="flex gap-4 p-4 rounded-xl bg-white/4 border border-white/8"
            >
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold mt-0.5">
                {i + 1}
              </div>
              <div>
                <span className="font-semibold text-white">
                  {item.title} —{" "}
                </span>
                <span className="text-slate-400 text-sm leading-relaxed">
                  {item.text}
                </span>
              </div>
            </div>
          ))}
        </div>
      );

    case "code":
      return (
        <div className="rounded-xl overflow-hidden border border-white/8">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border-b border-white/8">
            <span className="w-3 h-3 rounded-full bg-red-500/60" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <span className="w-3 h-3 rounded-full bg-green-500/60" />
            <span className="ml-2 text-xs text-slate-500 font-mono">
              {block.lang}
            </span>
          </div>
          <pre className="p-4 overflow-x-auto bg-[#0d0f1a]">
            <code className="text-sm text-slate-300 font-mono leading-relaxed">
              {block.text}
            </code>
          </pre>
        </div>
      );
  }
}

// ─── Main component ──────────────────────────────────────────────────────────

export function BlogPostRenderer({ post }: { post: BlogPost }) {
  return (
    <main className="min-h-screen bg-[#03040a] text-white pt-24 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-10 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">
            ←
          </span>
          All posts
        </Link>

        {/* Header */}
        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-2 mb-5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${tagColors[post.color]}`}
              >
                {tag}
              </span>
            ))}
            <span className="text-xs text-slate-500 ml-auto">
              {post.date} · {post.readTime}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            {post.description}
          </p>
        </header>

        <hr className="border-white/8 mb-10" />

        {/* Content blocks */}
        <div className="flex flex-col gap-5">
          {post.content.map((block, i) => (
            <Block key={i} block={block} index={i} />
          ))}
        </div>

        {/* Author footer */}
        <div className="mt-16 pt-8 border-t border-white/8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-400">Written by</p>
            <p className="font-semibold text-white">Mohd Shahid Iqbal</p>
            <p className="text-sm text-indigo-400">SDE3 Frontend </p>
          </div>
          <a
            href="https://www.linkedin.com/in/mohd-shahid-iqbal-2b690713b/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm hover:bg-indigo-500/20 transition-colors"
          >
            Follow on LinkedIn →
          </a>
        </div>
      </div>
    </main>
  );
}
