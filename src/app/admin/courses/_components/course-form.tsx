"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface Subcategory {
  id: string;
  name: string;
  category_id: string;
}

export default async function CourseForm({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    author: "",
    link: "",
    category_id: "",
    subcategory_id: "",
  });

  const supabase = createClientComponentClient();

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from("categories")
          .select("*")
          .order("name");

        if (categoriesError) throw categoriesError;
        setCategories(categoriesData || []);

        // Fetch subcategories
        const { data: subcategoriesData, error: subcategoriesError } =
          await supabase.from("subcategories").select("*").order("name");

        if (subcategoriesError) throw subcategoriesError;
        setSubcategories(subcategoriesData || []);

        // Fetch course data if editing
        if (courseId) {
          const { data: courseData, error: courseError } = await supabase
            .from("courses")
            .select("*")
            .eq("id", courseId)
            .single();

          if (courseError) throw courseError;
          if (courseData) {
            setFormData(courseData);
            setSelectedCategory(courseData.category_id || "");
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Could not load required data");
      }
    };

    loadData();
  }, [courseId, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (courseId) {
        // Update existing course
        const { data, error } = await supabase.rpc("update_course", {
          course_id: courseId,
          course_name: formData.name,
          course_description: formData.description,
          course_author: formData.author,
          course_link: formData.link,
          course_status: "approved",
          course_category_id: formData.category_id || null,
          course_subcategory_id: formData.subcategory_id || null,
        });

        if (error) throw error;
        if (!data) throw new Error("Failed to update course");

        toast.success("Course updated successfully");
        router.back();
      } else {
        // Get the current user's ID
        const { data: userData, error: userError } =
          await supabase.auth.getUser();
        if (userError) throw userError;
        if (!userData.user)
          throw new Error("You must be logged in to create a course");

        // Create new course
        const { data, error } = await supabase
          .from("courses")
          .insert([
            {
              name: formData.name,
              description: formData.description,
              author: formData.author,
              link: formData.link,
              category_id: formData.category_id || null,
              subcategory_id: formData.subcategory_id || null,
              status: "approved",
              submitted_by: userData.user.id,
            },
          ])
          .select()
          .single();

        if (error) {
          if (error.code === "23505") {
            throw new Error("A course with this link already exists");
          }
          throw error;
        }
        if (!data) throw new Error("Failed to create course");

        toast.success("Course created successfully");
        router.push("/admin/courses");
      }
    } catch (error) {
      console.error("Error saving course:", error);
      toast.error(
        error instanceof Error ? error.message : "Could not save course"
      );
    } finally {
      setLoading(false);
    }
  }; // Close handleSubmit

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setFormData((prev) => ({
      ...prev,
      category_id: value,
      subcategory_id: "", // Reset subcategory when category changes
    }));
  };

  const filteredSubcategories = subcategories.filter(
    (sub) => sub.category_id === selectedCategory
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {courseId ? "Edit Course" : "Add New Course"}
        </h1>
        <p className="text-muted-foreground">
          {courseId
            ? "Update the course details below"
            : "Fill in the course details below"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Course Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
              disabled={loading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="author">Author/Institution</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, author: e.target.value }))
              }
              required
              disabled={loading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="link">Course Link</Label>
            <Input
              id="link"
              type="url"
              value={formData.link}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, link: e.target.value }))
              }
              required
              disabled={loading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              required
              disabled={loading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category_id}
              onValueChange={handleCategoryChange}
              disabled={loading}
            >
              <SelectTrigger>
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
          </div>

          <div className="grid gap-2">
            <Label htmlFor="subcategory">Subcategory</Label>
            <Select
              value={formData.subcategory_id}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, subcategory_id: value }))
              }
              disabled={loading || !selectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a subcategory" />
              </SelectTrigger>
              <SelectContent>
                {filteredSubcategories.map((subcategory) => (
                  <SelectItem key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {courseId ? "Update Course" : "Create Course"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
