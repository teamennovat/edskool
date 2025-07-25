"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import type { Database } from "@/lib/database.types";

type Course = Database["public"]["Tables"]["courses"]["Row"] & {
  categories: { name: string };
  subcategories: { name: string };
  profiles: { email: string };
};

export default function PendingCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from("courses")
          .select(
            `
            *,
            categories (name),
            subcategories (name),
            profiles!submitted_by (email)
          `
          )
          .eq("status", "pending")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setCourses(data || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast.error("Could not load pending courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [supabase]);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      const { error } = await supabase
        .from("courses")
        .update({ status: "approved" })
        .eq("id", id);

      if (error) throw error;

      setCourses((prevCourses) =>
        prevCourses.filter((course) => course.id !== id)
      );
      toast.success("Course approved successfully");
    } catch (error) {
      console.error("Error approving course:", error);
      toast.error("Could not approve course");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setProcessingId(id);
    try {
      const { error } = await supabase.from("courses").delete().eq("id", id);

      if (error) throw error;

      setCourses((prevCourses) =>
        prevCourses.filter((course) => course.id !== id)
      );
      toast.success("Course deleted successfully");
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Could not delete course");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Pending Courses</h1>
        <p className="text-sm text-muted-foreground">
          {courses.length} course{courses.length === 1 ? "" : "s"} pending
          approval
        </p>
      </div>

      {courses.length === 0 ? (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex h-48 items-center justify-center text-muted-foreground">
            No pending courses
          </div>
        </div>
      ) : (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Name</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Subcategory</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead>Submitted On</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.name}</TableCell>
                  <TableCell>{course.author}</TableCell>
                  <TableCell>{course.categories.name}</TableCell>
                  <TableCell>{course.subcategories.name}</TableCell>
                  <TableCell>{course.profiles.email}</TableCell>
                  <TableCell>
                    {format(new Date(course.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(course.id)}
                        disabled={!!processingId}
                      >
                        {processingId === course.id && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Approve
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={!!processingId}
                          >
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Course</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this course? This
                              action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(course.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
