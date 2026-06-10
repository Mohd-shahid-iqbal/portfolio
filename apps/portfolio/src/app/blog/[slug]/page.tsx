import { notFound } from "next/navigation";
import { getPostBySlug, blogPosts } from "@/lib/blog-data";
import { BlogPostRenderer } from "@/components/blog/BlogPostRenderer";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  return <BlogPostRenderer post={post} />;
}
