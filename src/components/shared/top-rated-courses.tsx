import React from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { CourseIcon } from "./course-icon";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Review {
  rating: number;
}

interface Course {
  id: string;
  name: string;
  description: string;
  link: string;
  status: string;
  author: string;
  course_reviews?: Review[];
  rating?: {
    average_rating: string | number;
    total_reviews: number;
  } | null;
  subcategory_id: string;
  slug: string;
}

interface Subcategory {
  id: string;
  name: string;
  description: string;
  slug: string;
  category_id: string;
}

interface SubcategoryWithCourses extends Subcategory {
  courses: Course[];
}

async function getRandomSubcategoriesWithCourses(): Promise<
  SubcategoryWithCourses[]
> {
  try {
    // First get all subcategories
    const { data: subcategories, error: subcatError } = await supabase
      .from("subcategories")
      .select("*");

    console.log("Fetched subcategories:", subcategories);

    if (subcatError) {
      console.error("Error fetching subcategories:", subcatError);
      return [];
    }

    if (!subcategories?.length) {
      console.log("No subcategories found");
      return [];
    }

    // Get unique subcategories and randomly select 3
    const uniqueSubcategories = Array.from(
      new Set(subcategories.map((s: Subcategory) => s.id))
    ).map((id) => subcategories.find((s: Subcategory) => s.id === id)!);

    const randomSubcategories = uniqueSubcategories
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    // For each subcategory, get top 3 rated courses
    const subcategoriesWithCourses = await Promise.all(
      randomSubcategories.map(
        async (subcategory: Subcategory): Promise<SubcategoryWithCourses> => {
          // Get courses for each subcategory
          const { data: coursesData, error: coursesError } = await supabase
            .from("courses")
            .select(
              `
            id,
            name,
            description,
            link,
            author,
            status,
            slug,
            course_reviews (
              rating
            ),
            subcategory_id
          `
            )
            .eq("subcategory_id", subcategory.id)
            .order("created_at", { ascending: false })
            .limit(3);

          console.log(
            "Fetched courses for subcategory",
            subcategory.id,
            ":",
            coursesData
          );

          if (coursesError) {
            console.error(
              "Error fetching courses for subcategory",
              subcategory.id,
              ":",
              coursesError
            );
            return {
              ...subcategory,
              courses: [],
            };
          }

          // Transform the data to calculate ratings
          const transformedCourses = (coursesData || []).map(
            (course: Course) => {
              const ratings = course.course_reviews || [];
              const totalReviews = ratings.length;
              const averageRating =
                totalReviews > 0
                  ? (
                      ratings.reduce(
                        (sum: number, r: Review) => sum + r.rating,
                        0
                      ) / totalReviews
                    ).toFixed(1)
                  : "0";

              return {
                ...course,
                rating: {
                  average_rating: averageRating,
                  total_reviews: totalReviews,
                },
              };
            }
          );

          // Sort by average rating
          transformedCourses.sort((a: Course, b: Course) => {
            const ratingA = Number(a.rating?.average_rating || 0);
            const ratingB = Number(b.rating?.average_rating || 0);
            return ratingB - ratingA;
          });

          return {
            ...subcategory,
            courses: transformedCourses,
          };
        }
      )
    );

    return subcategoriesWithCourses;
  } catch (error) {
    console.error("Error in getRandomSubcategoriesWithCourses:", error);
    return [];
  }
}

export async function TopRatedCourses() {
  const subcategories = await getRandomSubcategoriesWithCourses();

  if (!subcategories?.length) {
    return null;
  }

  return (
    <section className="w-full">
      <div className="container mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-16">
          {subcategories.map((subcategory: SubcategoryWithCourses) => (
            <React.Fragment key={subcategory.id}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">
                    Best {subcategory.name} Course
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    {subcategory.description}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subcategory.courses.map((course: Course) => (
                  <div
                    key={course.id}
                    className="group p-4 rounded-lg bg-gray-50 transition-all duration-300 hover:shadow-sm"
                  >
                    <div className="flex gap-4">
                      <CourseIcon url={course.link} />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold leading-tight tracking-tight">
                          {course.name.length > 60
                            ? course.name.slice(0, 60) + "..."
                            : course.name}
                        </h3>
                        <p className="text-xs">
                          by{" "}
                          <span className="text-primary">{course.author}</span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-4">
                      {course.rating && course.rating.total_reviews > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="text-xl font-bold text-primary">
                            {Number(course.rating.average_rating).toFixed(1)}
                          </div>
                          <div className="flex my-2">
                            {[...Array(5)].map((_, i) => {
                              const rating = (() => {
                                const r = course.rating?.average_rating;
                                return typeof r === "number"
                                  ? r
                                  : parseFloat(r || "0");
                              })();
                              return (
                                <svg
                                  key={i}
                                  className={`h-6 w-6 ${
                                    i < Math.floor(rating)
                                      ? "text-primary"
                                      : "text-gray-300"
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="text-xl font-bold text-primary">
                            0.0
                          </div>
                          <div className="flex my-2">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className="h-6 w-6 text-gray-300"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      )}

                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {course.description}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-end">
                      <Link
                        href={`/courses/${course.slug}`}
                        className="text-sm font-medium text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1"
                      >
                        View Details
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
