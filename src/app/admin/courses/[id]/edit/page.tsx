import { Metadata } from "next";
import CourseForm from "../../_components/course-form";

type PageParams = { id: string };

type Props = {
  params: PageParams;
  searchParams?: { [key: string]: string | string[] | undefined };
};

export const metadata: Metadata = {
  title: "Edit Course - Admin Dashboard",
  description: "Edit course details in the admin dashboard",
};

export default async function EditCoursePage({ params }: Props) {
  return (
    <div className="container max-w-4xl py-6">
      <CourseForm courseId={params.id} />
    </div>
  );
}
