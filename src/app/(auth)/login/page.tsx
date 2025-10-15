"use client";
import { useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { getConfig } from "@/lib/conifg";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { workerUrl } = getConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: signInData, error: signInError } =
        await supabaseClient.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) throw signInError;

      const token = signInData.session?.access_token;
      if (!token) throw new Error("No session token");

      const response = await fetch(`${workerUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token: token,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }

      if (result.ssoUrl) {
        window.location.href = result.ssoUrl;
      } else {
        window.location.href = result.dashboardUrl;
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#F4F2F1] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-4xl flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
        {/* Left Side - Logo & Branding */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white text-lg font-semibold">✺</span>
            </div>
            <span className="text-xl font-bold text-gray-900">HelpBase</span>
          </div>

          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 font-switzer mb-3">
            Welcome back to exceptional support
          </h1>

          <p className="text-gray-600 text-sm lg:text-base mb-6">
            Continue delivering amazing customer experiences with your team
          </p>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-gray-600">
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span className="text-sm font-medium">
                4.9/5 from 300K+ users
              </span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 max-w-md">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Sign in to your account
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Welcome back! Please enter your details
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-700 text-xs font-medium">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700">
                  Work Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-black transition-all"
                  placeholder="john@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  required
                  className="w-full px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-black transition-all"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-2.5 text-sm font-semibold rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-all"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-gray-600">
                  Don't have an account?{" "}
                  <a
                    href="/signup"
                    className="font-semibold text-black hover:underline"
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
