"use client";

import { Suspense } from "react";
import CourseForm from "../../_components/course-form";

export default function EditCoursePage({ params }: { params: { id: string } }) {
  return (
    <div className="container max-w-4xl py-6">
      <Suspense fallback={<div>Loading...</div>}>
        <CourseForm courseId={params.id} />
      </Suspense>
    </div>
  );
}
