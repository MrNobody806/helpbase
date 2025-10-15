"use client";
import { useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { getConfig } from "@/lib/conifg";

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{}|\\",./`<>:;?~]).{6,}$/;

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { workerUrl } = getConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!PASSWORD_REGEX.test(password)) {
      setError(
        "Password must be 6+ chars with uppercase, lowercase, number, and special character"
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${workerUrl}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          company_name: companyName,
          email,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }

      const { data: signInData, error: signInError } =
        await supabaseClient.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) throw signInError;

      if (result.ssoUrl) {
        window.location.href = result.ssoUrl;
      } else {
        window.location.href = result.dashboardUrl;
      }
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F2F1] flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Background gradients matching landing page */}
      <img
        src="/assets/images/hero/color-gradient.svg"
        alt="Background"
        className="absolute top-0 right-0 max-w-[400px] md:max-w-[500px] h-full object-cover z-0 opacity-80 pointer-events-none"
        loading="eager"
      />
      <img
        src="/assets/images/hero/color-gradient.svg"
        alt="Background"
        className="absolute top-0 left-0 max-w-[400px] md:max-w-[500px] h-full object-cover z-0 opacity-80 pointer-events-none transform scale-x-[-1]"
        loading="eager"
      />

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">✺</span>
            <span className="text-xl font-bold text-gray-900">HelpBase</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-switzer">
            Join Helpbase
          </h2>
          <p className="mt-3 text-gray-600 text-lg">
            Start delivering exceptional customer support
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 backdrop-blur-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-800 text-sm font-medium">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Full Name
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 bg-white"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Company Name
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 bg-white"
                placeholder="Enter your company name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Work Email
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 bg-white"
                placeholder="Enter your work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Password
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 bg-white"
                placeholder="Create a secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="mt-2 text-xs text-gray-500">
                Must include uppercase, lowercase, number, and special character
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-black font-semibold hover:text-gray-700 transition-colors duration-200"
                >
                  Login
                </a>
              </p>
            </div>
          </form>
        </div>

        {/* Additional branding element */}
        <div className="text-center mt-8">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <span className="flex text-yellow-500 text-lg">★★★★☆</span>
            <span className="text-sm">4.9 rating based on 300k users</span>
          </div>
        </div>
      </div>
    </div>
  );
}
