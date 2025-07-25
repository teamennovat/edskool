import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { type Database } from "./database.types";

export type SupabaseClient = ReturnType<typeof createClientComponentClient<Database>>;

export async function signInWithEmail(
  supabase: SupabaseClient,
  email: string,
  password: string
) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}

export async function signInWithGoogle(supabase: SupabaseClient) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  return { data, error };
}

export async function signInWithGithub(supabase: SupabaseClient) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  return { data, error };
}

export async function signUp(
  supabase: SupabaseClient,
  email: string,
  password: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  return { data, error };
}

export async function resetPassword(supabase: SupabaseClient, email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/callback`,
  });

  return { error };
}

export async function signOut(supabase: SupabaseClient) {
  const { error } = await supabase.auth.signOut();
  return { error };
}
