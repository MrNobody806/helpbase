// lib/auth.ts
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getSession() {
  const supabase = createServerComponentClient({ cookies });
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    redirect("/auth/login");
  }
  return session;
}

export async function redirectIfAuthenticated() {
  const session = await getSession();
  if (session) {
    redirect("/app/accounts/1/dashboard"); // Adjust based on user's account
  }
}
