import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { format } from "date-fns";
import { RelatedPosts } from "../components/related-posts";

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

interface Props {
  params: {
    slug: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createServerComponentClient({ cookies });

  const { data: post } = await supabase.rpc("get_blog_post_with_details", {
    post_slug: params.slug,
  });

  if (!post) {
    return {
      title: "Post Not Found - edskool Blog",
    };
  }

  return {
    title: `${post.post.meta_title || post.post.title} - edskool Blog`,
    description: post.post.meta_description || post.post.excerpt,
    openGraph: {
      title: post.post.meta_title || post.post.title,
      description: post.post.meta_description || post.post.excerpt,
      type: "article",
      url: `/blog/${post.post.slug}`,
      images: post.post.featured_image
        ? [{ url: post.post.featured_image }]
        : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const supabase = createServerComponentClient({ cookies });

  // Fetch both post details and categories in parallel
  const [postResult, categoriesResult] = await Promise.all([
    supabase.rpc("get_blog_post_with_details", {
      post_slug: params.slug,
    }),
    supabase
      .from("blog_categories")
      .select("name, slug, description")
      .order("name"),
  ]);

  if (postResult.error || !postResult.data || !postResult.data.post) {
    notFound();
  }

  const { post: blogPost } = postResult.data;
  const categories = categoriesResult.data || [];

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-4 gap-8">
        <article className="lg:col-span-3">
          <header className="space-y-4 mb-8">
            {blogPost.featured_image && (
              <div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
                <Image
                  src={blogPost.featured_image}
                  alt={blogPost.title}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            )}

            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">
                {blogPost.title}
              </h1>
              {blogPost.excerpt && (
                <p className="text-xl text-muted-foreground">
                  {blogPost.excerpt}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <time dateTime={blogPost.published_at}>
                {format(new Date(blogPost.published_at), "MMMM d, yyyy")}
              </time>
            </div>

            {blogPost.category && (
              <div className="flex flex-wrap gap-2 pt-4">
                <Link
                  href={`/blog?category=${blogPost.category.slug}`}
                  className="text-sm bg-secondary px-3 py-1 rounded-full hover:bg-secondary/80 transition-colors"
                >
                  {blogPost.category.name}
                </Link>
              </div>
            )}
          </header>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            {blogPost.content}
          </div>
        </article>

        {/* Sidebar */}
        <aside className="space-y-8">
          {/* Related Posts */}
          {blogPost.category && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Related Posts</h2>
              <RelatedPosts
                currentPostId={blogPost.id}
                categoryId={blogPost.category.id}
              />
            </div>
          )}

          {/* Categories */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Browse Categories</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/blog?category=${category.slug}`}
                  className={`inline-flex items-center text-sm px-3 py-1 rounded-full transition-colors ${
                    blogPost.category?.slug === category.slug
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary hover:bg-secondary/80"
                  }`}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
