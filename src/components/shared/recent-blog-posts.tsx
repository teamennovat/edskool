'use client';

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatDistance } from "date-fns";
import { useEffect, useState } from "react";

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

export function RecentBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select(`
            id,
            title,
            slug,
            excerpt,
            featured_image,
            published_at,
            category:blog_categories (
              name,
              slug
            )
          `)
          .order('published_at', { ascending: false })
          .limit(3);

        if (error) throw error;

        const formattedPosts = (data || []).map((post: any) => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          featured_image: post.featured_image,
          published_at: post.published_at,
          category: Array.isArray(post.category) 
            ? post.category[0] 
            : post.category,
        }));
        
        setPosts(formattedPosts);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch posts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [supabase]);

  if (isLoading) {
    return <div className="py-16 text-center">Loading recent blog posts...</div>;
  }

  if (error) {
    return <div className="py-16 text-center text-red-500">{error}</div>;
  }

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
              Stay updated with our latest insights
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/blog">View All Posts</Link>
          </Button>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
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
                  <h3 className="text-2xl font-bold tracking-tight hover:text-primary transition-colors">
                    {post.title}
                  </h3>
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
                        href={`/blog/category/${post.category.slug}`}
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
          {posts.map((post) => (
            <article
              key={post.id}
              className="group relative flex flex-col space-y-4"
            >
              {post.featured_image && (
                <Link
                  href={`/blog/${post.slug}`}
                  className="relative block aspect-video overflow-hidden rounded-lg bg-muted"
                >
                  <Image
                    src={post.featured_image}
                    alt={post.title}
                    className="object-cover transition-transform group-hover:scale-105"
                    fill
                  />
                </Link>
              )}
              <div className="flex flex-col space-y-2">
                {post.category && (
                  <Link
                    href={`/blog/category/${post.category.slug}`}
                    className="text-sm font-medium text-primary hover:text-primary/90"
                  >
                    {post.category.name}
                  </Link>
                )}
                <h3 className="text-xl font-semibold tracking-tight">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="text-muted-foreground line-clamp-3">
                  {post.excerpt}
                </p>
                <time
                  dateTime={post.published_at}
                  className="text-sm text-muted-foreground"
                >
                  {formatDistance(new Date(post.published_at), new Date(), {
                    addSuffix: true,
                  })}
                </time>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
