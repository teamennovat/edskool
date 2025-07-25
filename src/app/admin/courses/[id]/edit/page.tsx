"use client";

import { Suspense } from "react";
import CourseForm from "../../_components/course-form";

interface Props {
  params: {
    id: string;
  };
}

export default function EditCoursePage({ params }: Props) {
  return (
    <div className="container max-w-4xl py-6">
      <Suspense fallback={<div>Loading...</div>}>
        <CourseForm courseId={params.id} />
      </Suspense>
    </div>
  );
}
