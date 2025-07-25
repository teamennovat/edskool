import { Suspense } from "react";
import CourseForm from "../../_components/course-form";

// This ensures the page is dynamically rendered
export const dynamic = "force-dynamic";

// Define the expected shape of the route parameters
type PageParams = { id: string };

// Next.js page component with proper typing
export default async function EditCoursePage({
  params,
}: {
  params: PageParams;
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className="container max-w-4xl py-6">
      <Suspense fallback={<div>Loading...</div>}>
        <CourseForm courseId={params.id} />
      </Suspense>
    </div>
  );
}
