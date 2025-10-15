// src/app/auth/login/page.tsx
"use client";
import { useState } from "react";
import axios from "axios";
import { supabaseClient } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // In your login page - update the handleSubmit function
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    try {
      // Step 1: Sign in to our app
      const { data: signInData, error: signInError } =
        await supabaseClient.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) throw signInError;

      const token = signInData.session?.access_token;
      if (!token) throw new Error("No session token");

      // Step 2: Get SSO URL from our API
      const loginResponse = await axios.post("/api/auth/login", {
        access_token: token,
      });

      if (loginResponse.data?.error) {
        throw new Error(loginResponse.data.error);
      }

      // Step 3: Redirect to Chatwoot via SSO (auto-login)
      if (loginResponse.data.ssoUrl) {
        window.location.href = loginResponse.data.ssoUrl;
      } else {
        window.location.href = loginResponse.data.dashboardUrl;
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(
        err.message || "Failed to sign in. Please check your credentials."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-2xl">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in to Helpbase
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Welcome back! Access your customer support dashboard.
          </p>
        </div>
        <form className="mt-8 space-y-6 text-black" onSubmit={handleSubmit}>
          {error && (
            <div
              className="p-3 text-sm font-medium text-red-700 bg-red-100 border border-red-200 rounded-md"
              role="alert"
            >
              {error}
            </div>
          )}

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            {/* You might add a "Forgot Password" link here */}
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white transition-colors duration-200 ${
              busy
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            }`}
            disabled={busy}
          >
            {busy ? "Signing In..." : "Sign in"}
          </button>

          <div className="text-center">
            <a
              href="/auth/signup"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Don't have an account? Sign up.
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
