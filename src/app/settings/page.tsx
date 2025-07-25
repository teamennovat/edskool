import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UpdateProfileForm } from "@/components/profile/update-profile-form";

export default async function SettingsPage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/signin");
  }

  // Get user's profile data
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and profile information.
          </p>
        </div>

        <div className="rounded-lg border divide-y">
          <UpdateProfileForm
            user={session.user}
            profile={
              profile || {
                id: session.user.id,
                email: session.user.email!,
              }
            }
          />
        </div>
      </div>
    </div>
  );
}
