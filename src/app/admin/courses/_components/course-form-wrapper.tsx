"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Dynamically import the CourseForm component
const CourseForm = dynamic(() => import("./course-form"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

interface CourseFormWrapperProps {
  courseId: string;
}

export default function CourseFormWrapper({
  courseId,
}: CourseFormWrapperProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CourseForm courseId={courseId} />
    </Suspense>
  );
}
