import CourseForm from "../../_components/course-form";

type Props = {
  params: {
    id: string;
  };
};

export default function EditCoursePage({ params }: Props) {
  return (
    <div className="container max-w-4xl py-6">
      <CourseForm courseId={params.id} />
    </div>
  );
}
