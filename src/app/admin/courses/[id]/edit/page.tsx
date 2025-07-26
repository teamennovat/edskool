import CourseForm from "../../_components/course-form";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EditCoursePage({
  params,
}: PageProps) {
  // Await the params promise
  const resolvedParams = await params;
  const courseId = resolvedParams.id;

  return (
    <div className="container max-w-4xl py-6">
      <CourseForm courseId={courseId} />
    </div>
  );
}