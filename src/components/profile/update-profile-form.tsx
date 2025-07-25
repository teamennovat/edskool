"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { User } from "@supabase/supabase-js";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const profileFormSchema = z.object({
  email: z.string(),
  full_name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  bio: z
    .string()
    .max(500, "Bio must be less than 500 characters")
    .optional()
    .nullable(),
  website: z
    .string()
    .transform((val) => {
      if (!val) return null;
      if (!val.startsWith("http://") && !val.startsWith("https://")) {
        return `https://${val}`;
      }
      return val;
    })
    .refine((val) => {
      if (!val) return true;
      try {
        new URL(val);
        return true;
      } catch {
        return false;
      }
    }, "Please enter a valid URL")
    .nullable(),
  twitter_username: z
    .string()
    .max(15, "Twitter username must be less than 15 characters")
    .optional()
    .nullable(),
  github_username: z
    .string()
    .max(39, "GitHub username must be less than 39 characters")
    .optional()
    .nullable(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface UpdateProfileFormProps {
  user: User;
  profile: {
    id: string;
    email: string;
    full_name?: string | null;
    bio?: string | null;
    website?: string | null;
    twitter_username?: string | null;
    github_username?: string | null;
  };
}

export function UpdateProfileForm({ user, profile }: UpdateProfileFormProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      email: user.email!,
      full_name: profile.full_name || "",
      bio: profile.bio || "",
      website: profile.website || "",
      twitter_username: profile.twitter_username || "",
      github_username: profile.github_username || "",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        updated_at: new Date().toISOString(),
        ...data,
      })
      .eq("id", user.id);

    if (error) {
      toast.error("Could not update profile. Please try again.");
      return;
    }

    toast.success("Your profile has been updated");
    router.refresh();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about yourself"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://example.com"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="twitter_username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Twitter Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="username"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="github_username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="username"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit">Update Profile</Button>
      </form>
    </Form>
  );
}
