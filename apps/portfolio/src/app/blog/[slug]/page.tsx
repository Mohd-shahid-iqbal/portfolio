import { notFound } from "next/navigation";
import { getPostBySlug, blogPosts } from "@/lib/blog-data";
import { BlogPostRenderer } from "@/components/blog/BlogPostRenderer";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();
  return <BlogPostRenderer post={post} />;
}
