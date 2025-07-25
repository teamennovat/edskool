import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Dynamically import the CourseForm component with no SSR
const CourseForm = dynamic(() => import("../../_components/course-form"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "Edit Course - Admin Dashboard",
  description: "Edit course details in the admin dashboard",
};

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function EditCoursePage({ params }: Props) {
  return (
    <div className="container max-w-4xl py-6">
      <Suspense fallback={<div>Loading...</div>}>
        <CourseForm courseId={params.id} />
      </Suspense>
    </div>
  );
}
