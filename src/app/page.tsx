"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if we have hash parameters (from Supabase redirect)
    const hash = window.location.hash;

    if (hash && hash.includes("access_token")) {
      // Redirect to callback page with the hash
      router.push(`/auth/callback${hash}`);
    } else {
      // Normal home page behavior - redirect to login
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="text-gray-500 text-sm mt-2">Redirecting...</p>
      </div>
    </div>
  );
}
