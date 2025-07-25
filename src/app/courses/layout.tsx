import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Course Reviews | edskool",
  description:
    "Discover and read reviews for the best online courses. Get insights from real students and make informed decisions about your education.",
  openGraph: {
    title: "Course Reviews | edskool",
    description:
      "Discover and read reviews for the best online courses. Get insights from real students and make informed decisions about your education.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Course Reviews | edskool",
    description:
      "Discover and read reviews for the best online courses. Get insights from real students and make informed decisions about your education.",
  },
};

export default function CourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
