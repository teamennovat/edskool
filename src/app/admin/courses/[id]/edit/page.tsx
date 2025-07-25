import { Metadata } from "next";
import { Suspense } from "react";
import CourseForm from "../../_components/course-form";

export const metadata: Metadata = {
  title: "Edit Course - Admin Dashboard",
  description: "Edit course details in the admin dashboard",
};

export default async function EditCoursePage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="container max-w-4xl py-6">
      <Suspense fallback={<div>Loading...</div>}>
        <CourseForm courseId={params.id} />
      </Suspense>
    </div>
  );
}
