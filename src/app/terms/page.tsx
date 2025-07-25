import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | edskool",
  description:
    "Read our terms of service to understand your rights and responsibilities when using edskool.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

      <div className="prose dark:prose-invert max-w-none">
        <p className="text-sm text-muted-foreground">
          Last updated: July 25, 2025
        </p>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
          <p>
            By accessing or using edskool (&quot;the Service&quot;), you agree
            to be bound by these Terms of Service. If you disagree with any part
            of the terms, you do not have permission to access the Service.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">2. User Accounts</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>You must be at least 13 years old to use the Service</li>
            <li>
              You are responsible for maintaining the security of your account
            </li>
            <li>You must provide accurate and complete information</li>
            <li>You may not use another person&apos;s account</li>
            <li>
              You must notify us of any security breach or unauthorized use
            </li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">3. User Content</h2>
          <h3 className="text-xl font-semibold mt-6 mb-3">
            3.1 Content Ownership
          </h3>
          <p>
            You retain ownership of content you submit to the Service. By
            submitting content, you grant us a worldwide, non-exclusive,
            royalty-free license to use, copy, modify, and display the content
            in connection with the Service.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            3.2 Content Guidelines
          </h3>
          <p>Your content must:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Be accurate and truthful</li>
            <li>Be based on personal experience</li>
            <li>Not infringe on others&apos; rights</li>
            <li>Not contain spam or misleading information</li>
            <li>Not contain harmful or offensive material</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">4. Course Reviews</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Reviews must be based on actual course experience</li>
            <li>Reviews must be honest and unbiased</li>
            <li>We reserve the right to remove inappropriate reviews</li>
            <li>Review manipulation is strictly prohibited</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">
            5. Prohibited Activities
          </h2>
          <p>You may not:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Use the Service for illegal purposes</li>
            <li>Post false or misleading information</li>
            <li>Impersonate others</li>
            <li>Manipulate ratings or reviews</li>
            <li>Attempt to gain unauthorized access</li>
            <li>Interfere with the Service&apos;s operation</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">
            6. Intellectual Property
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              The Service and its original content are protected by copyright
              and other laws
            </li>
            <li>
              Our trademarks and trade dress may not be used without permission
            </li>
            <li>
              Third-party trademarks remain the property of their respective
              owners
            </li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">7. Termination</h2>
          <p>
            We reserve the right to terminate or suspend your account and access
            to the Service:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>For violations of these terms</li>
            <li>For abusive behavior</li>
            <li>At our sole discretion</li>
            <li>Without prior notice or liability</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">8. Disclaimer</h2>
          <p>
            The Service is provided &quot;as is&quot; without warranties of any
            kind. We do not guarantee the accuracy or completeness of any
            information on the Service.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">
            9. Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by law, we shall not be liable for
            any indirect, incidental, special, consequential, or punitive
            damages arising from your use of the Service.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">10. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. We will
            notify users of any material changes via email or through the
            Service.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">11. Governing Law</h2>
          <p>
            These terms shall be governed by the laws of [Your Jurisdiction],
            without regard to its conflict of law provisions.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">
            12. Contact Information
          </h2>
          <p>For any questions about these Terms, please contact us at:</p>
          <ul className="list-disc pl-6 space-y-2 mb-8">
            <li>Email: legal@edskool.com</li>
            <li>Address: [Your Business Address]</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
