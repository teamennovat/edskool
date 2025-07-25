"use client";

import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileHeaderProps {
  user: User;
  profile: {
    full_name?: string | null;
    avatar_url?: string | null;
  };
}

export function ProfileHeader({ user, profile }: ProfileHeaderProps) {
  const initials = profile.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user.email![0].toUpperCase();

  return (
    <div className="rounded-lg border bg-card text-card-foreground">
      <div className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profile.avatar_url || undefined} />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center sm:text-left space-y-2">
            <h2 className="text-2xl font-bold">
              {profile.full_name || "Welcome!"}
            </h2>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/settings">Edit Profile</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
