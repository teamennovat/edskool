"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface UserReviewsProps {
  userId: string;
}

export function UserReviews({ userId }: UserReviewsProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  interface Course {
    id: string;
    name: string;
    link: string;
    description: string;
    slug: string;
  }

  interface Review {
    id: string;
    rating: number;
    comment: string;
    created_at: string;
    course: Course;
  }

  const [reviews, setReviews] = useState<Review[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user's reviews
  useState(async () => {
    const { data: userReviews, error } = await supabase
      .from("course_reviews")
      .select(
        `
        id,
        rating,
        comment,
        created_at,
        course:courses (
          id,
          name,
          description,
          link,
          slug
        )
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reviews:", error);
      return;
    }

    type SupabaseReview = {
      id: string;
      rating: number;
      comment: string;
      created_at: string;
      course: Course | Course[];
    };

    setReviews(
      (userReviews || []).map((review) => {
        const r = review as SupabaseReview;
        return {
          id: r.id,
          rating: r.rating,
          comment: r.comment,
          created_at: r.created_at,
          course: Array.isArray(r.course) ? r.course[0] : r.course,
        } as Review;
      })
    );
    setIsLoading(false);
  });

  const handleDelete = async () => {
    if (!deleteId) return;

    const { error } = await supabase
      .from("course_reviews")
      .delete()
      .eq("id", deleteId);

    if (error) {
      toast.error("Could not delete the review. Please try again.");
      return;
    }

    setReviews((prev) => prev.filter((review) => review.id !== deleteId));
    setDeleteId(null);
    toast.success("Review deleted successfully.");
    router.refresh();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center text-muted-foreground rounded-lg border p-8">
            You haven&#39;t written any reviews yet.
          </div>
        ) : (
          <div className="masonry sm:masonry-sm md:masonry-md">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="break-inside-avoid rounded-lg border bg-card p-6 mb-6"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <a
                          href={review.course.link}
                          className="text-lg font-semibold hover:text-primary transition-colors line-clamp-2 mb-1"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {review.course.name}
                        </a>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {review.course.description}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(review.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete review</span>
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className={`w-6 h-6 ${
                              i < review.rating
                                ? "text-primary"
                                : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(review.created_at), "MMM d, yyyy")}
                      </span>
                    </div>
                    <p className="text-muted-foreground line-clamp-3">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
