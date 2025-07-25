"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  category_id: string;
}

interface AddCourseModalProps {
  trigger: React.ReactNode;
}

export function AddCourseModal({ trigger }: AddCourseModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      if (data) setCategories(data);
    };
    fetchCategories();
  }, [supabase]);

  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!selectedCategory) {
        setSubcategories([]);
        return;
      }
      const { data } = await supabase
        .from("subcategories")
        .select("*")
        .eq("category_id", selectedCategory)
        .order("name");
      if (data) setSubcategories(data);
    };
    fetchSubcategories();
  }, [selectedCategory, supabase]);

  const handleOpenChange = (open: boolean) => {
    if (!isLoading) {
      setIsOpen(open);
      if (!open) {
        setSelectedCategory("");
        setSelectedSubcategory("");
        formRef.current?.reset();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const courseName = formData.get("courseName") as string;
      const courseDescription = formData.get("courseDescription") as string;
      const courseLink = formData.get("courseLink") as string;
      const courseAuthor = formData.get("courseAuthor") as string;
      const categoryId = formData.get("categoryId") as string;
      const subcategoryId = formData.get("subcategoryId") as string;

      if (!categoryId) throw new Error("Please select a category");
      if (!subcategoryId) throw new Error("Please select a subcategory");

      // Validate URL format
      try {
        new URL(courseLink);
      } catch {
        throw new Error(
          "Please enter a valid URL starting with http:// or https://"
        );
      }

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Insert course into database
      const { error } = await supabase.from("courses").insert([
        {
          name: courseName,
          description: courseDescription,
          link: courseLink,
          author: courseAuthor,
          status: "pending",
          submitted_by: user.id,
          category_id: categoryId,
          subcategory_id: subcategoryId,
        },
      ]);

      if (error) throw error;

      toast.success("Course submitted for review");
      setIsOpen(false);
      setSelectedCategory("");
      setSelectedSubcategory("");
      formRef.current?.reset();
    } catch (error: unknown) {
      console.error("Submission error:", {
        error,
        errorType: typeof error,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorDetails:
          error instanceof Object ? JSON.stringify(error) : undefined,
      });

      if (error instanceof Error) {
        toast.error(error.message);
      } else if (typeof error === "object" && error !== null) {
        const pgError = error as {
          code?: string;
          message?: string;
          details?: string;
        };

        // Handle all possible duplicate URL error cases
        if (
          pgError.code === "23505" || // Unique constraint violation
          pgError.code === "P0001" || // Raised exception from trigger
          pgError.message?.includes("duplicate") ||
          pgError.details?.includes("URL already exists")
        ) {
          toast.error("This course already exists");
        } else {
          toast.error("Failed to submit course");
        }
      } else {
        toast.error("Failed to submit course");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] h-[100vh] sm:h-auto">
        <div className="h-full justify-center flex flex-col">
          <DialogHeader>
            <DialogTitle>Add New Course</DialogTitle>
            <DialogDescription>
              Submit a course for review. It will be published after approval.
            </DialogDescription>
          </DialogHeader>
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="grid gap-6 py-6"
          >
            <div className="grid gap-2">
              <Label htmlFor="courseName">Course Name</Label>
              <Input
                id="courseName"
                name="courseName"
                placeholder="Introduction to React"
                required
                disabled={isLoading}
                autoComplete="off"
                spellCheck="false"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="courseDescription">Course Description</Label>
              <Textarea
                id="courseDescription"
                name="courseDescription"
                placeholder="A brief description of what students will learn in this course"
                required
                disabled={isLoading}
                className="min-h-[100px]"
                autoComplete="off"
                spellCheck="false"
              />
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="categoryId">Category</Label>
                <Select
                  defaultValue={selectedCategory}
                  onValueChange={setSelectedCategory}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full" id="categoryId">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input
                  type="hidden"
                  name="categoryId"
                  value={selectedCategory}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="subcategoryId">Subcategory</Label>
                <Select
                  disabled={!selectedCategory || isLoading}
                  value={selectedSubcategory}
                  onValueChange={setSelectedSubcategory}
                >
                  <SelectTrigger className="w-full" id="subcategoryId">
                    <SelectValue placeholder="Select a subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {subcategories.map((subcategory) => (
                      <SelectItem key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input
                  type="hidden"
                  name="subcategoryId"
                  value={selectedSubcategory}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="courseLink">Course Link</Label>
              <Input
                id="courseLink"
                name="courseLink"
                type="url"
                placeholder="https://example.com/course"
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="courseAuthor">Course Author</Label>
              <Input
                id="courseAuthor"
                name="courseAuthor"
                placeholder="John Doe"
                required
                disabled={isLoading}
                autoComplete="off"
                spellCheck="false"
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit Course"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
