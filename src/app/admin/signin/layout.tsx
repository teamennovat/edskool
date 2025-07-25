import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Sign In - EdSkool",
  description: "Sign in to access the EdSkool admin dashboard",
};

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
