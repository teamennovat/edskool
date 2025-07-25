import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | edskool",
  description:
    "Learn how edskool protects and handles your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

      <div className="prose dark:prose-invert max-w-none">
        <p className="text-sm text-muted-foreground">
          Last updated: July 25, 2025
        </p>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p>
            edskool (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is
            committed to protecting your privacy. This Privacy Policy explains
            how we collect, use, disclose, and safeguard your information when
            you use our website and services.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">
            2. Information We Collect
          </h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            2.1 Information You Provide
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Account information (name, email, password)</li>
            <li>Profile information (optional biography, expertise areas)</li>
            <li>Course reviews and ratings</li>
            <li>Communications with us</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            2.2 Automatically Collected Information
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Device and browser information</li>
            <li>IP address and location data</li>
            <li>Usage data and interactions</li>
            <li>Cookies and similar technologies</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">
            3. How We Use Your Information
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide and maintain our services</li>
            <li>To verify user identity and prevent fraud</li>
            <li>To process and display course reviews</li>
            <li>To communicate with you about our services</li>
            <li>To improve our platform and user experience</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">
            4. Information Sharing and Disclosure
          </h2>
          <p>We may share your information with:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Service providers (hosting, analytics, etc.)</li>
            <li>Other users (your public profile and reviews)</li>
            <li>Legal authorities when required by law</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to
            protect your data, including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Encryption of data in transit and at rest</li>
            <li>Regular security assessments</li>
            <li>Access controls and authentication</li>
            <li>Secure data storage with Supabase</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">
            6. Your Rights and Choices
          </h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to data processing</li>
            <li>Export your data</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">7. Cookies Policy</h2>
          <p>We use cookies and similar technologies to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Maintain your session</li>
            <li>Remember your preferences</li>
            <li>Analyze platform usage</li>
            <li>Improve user experience</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">
            8. Children&apos;s Privacy
          </h2>
          <p>
            Our services are not intended for children under 13. We do not
            knowingly collect information from children under 13. If you believe
            we have collected information from a child under 13, please contact
            us.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">
            9. International Data Transfers
          </h2>
          <p>
            Your information may be transferred and processed in countries other
            than your own. We ensure appropriate safeguards are in place for
            such transfers.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">
            10. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new policy on this page and
            updating the &quot;Last updated&quot; date.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Email: privacy@edskool.com</li>
            <li>Address: [Your Business Address]</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
