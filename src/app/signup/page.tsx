"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getConfig } from "@/lib/conifg";

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{}|\\",./`<>:;?~]).{6,}$/;

// Validation functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (
  password: string
): { isValid: boolean; message?: string } => {
  if (password.length < 6) {
    return {
      isValid: false,
      message: "Password must be at least 6 characters",
    };
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one lowercase letter",
    };
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one uppercase letter",
    };
  }
  if (!/(?=.*\d)/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one number",
    };
  }
  if (!/(?=.*[!@#$%^&*()_+\-=[\]{}|\\",./`<>:;?~])/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one special character",
    };
  }
  return { isValid: true };
};

interface FormData {
  fullName: string;
  companyName: string;
  email: string;
  password: string;
}

export default function SignupPage() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    companyName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<FormData>>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof FormData, boolean>>
  >({});

  const { workerUrl } = getConfig();
  const [supabaseClient, setSupabaseClient] = useState<SupabaseClient | null>(
    null
  );

  useEffect(() => {
    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    setSupabaseClient(client);
  }, []);

  // Handle input changes with validation
  const handleInputChange = useCallback(
    (field: keyof FormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setError(null);

      // Validate on change only after field has been touched
      if (touched[field]) {
        validateField(field, value);
      }
    },
    [touched]
  );

  const handleBlur = useCallback(
    (field: keyof FormData) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      validateField(field, formData[field]);
    },
    [formData]
  );

  const validateField = useCallback((field: keyof FormData, value: string) => {
    let error = "";

    switch (field) {
      case "email":
        if (value && !validateEmail(value)) {
          error = "Please enter a valid email address";
        }
        break;
      case "password":
        if (value) {
          const validation = validatePassword(value);
          if (!validation.isValid) {
            error = validation.message!;
          }
        }
        break;
      case "fullName":
        if (value && value.trim().length < 2) {
          error = "Full name must be at least 2 characters";
        }
        break;
      case "companyName":
        if (value && value.trim().length < 2) {
          error = "Company name must be at least 2 characters";
        }
        break;
    }

    setFieldErrors((prev) => ({
      ...prev,
      [field]: error || undefined,
    }));
  }, []);

  const validateForm = useCallback((): boolean => {
    const newTouched = {
      fullName: true,
      companyName: true,
      email: true,
      password: true,
    };
    setTouched(newTouched);

    // Validate all fields
    Object.keys(formData).forEach((field) => {
      validateField(field as keyof FormData, formData[field as keyof FormData]);
    });

    // Check if any errors exist
    const hasErrors =
      Object.values(fieldErrors).some((error) => error) ||
      !formData.fullName ||
      !formData.companyName ||
      !formData.email ||
      !formData.password;

    return !hasErrors;
  }, [formData, fieldErrors, validateField]);

  // --- Signup ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!validateForm()) {
      setLoading(false);
      setError("Please fix the errors above");
      return;
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.message!);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${workerUrl}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.fullName.trim(),
          company_name: formData.companyName.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || `Signup failed: ${res.status}`);
      }

      setSuccess(true);
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- Google OAuth ---
  const handleGoogleSignIn = async () => {
    if (!supabaseClient) {
      setError("Authentication service not ready. Please refresh the page.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) throw error;
    } catch (err: any) {
      console.error("Google OAuth error:", err);
      setError(err.message || "Google sign up failed. Please try again.");
      setLoading(false);
    }
  };

  // --- Resend verification ---
  const handleResendVerification = async () => {
    if (!formData.email) {
      setError("Email is required to resend verification");
      return;
    }

    // Check if still in cooldown period
    if (resendCooldown > 0) {
      setError(`Please wait ${resendCooldown} seconds before trying again`);
      return;
    }

    setResendLoading(true);
    setError(null);

    try {
      const res = await fetch(`${workerUrl}/auth/verify/resend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          redirectTo: `${window.location.origin}/login`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || `Resend failed: ${res.status}`);
      }

      // Start cooldown timer (60 seconds)
      setResendCooldown(60);

      // Update cooldown every second
      const cooldownInterval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(cooldownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      alert("Verification email resent. Please check your inbox.");
    } catch (err: any) {
      console.error("Resend verification error:", err);
      setError(err?.message || "Failed to resend verification email");
    } finally {
      setResendLoading(false);
    }
  };

  // Reset form when going back from success
  const handleBackToSignup = () => {
    setSuccess(false);
    setError(null);
  };

  // Check if form is valid for submission
  const isFormValid =
    formData.fullName &&
    formData.companyName &&
    validateEmail(formData.email) &&
    validatePassword(formData.password).isValid;

  // --- Success Screen ---
  if (success) {
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
            <div className="w-full max-w-sm mx-auto text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Check your email
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                We've sent a verification link to{" "}
                <strong>{formData.email}</strong>
              </p>
              <p className="text-gray-500 text-xs mb-6">
                Click the link in the email to verify your account and complete
                your setup.
              </p>
              <div className="space-y-3">
                <button
                  onClick={handleBackToSignup}
                  className="w-full bg-indigo-600 text-white text-sm font-medium rounded-full hover:bg-indigo-700 transition-all py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Back to sign up
                </button>
                <button
                  onClick={() => (window.location.href = "/login")}
                  className="w-full border border-gray-200 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-50 transition-all py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Go to login
                </button>
              </div>
              <div className="text-center pt-4">
                <p className="text-xs text-gray-500">
                  Didn't receive the email?{" "}
                  <button
                    onClick={handleResendVerification}
                    disabled={resendLoading || resendCooldown > 0}
                    className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors text-xs focus:outline-none focus:underline"
                  >
                    {resendLoading
                      ? "Sending..."
                      : resendCooldown > 0
                      ? `Resend available in ${resendCooldown}s`
                      : "Resend Verification"}
                  </button>
                </p>
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                  <p className="text-red-600 text-xs font-medium">{error}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Signup Form ---
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
                Create your account
              </h2>
              <p className="text-gray-500 text-xs">
                Join HelpBase and start collaborating effortlessly.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-xs font-medium">{error}</p>
                </div>
              )}

              {/* Full name & company inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="relative">
                  <input
                    type="text"
                    required
                    className={`w-full px-2 py-2 text-sm bg-white border rounded-lg focus:ring-1 focus:border-indigo-500 transition-all outline-none peer ${
                      fieldErrors.fullName
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-200 focus:ring-indigo-500"
                    } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    value={formData.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    onBlur={() => handleBlur("fullName")}
                    disabled={loading}
                  />
                  <label
                    className={`absolute left-2 transition-all duration-200 pointer-events-none ${
                      formData.fullName
                        ? "top-0 text-[10px] font-medium"
                        : "top-3 text-xs"
                    } ${
                      fieldErrors.fullName ? "text-red-600" : "text-indigo-600"
                    } ${loading ? "opacity-50" : ""}`}
                  >
                    Full name
                  </label>
                  {fieldErrors.fullName && (
                    <p className="text-red-500 text-xs mt-1">
                      {fieldErrors.fullName}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    required
                    className={`w-full px-2 py-2 text-sm bg-white border rounded-lg focus:ring-1 focus:border-indigo-500 transition-all outline-none peer ${
                      fieldErrors.companyName
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-200 focus:ring-indigo-500"
                    } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    value={formData.companyName}
                    onChange={(e) =>
                      handleInputChange("companyName", e.target.value)
                    }
                    onBlur={() => handleBlur("companyName")}
                    disabled={loading}
                  />
                  <label
                    className={`absolute left-2 transition-all duration-200 pointer-events-none ${
                      formData.companyName
                        ? "top-0 text-[10px] font-medium"
                        : "top-3 text-xs"
                    } ${
                      fieldErrors.companyName
                        ? "text-red-600"
                        : "text-indigo-600"
                    } ${loading ? "opacity-50" : ""}`}
                  >
                    Company
                  </label>
                  {fieldErrors.companyName && (
                    <p className="text-red-500 text-xs mt-1">
                      {fieldErrors.companyName}
                    </p>
                  )}
                </div>
              </div>

              {/* Email input */}
              <div className="relative">
                <input
                  type="email"
                  required
                  className={`w-full px-2 py-2 text-sm bg-white border rounded-lg focus:ring-1 focus:border-indigo-500 transition-all outline-none peer ${
                    fieldErrors.email
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-200 focus:ring-indigo-500"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  disabled={loading}
                />
                <label
                  className={`absolute left-2 transition-all duration-200 pointer-events-none ${
                    formData.email
                      ? "top-0 text-[10px] font-medium"
                      : "top-3 text-xs"
                  } ${fieldErrors.email ? "text-red-600" : "text-indigo-600"} ${
                    loading ? "opacity-50" : ""
                  }`}
                >
                  Work email
                </label>
                {fieldErrors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Password input */}
              <div className="relative">
                <input
                  type="password"
                  required
                  className={`w-full px-2 py-2 text-sm bg-white border rounded-lg focus:ring-1 focus:border-indigo-500 transition-all outline-none peer ${
                    fieldErrors.password
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-200 focus:ring-indigo-500"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  onBlur={() => handleBlur("password")}
                  disabled={loading}
                />
                <label
                  className={`absolute left-2 transition-all duration-200 pointer-events-none ${
                    formData.password
                      ? "top-0 text-[10px] font-medium"
                      : "top-3 text-xs"
                  } ${
                    fieldErrors.password ? "text-red-600" : "text-indigo-600"
                  } ${loading ? "opacity-50" : ""}`}
                >
                  Password
                </label>
                {fieldErrors.password ? (
                  <p className="text-red-500 text-xs mt-1">
                    {fieldErrors.password}
                  </p>
                ) : (
                  <p className="text-gray-400 text-xs mt-2">
                    Uppercase, lowercase, number & special character required
                    (6+ characters)
                  </p>
                )}
              </div>

              {/* Signup & OAuth buttons */}
              <button
                type="submit"
                disabled={loading || !isFormValid}
                className="w-full bg-indigo-600 text-white text-sm font-medium rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>

              <div className="flex items-center justify-center gap-2 my-3">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-xs text-gray-400 font-medium">Or</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full border border-gray-200 rounded-full text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                <img
                  src="/icons8-google.svg"
                  alt="Google"
                  className="w-3 h-3"
                />
                Sign up with Google
              </button>

              <div className="text-center pt-3">
                <p className="text-xs text-gray-500">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors text-xs focus:outline-none focus:underline"
                  >
                    Log in
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
