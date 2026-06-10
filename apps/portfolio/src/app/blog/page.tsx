import Link from "next/link";
import { blogPosts } from "@/lib/blog-data";

const colorMap: Record<string, string> = {
  indigo: "from-indigo-500/10 border-indigo-500/30",
  violet: "from-violet-500/10 border-violet-500/30",
  cyan: "from-cyan-500/10 border-cyan-500/30",
};

const tagColorMap: Record<string, string> = {
  indigo: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
  violet: "bg-violet-500/10 text-violet-300 border-violet-500/20",
  cyan: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
};

const dotColorMap: Record<string, string> = {
  indigo: "bg-indigo-400",
  violet: "bg-violet-400",
  cyan: "bg-cyan-400",
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#03040a] text-white pt-24 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to portfolio
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent mb-3">
            Blog
          </h1>
          <p className="text-slate-400 text-lg">
            Thoughts on React, frontend architecture, and building at scale.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
              <article
                className={`relative rounded-2xl border bg-gradient-to-br ${colorMap[post.color]} p-6 transition-all duration-300 group-hover:scale-[1.01] group-hover:shadow-lg group-hover:shadow-indigo-500/5`}
              >
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${tagColorMap[post.color]}`}
                    >
                      {tag}
                    </span>
                  ))}
                  <span className="text-xs text-slate-500 ml-auto flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${dotColorMap[post.color]}`} />
                    {post.date} · {post.readTime}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-white mb-2 leading-snug group-hover:text-indigo-200 transition-colors">
                  {post.title}
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed">{post.description}</p>
                <span className="inline-flex items-center gap-1 mt-4 text-sm text-indigo-400 group-hover:text-indigo-300 transition-colors">
                  Read more <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                </span>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
