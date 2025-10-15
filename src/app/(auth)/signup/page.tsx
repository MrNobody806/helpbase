"use client";
import { useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { getConfig } from "@/lib/config";

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
      const response = await fetch(`${workerUrl}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          company_name: companyName,
          email,
          password,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Signup failed");

      // Auto-login with Supabase
      const { data: signInData, error: signInError } =
        await supabaseClient.auth.signInWithPassword({ email, password });

      if (signInError) throw signInError;

      window.location.href = result.dashboardUrl || result.ssoUrl || "/";
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#F4F2F1] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-4xl flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
        {/* Left Branding */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white text-lg font-semibold">✺</span>
            </div>
            <span className="text-xl font-bold text-gray-900">HelpBase</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 font-switzer mb-3">
            Join thousands of teams delivering exceptional support
          </h1>
          <p className="text-gray-600 text-sm lg:text-base mb-6">
            Streamline your customer support workflow with our powerful platform
          </p>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 max-w-md">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Create your account
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Get started in 2 minutes
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-700 text-xs font-medium">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    className="w-full px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-black transition-all"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-700">
                    Company
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Acme Inc"
                    className="w-full px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-black transition-all"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700">
                  Work Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="john@company.com"
                  className="w-full px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-black transition-all"
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
                  placeholder="Create secure password"
                  className="w-full px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-black transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Uppercase, lowercase, number & special char required
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-2.5 text-sm font-semibold rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-all"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-gray-600">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="font-semibold text-black hover:underline"
                  >
                    Sign in
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
