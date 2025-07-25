import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | edskool",
  description:
    "Learn about edskool's mission to help students find the best online courses through authentic reviews and community-driven insights.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">About edskool</h1>

      <section className="prose dark:prose-invert max-w-none">
        <p className="text-lg mb-6">
          edskool is a community-driven platform dedicated to helping students
          and professionals make informed decisions about their online education
          journey.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
        <p>
          Our mission is to bring transparency to online education by providing
          authentic, unbiased course reviews from real students. We believe that
          everyone deserves access to quality education, and making the right
          choice shouldn&apos;t be a matter of guesswork.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">What We Offer</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Authentic course reviews from verified students</li>
          <li>Comprehensive course information across multiple platforms</li>
          <li>Community-driven ratings and insights</li>
          <li>Detailed category and subcategory organization</li>
          <li>Platform-specific course comparisons</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Our Values</h2>
        <div className="grid gap-6 mt-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">Transparency</h3>
            <p>
              We believe in complete transparency in our review process and
              platform operations.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Authenticity</h3>
            <p>
              Every review on our platform comes from verified course
              participants.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Community First</h3>
            <p>
              Our platform is built around the needs and experiences of our user
              community.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Educational Excellence
            </h3>
            <p>
              We promote and celebrate high-quality educational content across
              all platforms.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">How We Work</h2>
        <p>edskool operates on a simple yet effective model:</p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Users submit courses they&apos;ve taken for review</li>
          <li>Our team verifies course existence and basic information</li>
          <li>Verified users can submit detailed reviews and ratings</li>
          <li>The community can vote on review helpfulness</li>
          <li>Regular updates ensure information stays current</li>
        </ol>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Join Our Community</h2>
        <p>
          Whether you&apos;re a student, professional, or lifelong learner, your
          experience matters. Join our community to:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Share your course experiences</li>
          <li>Help others make informed decisions</li>
          <li>Discover new learning opportunities</li>
          <li>Connect with fellow learners</li>
        </ul>
      </section>
    </div>
  );
}
