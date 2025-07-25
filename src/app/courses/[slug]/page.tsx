import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { type Database } from "@/lib/database.types";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import CourseDetails from "./course-details";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: course } = await supabase
    .from("courses")
    .select("name, description")
    .eq("slug", params.slug)
    .single();

  if (!course) {
    return {
      title: "Course Not Found | edskool",
      description: "The requested course could not be found.",
    };
  }

  return {
    title: `${course.name} Reviews | edskool`,
    description: course.description,
    openGraph: {
      title: `${course.name} Reviews | edskool`,
      description: course.description,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${course.name} Reviews | edskool`,
      description: course.description,
    },
  };
}

export const dynamic = "force-dynamic";

export default async function CoursePage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Ensure params are properly awaited
  const courseSlug = await Promise.resolve(params.slug);

  // Get course data by slug
  const { data: courseData, error: courseError } = await supabase
    .from("courses")
    .select(
      `
      *,
      category:categories(*),
      subcategory:subcategories(*),
      reviews:course_reviews(*)
    `
    )
    .eq("slug", courseSlug)
    .single();

  if (courseError || !courseData) {
    notFound();
  }

  // Get reviews with user data
  const { data: reviewsData, error: reviewsError } = await supabase
    .from("course_reviews_with_users")
    .select()
    .eq("course_id", courseData.id);

  if (reviewsError) {
    console.error("Error fetching reviews:", reviewsError);
  }

  // Get course rating
  const { data: ratingData } = await supabase.rpc("get_course_rating", {
    course_id: courseData.id,
  });

  const courseWithDetails = {
    ...courseData,
    rating: ratingData?.[0] || { average_rating: 0, total_reviews: 0 },
    reviews: (reviewsData || []).map((review) => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      created_at: review.created_at,
      user_id: review.user_id,
      user_email: review.user_email,
      full_name: review.full_name,
      avatar_url: review.avatar_url,
      total_reviews: review.total_reviews,
    })),
  };

  return <CourseDetails course={courseWithDetails} session={session} />;
}
