import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { CategoryCard } from "@/components/shared/category-card";

export async function FeaturedCategories() {
  const supabase = createServerComponentClient({ cookies });

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("featured", true)
    .order("name");

  if (!categories?.length) return null;

  return (
    <section className="w-full mt-12">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Popular Categories
            </h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Start your learning journey with these top categories
            </p>
          </div>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
        <div className="mt-12 text-right"></div>
      </div>
    </section>
  );
}
