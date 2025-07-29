"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/lib/database.types";
import { CourseGrid } from "@/components/shared/course-grid";

interface Course {
  id: string;
  name: string;
  description: string;
  author: string;
  link: string;
  created_at: string;
  slug: string;
  rating?: {
    average_rating: number;
    total_reviews: number;
  } | null;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const searchCourses = async () => {
      setIsLoading(true);
      if (!query) {
        setCourses([]);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("courses")
        .select(
          `
          id,
          name,
          description,
          author,
          link,
          created_at,
          slug,
          status,
          rating:course_reviews(
            rating
          )
        `
        )
        .textSearch("name", query)
        .eq("status", "approved")
        .limit(20);

      if (error) {
        console.error("Error searching courses:", error);
        setCourses([]);
      } else {
        const processedCourses = (data || []).map((course) => ({
          ...course,
          rating: course.rating?.length
            ? {
                average_rating:
                  course.rating.reduce((acc, curr) => acc + curr.rating, 0) /
                  course.rating.length,
                total_reviews: course.rating.length,
              }
            : null,
        }));
        setCourses(processedCourses);
      }
      setIsLoading(false);
    };

    searchCourses();
  }, [query, supabase]);

  if (!query) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Search Results</h1>
        <p>Please enter a search query</p>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">
        Search Results for &quot;{query}&quot;
      </h1>

      <CourseGrid courses={courses} isLoading={isLoading} />
    </div>
  );
}
