import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatDistance } from "date-fns";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string | null;
  published_at: string;
  category: {
    name: string;
    slug: string;
  } | null;
};

export async function RecentBlogPosts() {
  let posts: BlogPost[] = [];
  const supabase = createServerComponentClient({ cookies });

  try {
    // Fetch the posts with their categories
    const { data, error } = await supabase
      .from("blog_posts")
      .select(
        `
        id,
        title,
        slug,
        excerpt,
        featured_image,
        published_at,
        category:blog_categories!inner (
          name,
          slug
        )
      `
      )
      .order("published_at", { ascending: false })
      .limit(3);

    if (error) {
      console.error("Error fetching blog posts:", error);
      return null;
    }

    if (!data?.length) {
      console.log("No blog posts returned from query");
      return null;
    }

    // Transform the data to match our BlogPost type
    posts = data.map((post) => {
      const categoryData = Array.isArray(post.category)
        ? post.category[0]
        : post.category;
      return {
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        featured_image: post.featured_image,
        published_at: post.published_at,
        category: categoryData
          ? {
              name: categoryData.name,
              slug: categoryData.slug,
            }
          : null,
      };
    });

    if (posts.length === 0) {
      return null;
    }

    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Latest Articles
              </h2>
              <p className="text-muted-foreground mt-1">
                Stay updated with our latest articles and insights
              </p>
            </div>
            <Button variant="secondary" asChild>
              <Link href="/blog">View All Posts</Link>
            </Button>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: BlogPost) => (
              <article
                key={post.id}
                className="group relative flex flex-col space-y-4"
              >
                {post.featured_image && (
                  <Link
                    href={`/blog/${post.slug}`}
                    className="relative block aspect-video overflow-hidden rounded-lg"
                  >
                    <Image
                      src={post.featured_image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>
                )}
                <div className="flex flex-col space-y-2">
                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="text-2xl font-bold tracking-tight transition-colors group-hover:text-primary">
                      {post.title}
                    </h2>
                  </Link>
                  {post.excerpt && (
                    <p className="text-muted-foreground line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {post.category && (
                      <>
                        <Link
                          href={`/blog?category=${post.category.slug}`}
                          className="hover:text-primary transition-colors"
                        >
                          {post.category.name}
                        </Link>
                        <span>•</span>
                      </>
                    )}
                    <time dateTime={post.published_at}>
                      {formatDistance(new Date(post.published_at), new Date(), {
                        addSuffix: true,
                      })}
                    </time>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  } catch (e) {
    console.error("Error in RecentBlogPosts:", e);
    return null;
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Latest Articles
            </h2>
            <p className="text-muted-foreground mt-1">
              Stay updated with our latest articles and insights
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/blog">View All Posts</Link>
          </Button>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: BlogPost) => (
            <article
              key={post.id}
              className="group relative flex flex-col space-y-4"
            >
              {post.featured_image && (
                <Link
                  href={`/blog/${post.slug}`}
                  className="relative block aspect-video overflow-hidden rounded-lg"
                >
                  <Image
                    src={post.featured_image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
              )}
              <div className="flex flex-col space-y-2">
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-2xl font-bold tracking-tight transition-colors group-hover:text-primary">
                    {post.title}
                  </h2>
                </Link>
                {post.excerpt && (
                  <p className="text-muted-foreground line-clamp-2">
                    {post.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {post.category && (
                    <>
                      <Link
                        href={`/blog?category=${post.category.slug}`}
                        className="hover:text-primary transition-colors"
                      >
                        {post.category.name}
                      </Link>
                      <span>•</span>
                    </>
                  )}
                  <time dateTime={post.published_at}>
                    {formatDistance(new Date(post.published_at), new Date(), {
                      addSuffix: true,
                    })}
                  </time>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
