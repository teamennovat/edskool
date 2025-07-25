"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "sonner";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClientComponentClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const name = formData.get("name") as string;
      const email = formData.get("email") as string;
      const subject = formData.get("subject") as string;
      const message = formData.get("message") as string;

      const { error } = await supabase.from("contact_messages").insert([
        {
          name,
          email,
          subject,
          message,
          status: "unread",
        },
      ]);

      if (error) throw error;

      toast.success(
        "Message sent successfully! We&apos;ll get back to you soon."
      );
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-muted-foreground">
          Have a question or suggestion? We&apos;d love to hear from you.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Get in Touch</h2>
            <p className="text-muted-foreground">
              Fill out the form and our team will get back to you within 24
              hours.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Email</h3>
            <p className="text-muted-foreground">contact@edskool.com</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Office</h3>
            <p className="text-muted-foreground">
              123 Education Street
              <br />
              Learning City, 12345
              <br />
              Country
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/edskool"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                Twitter
              </a>
              <a
                href="https://linkedin.com/company/edskool"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              name="name"
              placeholder="Your Name"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Input
              name="email"
              type="email"
              placeholder="Your Email"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Input
              name="subject"
              placeholder="Subject"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Textarea
              name="message"
              placeholder="Your Message"
              required
              disabled={isSubmitting}
              className="min-h-[150px]"
            />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </div>
    </div>
  );
}
