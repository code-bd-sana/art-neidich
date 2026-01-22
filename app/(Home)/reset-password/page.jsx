"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { resetPasswordAction } from "@/action/auth.action";
import { Suspense } from "react";
import { Eye, EyeOff } from "lucide-react";

export const dynamic = "force-dynamic";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const emailFromUrl = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // If no token in URL → show error screen immediately
  if (!token) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-md w-full space-y-8'>
          <div className='rounded-md bg-red-50 p-4'>
            <p className='text-sm font-medium text-red-800'>
              Invalid or missing reset token. Please use the link from your
              email.
            </p>
          </div>
          <button
            onClick={() => router.push("/forgot-password")}
            className='w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#2D8D7C] hover:bg-[#07705d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2D8D7C]'>
            Request new reset link
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      await resetPasswordAction(token, password, emailFromUrl);

      setMessage("Password reset successfully! Redirecting to login...");

      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (err) {
      setError(
        err.message ||
          "Failed to reset password. The link may have expired or is invalid.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            Set new password
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            Please enter your new password below (minimum 8 characters).
            {emailFromUrl && (
              <span className='block mt-1 text-xs text-gray-500'>
                For account: {emailFromUrl}
              </span>
            )}
          </p>
        </div>

        <form onSubmit={handleSubmit} className='mt-8 space-y-6'>
          <div className='rounded-md shadow-sm space-y-4'>
            {/* New Password with eye icon */}
            <div className='relative'>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700 mb-1'>
                New Password
              </label>
              <div className='relative'>
                <input
                  id='password'
                  name='password'
                  type={showPassword ? "text" : "password"}
                  autoComplete='new-password'
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#2D8D7C] focus:border-[#2D8D7C] focus:z-10 sm:text-sm pr-10'
                  placeholder='Enter new password (min 6 characters)'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none'>
                  {showPassword ? (
                    // Eye slash (hide password)
                    <EyeOff />
                  ) : (
                    // Eye (show password)
                    <Eye />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password with eye icon */}
            <div className='relative'>
              <label
                htmlFor='confirmPassword'
                className='block text-sm font-medium text-gray-700 mb-1'>
                Confirm New Password
              </label>
              <div className='relative'>
                <input
                  id='confirmPassword'
                  name='confirmPassword'
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete='new-password'
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className='appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#2D8D7C] focus:border-[#2D8D7C] focus:z-10 sm:text-sm pr-10'
                  placeholder='Confirm new password'
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none'>
                  {showConfirmPassword ? (
                    // Eye slash
                    <EyeOff />
                  ) : (
                    // Eye
                    <Eye />
                  )}
                </button>
              </div>
            </div>
          </div>

          {message && (
            <div className='rounded-md bg-green-50 p-4'>
              <p className='text-sm font-medium text-green-800'>{message}</p>
            </div>
          )}

          {error && (
            <div className='rounded-md bg-red-50 p-4'>
              <p className='text-sm font-medium text-red-800'>{error}</p>
            </div>
          )}

          <div>
            <button
              type='submit'
              disabled={loading}
              className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#2D8D7C] hover:bg-[#07705d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2D8D7C] disabled:opacity-50 disabled:cursor-not-allowed'>
              {loading ? "Resetting password..." : "Reset password"}
            </button>
          </div>
        </form>

        <div className='text-center'>
          <button
            onClick={() => router.push("/")}
            className='font-medium text-[#2D8D7C] hover:text-[#07705d]'>
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center bg-gray-50'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D8D7C] mx-auto'></div>
            <p className='mt-4 text-gray-600'>Loading reset password page...</p>
          </div>
        </div>
      }>
      <ResetPasswordContent />
    </Suspense>
  );
}
