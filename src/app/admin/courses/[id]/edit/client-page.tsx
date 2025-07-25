"use client";

import { Suspense } from "react";
import CourseForm from "../../_components/course-form";

interface ClientPageProps {
  id: string;
}

export default function ClientPage({ id }: ClientPageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CourseForm courseId={id} />
    </Suspense>
  );
}
