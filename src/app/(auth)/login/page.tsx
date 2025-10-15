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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Sign in to Helpbase
          </h2>
          <p className="mt-2 text-gray-600">
            Welcome back! Access your customer support dashboard.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <div>
            <label className="sr-only">Email address</label>
            <input
              type="email"
              required
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="sr-only">Password</label>
            <input
              type="password"
              required
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign in"}
          </button>

          <p className="text-center">
            <a
              href="/auth/signup"
              className="text-blue-600 hover:text-blue-500"
            >
              Don't have an account? Sign up.
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
