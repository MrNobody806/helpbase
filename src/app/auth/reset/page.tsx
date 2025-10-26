"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    // Check if we have a valid recovery token in the URL
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get("access_token");
    const type = hashParams.get("type");

    console.log("URL parameters:", { accessToken: !!accessToken, type });

    if (type !== "recovery" || !accessToken) {
      setError(
        "Invalid or expired reset link. Please request a new password reset."
      );
    } else {
      // Clear the URL hash but keep the token available for the auth flow
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess("");

    // Get the current URL hash parameters
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get("access_token");
    const type = hashParams.get("type");

    if (type !== "recovery" || !accessToken) {
      setError("Invalid reset token");
      setLoading(false);
      return;
    }

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
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      console.log("Attempting password reset with recovery token...");

      // For recovery tokens, we need to use verifyOtp first
      const { data: verifyData, error: verifyError } =
        await supabase.auth.verifyOtp({
          token_hash: accessToken,
          type: "recovery",
        });

      if (verifyError) {
        console.error("OTP verification failed:", verifyError);
        throw new Error(
          "Invalid or expired reset link. Please request a new password reset."
        );
      }

      console.log("OTP verified successfully, updating password...");

      // Now update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        console.error("Update error:", updateError);
        throw new Error(updateError.message || "Failed to update password");
      }

      setSuccess("Password reset successfully! Redirecting to login...");

      // Sign out and redirect to login
      await supabase.auth.signOut();

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      console.error("Password reset error:", err);
      setError(
        err.message ||
          "Failed to reset password. Please request a new reset link."
      );
    } finally {
      setLoading(false);
    }
  };

  if (error && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
          <div className="text-center">
            <div className="flex justify-center">
              <img src="/logo.svg" alt="HelpBase" className="w-16 h-16" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Reset Error
            </h2>
            <p className="mt-2 text-sm text-gray-600">{error}</p>
            <div className="mt-6">
              <a
                href="/login"
                className="w-full bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all py-3 px-6 inline-block"
              >
                Back to Login
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="flex justify-center">
            <img src="/logo.svg" alt="HelpBase" className="w-16 h-16" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            Reset Your Password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your new password below
          </p>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-600 text-sm font-medium">{success}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <input
                type="password"
                required
                className="w-full px-3 py-3 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none peer"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                placeholder=" "
                minLength={6}
              />
              <label
                className={`absolute left-3 transition-all duration-200 pointer-events-none text-gray-400 ${
                  password
                    ? "top-1 text-xs text-indigo-600 font-medium"
                    : "top-3 text-sm"
                } ${loading ? "opacity-50" : ""}`}
              >
                New Password
              </label>
            </div>

            <div className="relative">
              <input
                type="password"
                required
                className="w-full px-3 py-3 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none peer"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                placeholder=" "
                minLength={6}
              />
              <label
                className={`absolute left-3 transition-all duration-200 pointer-events-none text-gray-400 ${
                  confirmPassword
                    ? "top-1 text-xs text-indigo-600 font-medium"
                    : "top-3 text-sm"
                } ${loading ? "opacity-50" : ""}`}
              >
                Confirm New Password
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all py-3 px-4"
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>
          </div>

          <div className="text-center">
            <a
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500 text-sm"
            >
              Back to Sign In
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
