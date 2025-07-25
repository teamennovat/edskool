import CourseForm from "../../_components/course-form";

// Define the page parameters type
type PageParams = {
  id: string;
};

// This is a Next.js App Router page component
export default async function Page({
  params,
  searchParams,
}: {
  params: PageParams;
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Ensure we have an async operation to match Next.js expectations
  await Promise.resolve();

  return (
    <div className="container max-w-4xl py-6">
      <CourseForm courseId={params.id} />
    </div>
  );
}
