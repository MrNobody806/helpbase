"use client";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { getConfig } from "@/lib/conifg";

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState(
    "Processing your email confirmation..."
  );

  const { workerUrl } = getConfig();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const hasProcessed = useRef(false);
  const provisioningTriggered = useRef(false);

  useEffect(() => {
    handleAuthCallback();
  }, []);

  const handleAuthCallback = async () => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    try {
      const supabase = createClient(supabaseUrl, supabaseAnon);

      // Parse OTP parameters from URL
      const url = new URL(window.location.href);
      const token_hash = url.searchParams.get("token_hash");
      const type = url.searchParams.get("type");

      console.log("OTP Callback:", { token_hash, type });

      if (!token_hash || !type) {
        throw new Error(
          "Invalid confirmation link. Please click the link from your email again."
        );
      }

      // Verify the OTP token
      const { error, data } = await supabase.auth.verifyOtp({
        type: type as any,
        token_hash,
      });

      if (error) {
        console.error("OTP verification error:", error);
        throw new Error(
          `Verification failed: ${error.message}. Please try the link again.`
        );
      }

      console.log("OTP verified successfully:", data);

      // Get the user after successful verification
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("Failed to retrieve user after verification.");
      }

      console.log("User verified:", user.email);
      console.log("Email confirmed:", !!user.email_confirmed_at);

      // Clear the OTP parameters from URL
      window.history.replaceState({}, "", window.location.pathname);

      // Process the successful confirmation
      await processSuccessfulConfirmation(user.id);
    } catch (error: any) {
      console.error("Callback error:", error);
      setStatus("error");
      setMessage(
        error.message || "Confirmation failed. Please try the link again."
      );
    }
  };

  const processSuccessfulConfirmation = async (userId: string) => {
    if (!provisioningTriggered.current) {
      provisioningTriggered.current = true;

      setMessage("Email confirmed! Setting up your Chatwoot account...");
      const provisioningResult = await triggerChatwootProvisioning(userId);

      if (provisioningResult.success) {
        setStatus("success");
        setMessage("Account setup complete! Redirecting to login...");

        // Sign out the user since they'll login with email/password later
        const supabase = createClient(supabaseUrl, supabaseAnon);
        await supabase.auth.signOut();

        setTimeout(() => {
          window.location.href = "/login?message=email_confirmed";
        }, 2000);
      } else {
        throw new Error(
          provisioningResult.error || "Failed to setup Chatwoot account"
        );
      }
    } else {
      setStatus("success");
      setMessage("Redirecting to login...");
      setTimeout(() => {
        window.location.href = "/login?message=email_confirmed";
      }, 1000);
    }
  };

  const triggerChatwootProvisioning = async (userId: string) => {
    try {
      console.log("Triggering Chatwoot provisioning for user:", userId);

      const response = await fetch(`${workerUrl}/auth/verified`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Chatwoot provisioning failed:", result);
        return {
          success: false,
          error: result.message || "Chatwoot setup failed",
        };
      }

      console.log("Chatwoot provisioning successful:", result);
      return { success: true, data: result };
    } catch (error: any) {
      console.error("Chatwoot provisioning error:", error);
      return {
        success: false,
        error: error.message || "Failed to trigger Chatwoot setup",
      };
    }
  };

  const handleLoginRedirect = () => {
    window.location.href = "/login?message=email_confirmed";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="mb-6">
          {status === "loading" && (
            <div className="w-16 h-16 mx-auto mb-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
            </div>
          )}
          {status === "success" && (
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}
          {status === "error" && (
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
          )}
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {status === "loading" && "Processing..."}
          {status === "success" && "Success!"}
          {status === "error" && "Something went wrong"}
        </h1>

        <p className="text-gray-600 text-sm leading-relaxed mb-6">{message}</p>

        {status === "success" && (
          <button
            onClick={handleLoginRedirect}
            className="w-full bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 transition-all py-3 px-6"
          >
            Go to Login
          </button>
        )}

        {status === "error" && (
          <div className="space-y-3">
            <button
              onClick={handleLoginRedirect}
              className="w-full bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 transition-all py-3 px-6"
            >
              Try Logging In
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full border border-gray-300 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-all py-3 px-6"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
