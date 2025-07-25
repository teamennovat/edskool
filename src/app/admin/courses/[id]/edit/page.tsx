import { Metadata } from "next";
import CourseFormWrapper from "../../_components/course-form-wrapper";

export const metadata: Metadata = {
  title: "Edit Course - Admin Dashboard",
  description: "Edit course details in the admin dashboard",
};

interface PageProps {
  params: { id: string };
}

export default function EditCoursePage({ params }: PageProps) {
  return (
    <div className="container max-w-4xl py-6">
      <CourseFormWrapper courseId={params.id} />
    </div>
  );
}
