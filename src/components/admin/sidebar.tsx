"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Users,
  LayoutGrid,
  BookCheck,
  FolderTree,
  Settings,
  ChevronDown,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutGrid,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Course Management",
    icon: BookCheck,
    children: [
      { name: "All Courses", href: "/admin/courses" },
      { name: "Pending Approval", href: "/admin/courses/pending" },
    ],
  },
  {
    name: "Categories",
    icon: FolderTree,
    children: [
      { name: "Categories", href: "/admin/categories" },
      { name: "Subcategories", href: "/admin/categories/sub" },
    ],
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  return (
    <div className="flex h-full w-64 flex-col border-r bg-muted/30">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="font-semibold">edskool Admin</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => (
          <div key={item.name}>
            {!item.children ? (
              <Link
                href={item.href}
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-muted",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-foreground"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ) : (
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => toggleMenu(item.name)}
                  className={cn(
                    "group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-muted",
                    item.children.some((child) => pathname === child.href) &&
                      "bg-muted"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                  <ChevronDown
                    className={cn(
                      "ml-auto h-4 w-4 transition-transform",
                      openMenus.includes(item.name) && "rotate-180"
                    )}
                  />
                </button>
                {openMenus.includes(item.name) && (
                  <div className="space-y-1 pl-11">
                    {item.children.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={cn(
                          "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-muted",
                          pathname === subItem.href
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "text-foreground"
                        )}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
