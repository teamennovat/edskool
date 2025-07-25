import { FeaturedCategories } from "@/components/shared/featured-categories";
import { TopRatedCourses } from "@/components/shared/top-rated-courses";
import { RecentBlogPosts } from "@/components/shared/recent-blog-posts";
import { CTASection } from "@/components/shared/cta-section";
import { TrustedBy } from "@/components/shared/trusted-by";
import { FeatureSection } from "@/components/shared/feature-section";
import HeroSection from "@/components/shared/hero-section";

export default async function Home() {
  return (
    <>
    <HeroSection />
      <TrustedBy />
      <FeaturedCategories />
      <FeatureSection />
      <TopRatedCourses />
      <RecentBlogPosts />
      <CTASection />
    </>
  );
}
