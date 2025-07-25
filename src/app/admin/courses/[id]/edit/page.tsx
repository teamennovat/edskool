import CourseForm from "../../_components/course-form";
import { Suspense } from "react";

interface PageProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function EditCoursePage({ params, searchParams }: PageProps) {
  return (
    <Suspense fallback="Loading...">
      <div className="container max-w-4xl py-6">
        <CourseForm courseId={params.id} />
      </div>
    </Suspense>
  );
}
