import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Course - Admin Dashboard",
  description: "Edit course details in the admin dashboard",
};

export default function EditCourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
