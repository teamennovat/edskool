import Image from "next/image";
import Link from "next/link";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

interface RelatedPostsProps {
  currentPostId: string;
  categoryId?: string;
}

export async function RelatedPosts({
  currentPostId,
  categoryId,
}: RelatedPostsProps) {
  const supabase = createServerComponentClient({ cookies });

  const { data: relatedPosts } = await supabase
    .from("blog_posts")
    .select(
      `
      id,
      title,
      slug,
      excerpt,
      featured_image,
      published_at,
      category_id
      `
    )
    .eq("published", true)
    .neq("id", currentPostId)
    .eq("category_id", categoryId)
    .order("published_at", { ascending: false })
    .limit(3);

  if (!relatedPosts?.length) {
    return null;
  }

  return (
    <div className="space-y-4">
      {relatedPosts.map((post) => (
        <article key={post.id} className="group relative flex gap-3">
          {post.featured_image && (
            <Link
              href={`/blog/${post.slug}`}
              className="relative shrink-0 w-20 h-20 overflow-hidden rounded"
            >
              <Image
                src={post.featured_image}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          )}
          <div className="flex flex-col min-w-0">
            <Link href={`/blog/${post.slug}`}>
              <h3 className="font-medium text-sm leading-snug tracking-tight transition-colors group-hover:text-primary line-clamp-2">
                {post.title}
              </h3>
            </Link>
            {post.excerpt && (
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                {post.excerpt}
              </p>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
