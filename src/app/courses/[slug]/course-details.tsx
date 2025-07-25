"use client";

import { useState, useEffect, useCallback } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import Masonry from "react-masonry-css";

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_id: string;
  user_email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  total_reviews: number;
  vote_score: number;
  user_vote: "up" | "down" | null;
  report_count: number;
}

interface CourseProps {
  course: {
    id: string;
    name: string;
    description: string;
    author: string;
    link: string;
    created_at: string;
    reviews: Review[];
  };
  session: {
    user: {
      id: string;
      email?: string;
    };
  } | null;
}

export default function CourseDetails({ course, session }: CourseProps) {
  const supabase = createClientComponentClient();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Report modal state
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [hasReported, setHasReported] = useState<Record<string, boolean>>({});

  // Fetch initial vote states and report status
  const [reviews, setReviews] = useState(course.reviews);

  const fetchVoteStates = useCallback(async () => {
    if (!reviews.length) return;

    const { data: voteData, error } = await supabase.rpc("get_review_votes", {
      review_ids: reviews.map((r) => r.id.toString()),
    });

    if (error) {
      console.error("Error fetching vote states:", error);
      return;
    }

    if (voteData) {
      interface VoteInfo {
        review_id: string;
        vote_score: number;
        user_vote: "up" | "down" | null;
      }
      const updatedReviews = reviews.map((review) => {
        const voteInfo = voteData.find(
          (v: VoteInfo) => v.review_id === review.id
        );
        if (voteInfo) {
          return {
            ...review,
            vote_score: voteInfo.vote_score,
            user_vote: voteInfo.user_vote,
          };
        }
        return review;
      });
      setReviews(updatedReviews);
    }
  }, [reviews, supabase]);

  // Fetch report status for each review
  const fetchReportStatus = useCallback(async () => {
    if (!session?.user?.id || !reviews.length) return;

    const { data, error } = await supabase
      .from("review_reports")
      .select("review_id")
      .in(
        "review_id",
        reviews.map((r) => r.id)
      )
      .eq("user_id", session.user.id);

    if (error) {
      console.error("Error fetching report status:", error);
      return;
    }

    if (data) {
      const reportedReviews = data.reduce(
        (acc: Record<string, boolean>, curr) => {
          acc[curr.review_id] = true;
          return acc;
        },
        {}
      );
      setHasReported(reportedReviews);
    }
  }, [session?.user?.id, reviews, supabase]);

  // Call fetchVoteStates and fetchReportStatus when component mounts
  useEffect(() => {
    fetchVoteStates();
    fetchReportStatus();
  }, [fetchVoteStates, fetchReportStatus]);

  const handleVote = async (reviewId: string, voteType: "up" | "down") => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to vote");
      return;
    }

    try {
      // Find the review
      const review = reviews.find((r) => r.id === reviewId);
      if (!review) {
        toast.error("Review not found");
        return;
      }

      // Check if trying to vote on own review
      if (review.user_id === session.user.id) {
        toast.error("Cannot vote on your own review");
        return;
      }

      // Determine the action based on current vote state
      const currentVote = review.user_vote;
      const isRemovingVote = currentVote === voteType;

      if (isRemovingVote) {
        // Remove the vote
        const { error: deleteError } = await supabase
          .from("review_votes")
          .delete()
          .eq("review_id", reviewId)
          .eq("user_id", session.user.id);

        if (deleteError) {
          console.error("Delete error:", deleteError);
          toast.error("Failed to remove vote");
          return;
        }
      } else {
        // Add or update vote
        const { error: upsertError } = await supabase
          .from("review_votes")
          .upsert(
            {
              review_id: reviewId,
              user_id: session.user.id,
              vote_type: voteType,
            },
            {
              onConflict: "review_id,user_id",
            }
          );

        if (upsertError) {
          console.error("Vote error:", upsertError);
          toast.error("Failed to save vote");
          return;
        }
      }

      // Get updated vote count
      const { data: updatedVotes, error: countError } = await supabase.rpc(
        "get_review_votes",
        {
          review_ids: [reviewId.toString()],
        }
      );

      if (countError) {
        console.error("Count error:", countError);
        toast.error("Failed to update vote count");
        return;
      }

      // Update the review with server data
      if (updatedVotes?.[0]) {
        const updatedReview = {
          ...review,
          vote_score: updatedVotes[0].vote_score,
          user_vote: updatedVotes[0].user_vote,
        };

        // Update the reviews array with the new review
        setReviews(reviews.map((r) => (r.id === reviewId ? updatedReview : r)));
      } else {
        // Calculate vote score change
        let scoreChange = 0;
        if (isRemovingVote) {
          scoreChange = voteType === "up" ? -1 : 1;
        } else {
          if (currentVote) {
            // Changing vote
            scoreChange = voteType === "up" ? 2 : -2;
          } else {
            // New vote
            scoreChange = voteType === "up" ? 1 : -1;
          }
        }

        // Create a new review object with updated values
        const updatedReview = {
          ...review,
          user_vote: isRemovingVote ? null : voteType,
          vote_score: (review.vote_score || 0) + scoreChange,
        };

        // Update the reviews array
        setReviews(reviews.map((r) => (r.id === reviewId ? updatedReview : r)));
      }

      // Force a re-render with a new array reference
      course.reviews = [...course.reviews];
    } catch (error) {
      console.error("Error voting:", error);
      toast.error("Failed to register vote");
    }
  };

  const handleReport = async () => {
    if (!session?.user?.id || !selectedReviewId) {
      toast.error("You must be logged in to report");
      return;
    }

    if (!reportReason.trim()) {
      toast.error("Please provide a reason for reporting");
      return;
    }

    setIsSubmittingReport(true);
    try {
      // First check if user has already reported this review
      const { data: existingReport } = await supabase
        .from("review_reports")
        .select("id")
        .eq("review_id", selectedReviewId)
        .eq("user_id", session.user.id)
        .single();

      if (existingReport) {
        toast.error("You have already reported this review");
        return;
      }

      const { error } = await supabase.from("review_reports").insert([
        {
          review_id: selectedReviewId,
          user_id: session.user.id,
          reason: reportReason.trim(),
          status: "pending",
        },
      ]);

      if (error) throw error;

      // Update local state
      setHasReported((prev) => ({ ...prev, [selectedReviewId]: true }));

      // Update review report count
      setReviews(
        reviews.map((review) =>
          review.id === selectedReviewId
            ? { ...review, report_count: (review.report_count || 0) + 1 }
            : review
        )
      );

      toast.success("Report submitted successfully");
      setReportModalOpen(false);
      setReportReason("");
      setSelectedReviewId(null);
    } catch (error) {
      console.error("Error reporting review:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to submit report"
      );
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session?.user?.id) {
      toast.error("You must be logged in to submit a review");
      return;
    }

    if (!rating || !comment.trim()) {
      toast.error("Please provide both rating and review");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: existingReview } = await supabase
        .from("course_reviews")
        .select()
        .eq("course_id", course.id)
        .eq("user_id", session.user.id)
        .single();

      if (existingReview) {
        toast.error("You have already reviewed this course");
        return;
      }

      const { error: courseError } = await supabase
        .from("course_reviews")
        .insert([
          {
            course_id: course.id,
            user_id: session.user.id,
            rating: Number(rating),
            comment: comment.trim(),
          },
        ]);

      if (courseError) {
        toast.error("Error submitting review");
        console.error(courseError);
        return;
      }

      toast.success("Review submitted successfully");
      setRating(0);
      setComment("");

      // Refresh the page to show the new review
      window.location.reload();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-7xl py-6 space-y-8 px-4 sm:px-6 lg:px-8 mt-12">
      {/* Course Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Course Info */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-start gap-4">
            <div className="relative w-16 h-16 overflow-hidden rounded-lg flex-shrink-0">
              <Image
                src={`https://www.google.com/s2/favicons?sz=128&domain=${
                  new URL(course.link).hostname
                }`}
                alt={course.name}
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{course.name}</h1>
              <p className="text-muted-foreground">
                by <span className="text-primary">{course.author}</span>
              </p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground">{course.description}</p>
          <Link
            href={course.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-primary hover:text-primary/80"
          >
            Visit Course
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </Link>

          {/* Write a Review Section */}
          {session?.user ? (
            <div className="bg-white rounded-lg border p-6 mt-4">
              <h2 className="text-xl font-semibold mb-4">Write a Review</h2>
              <form className="space-y-4" onSubmit={handleSubmitReview}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating
                  </label>
                  <div className="flex gap-2">
                    {[...Array(5)].map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setRating(i + 1)}
                        className={`h-8 w-8 ${
                          i < rating ? "text-primary" : "text-gray-300"
                        } hover:text-primary focus:outline-none transition-colors`}
                      >
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Review
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                    placeholder="Write your review here..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-lg border p-6 text-center">
              <p className="text-muted-foreground">
                Please{" "}
                <Link
                  href="/auth/signin"
                  className="text-primary hover:underline"
                >
                  sign in
                </Link>{" "}
                to write a review
              </p>
            </div>
          )}
        </div>

        {/* Rating Summary */}
        <div className="bg-gray-50 rounded-lg p-6 space-y-6 h-fit">
          <div>
            <div className="text-4xl font-bold text-primary">
              {(
                reviews.reduce((acc, r) => acc + r.rating, 0) /
                (reviews.length || 1)
              ).toFixed(1)}
            </div>
            <div className="flex my-2">
              {[...Array(5)].map((_, i) => {
                const averageRating =
                  reviews.reduce((acc, r) => acc + r.rating, 0) /
                  (reviews.length || 1);
                return (
                  <svg
                    key={i}
                    className={`h-10 w-10 ${
                      i < Math.floor(averageRating)
                        ? "text-primary"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                );
              })}
            </div>
            <div className="text-sm text-muted-foreground">
              Based on {reviews.length} reviews
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = reviews.filter((r) => r.rating === rating).length;
              const percentage = (count / (reviews.length || 1)) * 100;
              return (
                <div key={rating} className="flex items-center gap-2">
                  <div className="flex items-center gap-1 w-12">
                    <span className="text-sm font-medium">{rating}</span>
                    <svg
                      className="w-4 h-4 text-primary"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="w-16 text-right">
                    <span className="text-sm text-muted-foreground">
                      {count} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-6">Student Reviews</h2>
        {reviews.length > 0 ? (
          <>
            <Masonry
              breakpointCols={{
                default: 3,
                1024: 2,
                768: 1,
              }}
              className="flex -ml-4 w-auto"
              columnClassName="pl-4 bg-clip-padding"
            >
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-gray-50 rounded-lg p-4 mb-4 break-inside-avoid"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                        {review.avatar_url ? (
                          <Image
                            src={review.avatar_url}
                            alt={review.full_name || "User"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                            {(review.full_name || "A")[0].toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <div>
                          <p className="font-medium text-sm">
                            {review.full_name || "Anonymous User"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {review.total_reviews}{" "}
                            {review.total_reviews === 1 ? "review" : "reviews"}{" "}
                            total
                          </p>
                        </div>
                      </div>
                    </div>
                    <time className="text-sm text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                  </div>

                  <div className="mt-4">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-6 w-6 ${
                            i < review.rating ? "text-primary" : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="mt-4 text-gray-600">{review.comment}</p>
                  </div>

                  {/* Voting and Reporting Section */}
                  <div className="flex items-center justify-between mt-4 pt-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleVote(review.id, "up")}
                        disabled={
                          !session?.user || review.user_id === session?.user?.id
                        }
                        className={`p-2 rounded transition-colors ${
                          review.user_vote === "up"
                            ? "text-primary"
                            : "text-gray-500 hover:text-primary"
                        } ${
                          !session?.user || review.user_id === session?.user?.id
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-primary/10"
                        }`}
                        title={
                          !session?.user
                            ? "Sign in to vote"
                            : review.user_id === session?.user?.id
                            ? "Cannot vote on your own review"
                            : review.user_vote === "up"
                            ? "Remove upvote"
                            : "Helpful"
                        }
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke={
                            review.user_vote === "up"
                              ? "var(--color-primary, #3b82f6)"
                              : "currentColor"
                          }
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                      </button>
                      <span
                        className={`text-sm font-medium min-w-[20px] text-center ${
                          review.vote_score > 0
                            ? "text-primary"
                            : review.vote_score < 0
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      >
                        {review.vote_score > 0 ? "+" : ""}
                        {review.vote_score || 0}
                      </span>
                      <button
                        onClick={() => handleVote(review.id, "down")}
                        disabled={
                          !session?.user || review.user_id === session?.user?.id
                        }
                        className={`p-2 rounded transition-colors ${
                          review.user_vote === "down"
                            ? "text-red-600"
                            : "text-gray-500 hover:text-red-600"
                        } ${
                          !session?.user || review.user_id === session?.user?.id
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-red-50"
                        }`}
                        title={
                          !session?.user
                            ? "Sign in to vote"
                            : review.user_id === session?.user?.id
                            ? "Cannot vote on your own review"
                            : review.user_vote === "down"
                            ? "Remove downvote"
                            : "Not Helpful"
                        }
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        if (!session?.user) {
                          toast.error(
                            "You must be logged in to report a review"
                          );
                          return;
                        }
                        if (review.user_id === session.user.id) {
                          toast.error("You cannot report your own review");
                          return;
                        }
                        setSelectedReviewId(review.id);
                        setReportModalOpen(true);
                      }}
                      disabled={
                        !session?.user ||
                        review.user_id === session?.user?.id ||
                        hasReported[review.id]
                      }
                      className={`text-gray-500 hover:text-red-600 text-sm flex items-center space-x-1 ${
                        !session?.user ||
                        review.user_id === session?.user?.id ||
                        hasReported[review.id]
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      title={
                        !session?.user
                          ? "Sign in to report"
                          : review.user_id === session.user.id
                          ? "You cannot report your own review"
                          : hasReported[review.id]
                          ? "You have already reported this review"
                          : "Report this review"
                      }
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      <span>Report</span>
                    </button>
                  </div>
                </div>
              ))}
            </Masonry>

            {reportModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
                <div
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                  onClick={() => {
                    setReportModalOpen(false);
                    setReportReason("");
                    setSelectedReviewId(null);
                  }}
                />
                <div className="relative bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Report Review</h3>
                    <button
                      onClick={() => {
                        setReportModalOpen(false);
                        setReportReason("");
                        setSelectedReviewId(null);
                      }}
                      className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Reason for Reporting
                      </label>
                      <textarea
                        value={reportReason}
                        onChange={(e) => setReportReason(e.target.value)}
                        placeholder="Please explain why you're reporting this review..."
                        className="w-full min-h-[100px] p-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        autoFocus
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => {
                          setReportModalOpen(false);
                          setReportReason("");
                          setSelectedReviewId(null);
                        }}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleReport}
                        disabled={!reportReason.trim() || isSubmittingReport}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmittingReport ? "Submitting..." : "Submit Report"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Be the first to review this course!
          </div>
        )}
        {!session?.user && (
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Please{" "}
              <Link
                href="/auth/signin"
                className="text-primary hover:underline"
              >
                sign in
              </Link>{" "}
              to write a review
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
