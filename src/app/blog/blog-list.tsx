"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDistance } from "date-fns";

interface BlogPost {
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
}

interface BlogListProps {
  posts: BlogPost[];
  currentPage: number;
  totalPages: number;
  category?: string;
}

export function BlogList({
  posts,
  currentPage,
  totalPages,
  category,
}: BlogListProps) {
  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", page.toString());
    if (category) params.set("category", category);
    return `/blog${params.toString() ? `?${params.toString()}` : ""}`;
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-8 sm:grid-cols-2">
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

      {totalPages > 1 && (
        <nav className="flex items-center justify-center space-x-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Link
              key={page}
              href={buildPageUrl(page)}
              className={`inline-flex h-8 min-w-[2rem] items-center justify-center rounded px-3 text-sm ${
                currentPage === page
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              {page}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
