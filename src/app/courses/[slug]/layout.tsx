import { Metadata } from "next";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { type Database } from "@/lib/database.types";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: course } = await supabase
    .from("courses")
    .select("name, description, author")
    .eq("slug", params.slug)
    .single();

  if (!course) {
    return {
      title: "Course Not Found",
    };
  }

  return {
    title: course.name,
    description: course.description,
    openGraph: {
      title: course.name,
      description: course.description,
      type: "article",
      authors: [course.author],
    },
  };
}

export default async function CourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
