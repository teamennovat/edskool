import { Suspense } from "react";
import ClientPage from "./client-page";

type SearchParams = { [key: string]: string | string[] | undefined };

interface Props {
  params: { id: string };
  searchParams: SearchParams;
}

export default async function EditCoursePage(props: Props) {
  return (
    <div className="container max-w-4xl py-6">
      <Suspense fallback={<div>Loading...</div>}>
        <ClientPage id={props.params.id} />
      </Suspense>
    </div>
  );
}
