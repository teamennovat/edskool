"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { toast } from "sonner";

interface Course {
  id: string;
  name: string;
  description: string;
  author: string;
  link: string;
  created_at: string;
  status: string;
  category_id: string | null;
  subcategory_id: string | null;
  category_name: string | null;
  subcategory_name: string | null;
  submitted_by: string;
  submitter_email: string | null;
  submitter_full_name: string | null;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const { data: coursesData, error: coursesError } = await supabase.rpc(
          "get_courses_with_details"
        );

        if (coursesError) throw coursesError;

        setCourses(coursesData || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast.error("Could not load courses");
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [supabase]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this course?")) {
      return;
    }

    setDeletingId(id);
    try {
      const { data, error } = await supabase.rpc("delete_course", {
        course_id: id,
      });

      if (error) throw error;
      if (!data) throw new Error("Course not found");

      setCourses((prevCourses) =>
        prevCourses.filter((course) => course.id !== id)
      );
      toast.success("Course deleted successfully");
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error(
        error instanceof Error ? error.message : "Could not delete course"
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">All Courses</h1>
          <p className="text-muted-foreground">
            Manage and organize all courses in the platform
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/courses/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Course
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course Name</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Subcategory</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted By</TableHead>
              <TableHead>Created On</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell className="font-medium">{course.name}</TableCell>
                <TableCell>{course.author}</TableCell>
                <TableCell>{course.category_name || "-"}</TableCell>
                <TableCell>{course.subcategory_name || "-"}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      course.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {course.status}
                  </span>
                </TableCell>
                <TableCell>
                  {course.submitter_full_name || course.submitter_email || "-"}
                </TableCell>
                <TableCell>
                  {format(new Date(course.created_at), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/courses/${course.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(course.id)}
                      disabled={deletingId === course.id}
                    >
                      {deletingId === course.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-red-500" />
                      )}
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
