"use client";
import { useState, useEffect } from "react";
import { getConfig } from "@/lib/conifg";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string>("");
  const router = useRouter();

  const { workerUrl } = getConfig();

  useEffect(() => {
    checkExistingSession();

    const params = new URLSearchParams(window.location.search);
    if (params.get("message") === "email_confirmed") {
      setSuccess("Email confirmed successfully! You can now log in.");
    }
  }, []);

  const checkExistingSession = async () => {
    const tokenData = getStoredToken();
    if (!tokenData || isTokenExpired(tokenData.expires_at)) return;

    try {
      console.log("Found valid session, attempting auto-login...");
      const res = await fetch(`${workerUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: tokenData.access_token }),
      });

      const result = await res.json();
      if (res.ok && result.ssoUrl) {
        console.log("Auto-login successful, redirecting...");
        window.location.href = result.ssoUrl;
      } else {
        console.warn("Auto-login failed, clearing session...");
        clearStoredTokens();
      }
    } catch (err) {
      console.error("Session check error:", err);
      clearStoredTokens();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess("");

    try {
      const res = await fetch(`${workerUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Login failed");

      storeTokens(result);
      if (result.ssoUrl) {
        window.location.href = result.ssoUrl;
      } else {
        window.location.href = "/login";
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Helpers
  const storeTokens = (result: any) => {
    const tokenData = {
      access_token: result.access_token,
      refresh_token: result.refresh_token,
      expires_at: result.expires_at,
      user_id: result.user_id,
    };
    localStorage.setItem("auth_tokens", JSON.stringify(tokenData));
  };

  const getStoredToken = () => {
    const stored = localStorage.getItem("auth_tokens");
    return stored ? JSON.parse(stored) : null;
  };

  const clearStoredTokens = () => {
    localStorage.removeItem("auth_tokens");
  };

  const isTokenExpired = (expiresAt: string) =>
    new Date() >= new Date(expiresAt);

  const handlePasswordReset = async () => {
    router.push("/auth/forgot-password");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 px-4 font-sans">
      <div className="flex flex-col lg:flex-row w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Left Section */}
        <div className="relative bg-[url('/image.png')] bg-cover w-full lg:w-1/3 text-white p-6 flex flex-col justify-between">
          <div className="relative z-10 flex flex-col h-full">
            <div className="mb-auto -mt-12 -ml-2">
              <img src="/logo.svg" alt="HelpBase" className="w-32 h-32" />
            </div>
            <div className="mt-auto pt-4">
              <blockquote className="text-lg italic text-gray-200 mb-2 leading-relaxed">
                "Simply all the tools that my team and I need."
              </blockquote>
              <div>
                <p className="font-semibold text-sm">Karen Yue</p>
                <p className="text-gray-300 text-xs">
                  Director of Digital Marketing Technology
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Right Section */}
        <div className="w-full lg:w-2/3 p-6 flex flex-col justify-center">
          <div className="w-full max-w-sm mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Welcome back
              </h2>
              <p className="text-gray-500 text-xs">
                Sign in to your HelpBase account
              </p>
            </div>

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-green-600 text-xs font-medium">{success}</p>
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-600 text-xs font-medium">{error}</p>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="relative">
                <input
                  type="email"
                  required
                  className="w-full px-2 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none peer"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  placeholder=" " // Needed for the floating label
                />
                <label
                  className={`absolute left-2 transition-all duration-200 pointer-events-none text-gray-400 ${
                    email
                      ? "top-0 text-[10px] text-indigo-600 font-medium"
                      : "top-3 text-xs"
                  } ${loading ? "opacity-50" : ""}`}
                >
                  Work email
                </label>
              </div>

              <div className="relative">
                <input
                  type="password"
                  required
                  className="w-full px-2 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none peer"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  placeholder=" " // Needed for the floating label
                />
                <label
                  className={`absolute left-2 transition-all duration-200 pointer-events-none text-gray-400 ${
                    password
                      ? "top-0 text-[10px] text-indigo-600 font-medium"
                      : "top-3 text-xs"
                  } ${loading ? "opacity-50" : ""}`}
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={handlePasswordReset}
                  disabled={loading || !email}
                  className="mt-2 font-semibold text-indigo-600 hover:text-indigo-700 transition-colors text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Forgot your password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white text-sm font-medium rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all py-2.5"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

              <div className="flex items-center justify-center gap-2 my-3">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-xs text-gray-400 font-medium">Or</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              <button
                type="button"
                disabled={loading}
                className="w-full border border-gray-200 rounded-full text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all py-2.5"
              >
                <img
                  src="/icons8-google.svg"
                  alt="Google"
                  className="w-6 h-6"
                />{" "}
                Sign in with Google
              </button>

              <div className="text-center space-y-2 pt-3">
                <p className="text-xs text-gray-500">
                  Don't have an account?{" "}
                  <a
                    href="/signup"
                    className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors text-xs"
                  >
                    Sign up
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
