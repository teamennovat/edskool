import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ProfileHeader } from "@/components/profile/profile-header";
import { UserReviews } from "@/components/profile/user-reviews";

export default async function ProfilePage() {
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
      <div className="space-y-8">
        <ProfileHeader
          user={session.user}
          profile={profile || { id: session.user.id }}
        />

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Your Reviews
          </h2>
          <UserReviews userId={session.user.id} />
        </div>
      </div>
    </div>
  );
}
