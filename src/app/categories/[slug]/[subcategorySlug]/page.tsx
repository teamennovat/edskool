import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { SubcategoryScroller } from "@/components/shared/subcategory-scroller";
import { CourseGrid } from "@/components/shared/course-grid";
import { Suspense } from "react";
import Loading from "@/components/ui/loading";

export default function Page({
  params,
}: {
  params: { slug: string; subcategorySlug: string };
}) {
  return (
    <Suspense fallback={<Loading />}>
      <SubcategoryContent params={params} />
    </Suspense>
  );
}

async function SubcategoryContent({
  params,
}: {
  params: { slug: string; subcategorySlug: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  const supabase = createServerComponentClient({ cookies });

  // Get category
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", resolvedParams.slug)
    .single();

  if (!category) {
    return <div>Category not found</div>;
  }

  // Get subcategories
  const { data: subcategories } = await supabase
    .from("subcategories")
    .select("*")
    .eq("category_id", category.id)
    .order("name");

  // Get current subcategory
  const { data: subcategory } = await supabase
    .from("subcategories")
    .select("*")
    .eq("category_id", category.id)
    .eq("slug", resolvedParams.subcategorySlug)
    .single();

  if (!subcategory) {
    return <div>Subcategory not found</div>;
  }

  // Get all approved courses for this subcategory with submitter info
  // Get all approved courses for this subcategory with submitter info
  const { data: courses, error: coursesError } = await supabase.rpc(
    "get_courses_by_category",
    {
      category_id_input: category.id,
      subcategory_id_input: subcategory.id,
    }
  );

  if (coursesError) {
    console.error("Error fetching courses:", coursesError);
    return <div>Error loading courses</div>;
  }

  // Get ratings for all courses
  interface Course {
    id: string;
    name: string;
    description: string;
    author: string;
    link: string;
    created_at: string;
    category_id: string;
    subcategory_id: string;
    status: string;
    submitter: { id: string; email: string } | null;
  }

  const coursesWithRatings = await Promise.all(
    (courses || []).map(async (course: Course) => {
      const { data: rating } = await supabase.rpc("get_course_rating", {
        course_id_input: course.id,
      });
      return {
        ...course,
        rating: rating?.[0] || null,
      };
    })
  );

  return (
    <div className="container max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">{category.name}</h1>
        <div className="text-2xl font-medium text-muted-foreground">
          {subcategory.name}
        </div>
        <p className="max-w-2xl text-lg text-muted-foreground">
          {subcategory.description}
        </p>
      </div>

      <div className="mt-8">
        <SubcategoryScroller
          categorySlug={category.slug}
          subcategories={subcategories || []}
          activeSubcategory={subcategory.slug}
        />
      </div>

      <div className="mt-12">
        <CourseGrid courses={coursesWithRatings} />
      </div>
    </div>
  );
}
