import type { Metadata } from "next";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { BlogList } from "./blog-list";

export const metadata: Metadata = {
  title: "Blog - edskool",
  description:
    "Latest articles and tutorials about online education and learning resources.",
  openGraph: {
    title: "Blog - edskool",
    description:
      "Latest articles and tutorials about online education and learning resources.",
    type: "website",
    url: "/blog",
  },
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { page?: string; category?: string };
}) {
  const supabase = createServerComponentClient({ cookies });

  const page = parseInt(searchParams.page || "1");
  const pageSize = 12;

  const { data, error } = await supabase.rpc("list_blog_posts", {
    page_number: page,
    page_size: pageSize,
    category_slug: searchParams.category || null,
  });

  if (error) {
    console.error("Error fetching blog posts:", error);
    return <div>Error loading blog posts</div>;
  }

  if (!data?.posts?.items) {
    console.error("No blog posts found");
    return (
      <div className="text-center py-8">
        <p className="text-lg text-muted-foreground">
          {searchParams.category
            ? "No posts found in this category"
            : "No blog posts found"}
        </p>
      </div>
    );
  }

  const blogData = data.posts;

  // Get categories for sidebar
  const { data: categories } = await supabase
    .from("blog_categories")
    .select("name, slug, description")
    .order("name");

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-4 mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Latest articles, tutorials, and insights about online education and
          learning resources.
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <BlogList
            posts={blogData.items}
            currentPage={blogData.page}
            totalPages={blogData.totalPages}
            category={searchParams.category}
          />
        </div>

        <aside className="space-y-8">
          {/* Categories */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Browse Categories</h2>
            <div className="flex flex-wrap gap-2">
              {categories?.map((category) => (
                <a
                  key={category.slug}
                  href={`/blog?category=${category.slug}`}
                  className="inline-flex items-center text-sm px-3 py-1 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  {category.name}
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
