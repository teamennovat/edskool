"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/admin/sidebar";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      setShowSidebar(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const handleToggle = () => setShowSidebar((prev) => !prev);
    document.addEventListener("toggle-sidebar", handleToggle);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("toggle-sidebar", handleToggle);
    };
  }, []);

  return (
    <div className="flex h-screen w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div
        className={cn(
          "fixed inset-0 z-20 bg-black/80 lg:hidden",
          showSidebar && isMobile ? "block" : "hidden"
        )}
        onClick={() => setShowSidebar(false)}
      />
      <div
        className={cn(
          "fixed inset-y-0 z-30 w-64 transform transition-transform duration-200 ease-in-out lg:static lg:translate-x-0",
          showSidebar ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Sidebar />
      </div>
      <div className="flex flex-1 flex-col">
        <main className="flex-1 overflow-y-auto bg-muted/10 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
