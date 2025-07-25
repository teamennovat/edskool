"use client";

import { Suspense } from "react";
import ClientPage from "./client-page";

export default function EditCoursePage({ params }: { params: { id: string } }) {
  return (
    <div className="container max-w-4xl py-6">
      <Suspense fallback={<div>Loading...</div>}>
        <ClientPage id={params.id} />
      </Suspense>
    </div>
  );
}
