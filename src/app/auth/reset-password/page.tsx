"use client";
import { useState, useEffect } from "react";
import { getConfig } from "@/lib/conifg";
import { useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string>("");
  const [token, setToken] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const { workerUrl } = getConfig();

  useEffect(() => {
    // Get token from URL query parameters
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError("Invalid or missing reset token");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess("");

    if (!token) {
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
      const res = await fetch(`${workerUrl}/auth/password/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to reset password");

      setSuccess("Password reset successfully! Redirecting to login...");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (!token && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center">
              <img src="/logo.svg" alt="HelpBase" className="w-16 h-16" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Loading...
            </h2>
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
