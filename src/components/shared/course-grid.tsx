"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

function CourseIcon({ url }: { url: string }) {
  const [error, setError] = useState(false);

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?sz=32&domain=${domain}`;
    } catch {
      return "/file.svg";
    }
  };

  return (
    <div className="relative w-8 h-8 overflow-hidden rounded-md flex-shrink-0">
      {error ? (
        <div className="w-full h-full bg-muted flex items-center justify-center">
          <svg
            className="w-4 h-4 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      ) : (
        <Image
          src={getFaviconUrl(url)}
          alt="Course Icon"
          width={32}
          height={32}
          className="object-contain"
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}

interface Course {
  id: string;
  name: string;
  description: string;
  author: string;
  link: string;
  created_at: string;
  slug: string;
  submitter?: {
    id: string;
    email: string;
  } | null;
  rating?: {
    average_rating: string | number; // Can be string from DB
    total_reviews: number;
  } | null;
}

interface CourseGridProps {
  courses: Course[];
  isLoading?: boolean;
}

export function CourseGrid({ courses, isLoading }: CourseGridProps) {
  // Courses are now pre-filtered from the server
  const filteredCourses = courses;

  // Enhanced debugging
  console.log("Received courses in CourseGrid:", courses);
  courses.forEach((course) => {
    console.log(`Course ${course.id} details:`, {
      name: course.name,
      rating: course.rating,
      hasRating: !!course.rating,
      ratingValues: course.rating
        ? {
            average: Number(course.rating.average_rating),
            total: Number(course.rating.total_reviews),
          }
        : null,
    });
  });

  console.log("Raw courses data:", courses);

  courses.forEach((course) => {
    const rawRating = course.rating;
    console.log(`Course ${course.id} details:`, {
      name: course.name,
      rawRating,
      hasRating: !!course.rating,
      ratingDetails: course.rating
        ? {
            total_reviews: course.rating.total_reviews,
            average_rating: course.rating.average_rating,
            isNumber_total: typeof course.rating.total_reviews === "number",
            isNumber_avg: typeof course.rating.average_rating === "number",
          }
        : "No rating",
    });
  });

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded-lg border bg-card text-card-foreground shadow-sm animate-pulse overflow-hidden"
          >
            <div className="border-b bg-muted/50 p-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-muted rounded-md" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="flex gap-2">
                    <div className="h-3 bg-muted rounded w-16" />
                    <div className="h-3 bg-muted rounded w-20" />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded" />
                <div className="h-3 bg-muted rounded w-5/6" />
              </div>
              <div className="flex justify-between pt-2">
                <div className="h-3 bg-muted rounded w-20" />
                <div className="h-3 bg-muted rounded w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredCourses.length === 0) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex h-48 items-center justify-center text-muted-foreground">
          No courses found
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {filteredCourses.map((course) => (
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
                by <span className="text-primary">{course.author}</span>
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
                      return typeof r === "number" ? r : parseFloat(r || "0");
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
                <div className="text-xl font-bold text-primary">0.0</div>
                <div className="flex my-2">
                  <svg
                    className={`h-6 w-6 text-gray-300`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    className={`h-6 w-6 text-gray-300`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    className={`h-6 w-6 text-gray-300`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    className={`h-6 w-6 text-gray-300`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    className={`h-6 w-6 text-gray-300`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
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
  );
}
