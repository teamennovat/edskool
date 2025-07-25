import CourseForm from "../../_components/course-form";
interface EditCoursePageProps {
  params: {
    id: string;
  };
}
export default function EditCoursePage({ params }: EditCoursePageProps) {
  return (
    <div className="container max-w-4xl py-6">
      <CourseForm courseId={params.id} />
    </div>
  );
}
