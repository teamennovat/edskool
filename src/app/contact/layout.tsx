import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | EdSkool",
  description:
    "Get in touch with the EdSkool team. We're here to help with any questions or concerns.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
