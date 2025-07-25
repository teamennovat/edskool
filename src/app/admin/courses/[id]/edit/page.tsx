import CourseForm from "../../_components/course-form";

type PageParams = { id: string };

// Force async to satisfy Next.js page requirements
async function getData(id: string) {
  return Promise.resolve({ id });
}

export default async function Page({ params }: { params: PageParams }) {
  // Ensure we have an async operation
  await getData(params.id);
  
  return (
    <div className="container max-w-4xl py-6">
      <CourseForm courseId={params.id} />
    </div>
  );
}
