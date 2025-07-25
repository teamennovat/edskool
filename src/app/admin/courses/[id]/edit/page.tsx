import { Metadata } from "next";
import CourseForm from "../../_components/course-form";

type CourseEditParams = {
  id: string;
};

export const metadata: Metadata = {
  title: "Edit Course - Admin Dashboard",
  description: "Edit course details in the admin dashboard",
};

export default async function EditCoursePage({
  params,
}: {
  params: CourseEditParams;
}) {
  return (
    <div className="container max-w-4xl py-6">
      <CourseForm courseId={params.id} />
    </div>
  );
}
