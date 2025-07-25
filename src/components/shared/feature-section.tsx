import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AddCourseModal } from "./add-course-modal";

export function FeatureSection() {
  return (
    <section className="py-24 space-y-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="order-1 lg:order-1 space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Discover Top Courses with Trusted Peer Insights
              </h2>
              <p className="text-muted-foreground text-lg">
                Explore honest feedback and ratings from fellow learners. Find
                the best courses faster and make confident choices for your
                educational journey.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="flex items-start gap-3">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <div>
                    <p className="font-medium">Verified Course Reviews</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <div>
                    <p className="font-medium">Comprehensive Ratings</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <div>
                    <p className="font-medium">Community Q&amp;A</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <div>
                    <p className="font-medium">Personalized Recommendations</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" variant="default" asChild>
                <Link href="/categories">Start Exploring</Link>
              </Button>
              <AddCourseModal
                trigger={
                  <Button size="lg" variant="secondary">
                    Add Course
                  </Button>
                }
              />
            </div>
          </div>
          <div className="order-2 lg:order-2 flex items-start justify-end h-full">
            <Image
              src="/section-image-2.png"
              alt="edskool Platform Features"
              height={600}
              width={600}
              className="lg:h-[500px] w-full lg:w-auto rounded-2xl bg-muted"
              priority
            />
          </div>
        </div>
      </div>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="order-2 lg:order-1 flex items-start h-full">
            <Image
              src="/section-image.png"
              alt="edskool Platform Features"
              height={600}
              width={600}
              className="lg:h-[500px] w-full lg:w-auto rounded-2xl bg-muted"
              priority
            />
          </div>
          <div className="order-1 lg:order-2 space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Make Better Learning Decisions with Community Reviews
              </h2>
              <p className="text-muted-foreground text-lg">
                Get authentic insights from real learners. Our community-driven
                reviews help you choose the right courses and avoid wasting time
                and money on the wrong ones.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" variant="default" asChild>
                <Link href="/auth/signup">Sign Up Now</Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
