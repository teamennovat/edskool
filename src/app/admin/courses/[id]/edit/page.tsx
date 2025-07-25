import CourseForm from "../../_components/course-form";
import { Suspense } from "react";

type Props = {
  params: {
    id: string;
  };
};

export default function EditCoursePage({ params }: Props) {
  return (
    <Suspense fallback="Loading...">
      <div className="container max-w-4xl py-6">
        <CourseForm courseId={params.id} />
      </div>
    </Suspense>
  );
}
