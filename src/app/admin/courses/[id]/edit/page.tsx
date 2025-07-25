import CourseForm from "../../_components/course-form";

export default function EditCoursePage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="container max-w-4xl py-6">
      <CourseForm courseId={params.id} />
    </div>
  );
}