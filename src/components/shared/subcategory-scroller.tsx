"use client";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect } from "react";

interface Subcategory {
  id: string;
  name: string;
  description: string;
  slug: string;
  featured: boolean;
}

interface SubcategoryScrollerProps {
  categorySlug: string;
  subcategories: Subcategory[];
  activeSubcategory?: string;
}

export function SubcategoryScroller({
  categorySlug,
  subcategories,
  activeSubcategory,
}: SubcategoryScrollerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollAmount = 200;
    const leftPosition =
      direction === "left"
        ? el.scrollLeft - scrollAmount
        : el.scrollLeft + scrollAmount;

    el.scrollTo({
      left: leftPosition,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      {canScrollLeft && (
        <Button
          variant="outline"
          size="icon"
          className="absolute -left-4 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-background shadow-md"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
      <div
        ref={scrollRef}
        className="no-scrollbar flex gap-2 overflow-x-auto px-1 pb-4 pt-1"
        onScroll={checkScroll}
      >
        <Link href={`/categories/${categorySlug}`}>
          <Button
            variant="outline"
            className={cn(
              "whitespace-nowrap",
              !activeSubcategory &&
                "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            All Courses
          </Button>
        </Link>
        {subcategories.map((subcategory) => (
          <Link
            key={subcategory.id}
            href={`/categories/${categorySlug}/${subcategory.slug}`}
          >
            <Button
              variant="outline"
              className={cn(
                "whitespace-nowrap",
                activeSubcategory === subcategory.slug &&
                  "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              {subcategory.name}
            </Button>
          </Link>
        ))}
      </div>
      {canScrollRight && (
        <Button
          variant="outline"
          size="icon"
          className="absolute -right-4 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-background shadow-md"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
