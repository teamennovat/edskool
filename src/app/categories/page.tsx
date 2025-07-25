import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { CategoryCard } from "@/components/shared/category-card";

export const metadata = {
  title: "Categories - edskool",
  description: "Browse all learning categories on edskool",
};

export default async function CategoriesPage() {
  const supabase = createServerComponentClient({ cookies });

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  return (
    <div className="container max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Learning Categories
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Explore our comprehensive range of learning categories
        </p>
      </div>
      <div className="mt-16 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
        {categories?.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
