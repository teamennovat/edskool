import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="w-full my-12">
    <div
      className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:rounded-lg bg-primary"
      style={{
        backgroundImage: "url('/CTA-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-6xl mx-auto text-left space-y-8">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary-foreground">
        Ready to Share Your Learning Experience?
        </h2>
        <p className="text-lg max-w-3xl text-primary-foreground/90">
        Join our community of learners and help others find the perfect
        educational resources. Share your course reviews and make a
        difference in someone&apos;s learning journey.
        </p>
        <div className="flex flex-wrap gap-4 justify-start">
        <Button
          size="lg"
          variant="secondary"
          className="min-w-[160px]"
          asChild
        >
          <Link href="/categories">Browse Courses</Link>
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="min-w-[160px] bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
          asChild
        >
          <Link href="/auth/sign-up">Sign Up Free</Link>
        </Button>
        </div>
      </div>
    </div>
    </section>
  );
}
