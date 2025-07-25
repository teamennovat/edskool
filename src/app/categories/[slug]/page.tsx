import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { SubcategoryScroller } from "@/components/shared/subcategory-scroller";
import { CourseGrid } from "@/components/shared/course-grid";

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = createServerComponentClient({ cookies });

  // Ensure params are properly awaited
  const categorySlug = await Promise.resolve(params.slug);

  // Get category
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", categorySlug)
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
    slug: string;
    average_rating: number;
    total_reviews: number;
  }

  // Get courses for this category with ratings
  const { data: coursesData, error: coursesError } = await supabase.rpc(
    "get_courses_with_ratings_by_category",
    {
      category_id_input: category.id,
    }
  );

  if (coursesError) {
    console.error("Error fetching courses:", coursesError);
    return <div>Error loading courses</div>;
  }

  // Convert the rows to a properly typed array
  const courses: Course[] = Array.isArray(coursesData) ? coursesData : [];

  const coursesWithRatings = courses.map((course: Course) => ({
    ...course,
    rating: {
      average_rating: Number(course.average_rating || 0),
      total_reviews: Number(course.total_reviews || 0),
    },
  }));

  return (
    <div className="container max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">{category.name}</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          {category.description}
        </p>
      </div>

      <div className="mt-8">
        <SubcategoryScroller
          categorySlug={category.slug}
          subcategories={subcategories || []}
        />
      </div>

      <div className="mt-12">
        {coursesWithRatings.length > 0 ? (
          <CourseGrid courses={coursesWithRatings} />
        ) : (
          <div className="text-center text-muted-foreground">
            No courses found in this category.
          </div>
        )}
      </div>
    </div>
  );
}
