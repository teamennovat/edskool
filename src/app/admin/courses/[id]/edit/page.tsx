import CourseForm from "../../_components/course-form";

interface EditPageParams {
  id: string;
}

export default async function EditCoursePage({
  params,
}: {
  params: EditPageParams;
}) {
  // Ensure we have an async operation to match Next.js expectations
  await Promise.resolve();

  return (
    <div className="container max-w-4xl py-6">
      <CourseForm courseId={params.id} />
    </div>
  );
}
