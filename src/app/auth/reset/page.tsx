"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isValidSession, setIsValidSession] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  useEffect(() => {
    // Check if we have OTP parameters from email link
    const hasOTPParams = token_hash && type === "recovery";

    if (hasOTPParams) {
      verifyOTPToken();
    } else {
      checkExistingSession();
    }
  }, [token_hash, type]);

  const verifyOTPToken = async () => {
    try {
      console.log("Verifying OTP token:", { token_hash, type });
      setVerifying(true);
      setError("");

      const supabase = createClient(supabaseUrl, supabaseAnon);

      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token_hash!,
        type: "recovery" as any,
      });

      if (error) {
        console.error("OTP verification failed:", error);
        throw new Error(error.message);
      }

      console.log("OTP verified successfully:", data);

      // Clear the OTP parameters from URL
      window.history.replaceState({}, "", "/auth/reset");

      setIsValidSession(true);
      setVerifying(false);
    } catch (err: any) {
      console.error("OTP verification error:", err);
      setError(
        err.message ||
          "Invalid or expired reset link. Please request a new password reset."
      );
      setVerifying(false);
    }
  };

  const checkExistingSession = async () => {
    try {
      console.log("Checking for existing session...");
      const supabase = createClient(supabaseUrl, supabaseAnon);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        console.log("Found existing session");
        setIsValidSession(true);
      } else {
        console.log("No session found");
        setError("Please use the password reset link from your email.");
      }
      setVerifying(false);
    } catch (err: any) {
      console.error("Session check error:", err);
      setError("Failed to verify session. Please try the reset link again.");
      setVerifying(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    // Validate passwords
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient(supabaseUrl, supabaseAnon);

      console.log("Updating password...");
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        throw error;
      }

      setMessage("Password updated successfully! Redirecting to login...");

      // Sign out and redirect to login
      await supabase.auth.signOut();
      setTimeout(() => {
        router.push("/login?message=password_reset");
      }, 2000);
    } catch (err: any) {
      console.error("Password reset error:", err);
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while verifying
  if (verifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Verifying Reset Link
          </h1>
          <p className="text-gray-600 text-sm">
            Please wait while we verify your reset link...
          </p>
        </div>
      </div>
    );
  }

  // Show error state if not valid
  if (!isValidSession && error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Reset Link Required
          </h1>
          <p className="text-gray-600 text-sm mb-6">{error}</p>
          <button
            onClick={() => router.push("/forgot-password")}
            className="w-full bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 transition-all py-3 px-6"
          >
            Request Reset Link
          </button>
        </div>
      </div>
    );
  }

  // Show password reset form
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Set New Password
          </h1>
          <p className="text-gray-600 text-sm">Enter your new password below</p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="Confirm new password"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {message && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm">{message}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all py-3 px-6"
          >
            {loading ? "Updating Password..." : "Reset Password"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/login")}
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
