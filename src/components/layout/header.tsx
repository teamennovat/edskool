"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BookOpen,
  FileText,
  LogIn,
  Search,
  UserCircle,
  Settings,
  LogOut,
  PencilLine,
  X,
} from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { AddCourseModal } from "@/components/shared/add-course-modal";

export function Header() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  };

  return (
    <header className="sticky top-0 bg-background z-50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div
            className={`flex-shrink-0 ${isSearchOpen ? "hidden md:block" : ""}`}
          >
            <Link
              href="/"
              className="text-xl font-bold flex items-center gap-2"
              aria-label="edskool Home"
            >
              <Image
                src="/logo.png"
                alt="edskool Logo"
                width={120}
                height={40}
                priority
                className="h-10 w-auto"
              />
            </Link>
          </div>

          <div
            className={`${
              isSearchOpen
                ? "flex absolute inset-x-0 top-0 bg-background border-b px-4 h-16 items-center md:static md:inset-auto md:border-0 md:h-auto md:px-0"
                : "hidden md:flex"
            } flex-1 max-w-md`}
          >
            <form
              onSubmit={handleSearch}
              className="w-full flex items-center gap-2"
            >
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="search"
                  placeholder="Search courses..."
                  className="w-full pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {isSearchOpen && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setIsSearchOpen(false)}
                  aria-label="Close search"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </form>
          </div>

          <div
            className={`flex items-center gap-6 ${
              isSearchOpen ? "hidden md:flex" : ""
            }`}
          >
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Open search"
            >
              <Search className="h-5 w-5" />
            </Button>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/categories"
                className="text-sm font-medium hover:text-primary inline-flex items-center gap-2"
              >
                <BookOpen className="h-4 w-4" />
                Categories
              </Link>
              <Link
                href="/blog"
                className="text-sm font-medium hover:text-primary inline-flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Blog
              </Link>
            </nav>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.user_metadata?.avatar_url}
                        alt={user.email}
                      />
                      <AvatarFallback>
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <AddCourseModal
                      trigger={
                        <div className="flex items-center w-full">
                          <PencilLine className="mr-2 h-4 w-4" />
                          <span>Add Course</span>
                        </div>
                      }
                    />
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="default" asChild>
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  <span className="hidden md:inline">Sign In</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
