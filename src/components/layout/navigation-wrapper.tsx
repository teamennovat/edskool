"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export function NavigationWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth");

  return (
    <>
      {!isAuthPage && <Header />}
      <main className="flex flex-col items-center">{children}</main>
      {!isAuthPage && <Footer />}
    </>
  );
}
