import CourseForm from "../../_components/course-form";

// This is a workaround to make the page async and satisfy Next.js types
async function getPageProps(id: string) {
  return { id: await Promise.resolve(id) };
}

export default async function Page({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await getPageProps(params.id);
  
  return (
    <div className="container max-w-4xl py-6">
      <CourseForm courseId={id} />
    </div>
  );
}
