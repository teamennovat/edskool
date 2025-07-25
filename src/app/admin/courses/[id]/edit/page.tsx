import { Metadata } from "next";
import CourseForm from "../../_components/course-form";

interface PageProps {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export const metadata: Metadata = {
  title: "Edit Course - Admin Dashboard",
  description: "Edit course details in the admin dashboard",
};

export default function EditCoursePage({ params }: PageProps) {
  return (
    <div className="container max-w-4xl py-6">
      <CourseForm courseId={params.id} />
    </div>
  );
}
