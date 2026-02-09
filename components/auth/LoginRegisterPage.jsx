"use client";

import { loginAction, registerAction } from "@/action/auth.action";
import { getOrCreateDeviceId } from "@/utils/deviceId";
import { getWebPushToken } from "@/utils/pushToken";
import { Eye, EyeClosed, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LoginRegisterPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: 1, // Default role for admin registration
  });

  // Handle login form changes
  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle register form changes
  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]:
        e.target.name === "role" ? parseInt(e.target.value) : e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const deviceId = getOrCreateDeviceId();
      let token = "";

      // 1. FIRST check notification permission
      let permission = Notification.permission;

      // If permission is "default" (not asked yet), ask for it
      if (permission === "default") {
        permission = await Notification.requestPermission();
      }

      // If permission is "denied", show error and STOP login
      if (permission === "denied") {
        throw new Error(
          "Notifications are blocked. Please enable notifications in your browser settings to login.",
        );
      }

      // If permission is not "granted", ask again
      if (permission !== "granted") {
        // Request permission explicitly
        permission = await Notification.requestPermission();

        // If still not granted, show error
        if (permission !== "granted") {
          throw new Error(
            "Notifications must be allowed to login. Please enable notifications.",
          );
        }
      }

      // 2. Now we have permission, get FCM token
      try {
        // Register service worker
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        console.log("Service worker registered");

        // Wait for service worker to be ready
        await navigator.serviceWorker.ready;

        // Get Firebase token
        const { getToken } = await import("firebase/messaging");
        const { messaging } = await import("@/lib/firebase");

        const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

        token = await getToken(messaging, {
          vapidKey,
          serviceWorkerRegistration: registration,
        });

        console.log("Real FCM token:", token.substring(0, 30) + "...");
      } catch (error) {
        console.warn("FCM failed:", error.message);
        // Don't allow login if FCM fails
        throw new Error(
          "Failed to setup notifications. Please refresh and try again.",
        );
      }

      // 3. Send login data with REAL FCM token
      const loginPayload = {
        ...loginData,
        deviceId,
        token, // This will be real FCM token
        platform: "web",
        deviceName: navigator.userAgent,
      };

      console.log("Login with REAL FCM token");

      const result = await loginAction(loginPayload);

      if (result.success) {
        setMessage({
          text: "Login successful! Notifications are enabled.",
          type: "success",
        });

        // Store user data
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(result.user || {}));
        }

        // Redirect
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1000);
      } else {
        setMessage({ text: result.message || "Login failed", type: "error" });
      }
    } catch (error) {
      setMessage({
        text: error.message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  // Handle registration submission
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    // Validate password length
    if (registerData.password.length < 6) {
      setMessage({
        text: "Password must be at least 6 characters",
        type: "error",
      });
      setLoading(false);
      return;
    }

    try {
      // Call server action directly
      const result = await registerAction(registerData);

      console.log("Register result:", result);

      if (result.success || result.data?.success) {
        setMessage({
          text:
            result.message ||
            result.data?.message ||
            "Registration successful! You can now login.",
          type: "success",
        });

        // Switch to login tab after successful registration
        setTimeout(() => {
          setActiveTab("login");
          setRegisterData({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            role: 1,
          });
        }, 2000);
      } else {
        const errorMessage =
          result.message || result.data?.message || "Registration failed";
        setMessage({ text: errorMessage, type: "error" });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage({
        text: error.message || "Network error. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center p-4'>
      <div className='max-w-md w-full'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>
            Admin Portal
          </h1>
          <p className='text-gray-600'>Secure access to your dashboard</p>
        </div>

        {/* Card Container */}
        <div className='bg-white rounded-2xl shadow-xl overflow-hidden'>
          {/* Tab Headers */}
          <div className='flex border-b'>
            <button
              className={`flex-1 py-4 text-center font-medium transition-colors ${
                activeTab === "login"
                  ? "text-[#2D8D7C] border-b-2 border-[#2D8D7C] bg-blue-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("login")}>
              Login
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium transition-colors ${
                activeTab === "register"
                  ? "text-[#2D8D7C] border-b-2 border-[#2D8D7C] bg-blue-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("register")}>
              Register Admin
            </button>
          </div>

          {/* Message Display */}
          {message.text && (
            <div
              className={`p-4 ${
                message.type === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}>
              {message.text}
            </div>
          )}

          {/* Tab Content */}
          <div className='p-8'>
            {/* Login Form */}
            {activeTab === "login" && (
              <form onSubmit={handleLogin} className='space-y-6'>
                <div>
                  <label
                    htmlFor='email'
                    className='block text-sm font-medium text-gray-700 mb-2'>
                    Email Address
                  </label>
                  <input
                    type='email'
                    id='email'
                    name='email'
                    value={loginData.email}
                    onChange={handleLoginChange}
                    required
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg transition-colors'
                    placeholder='admin@example.com'
                  />
                </div>

                <div className='relative'>
                  <label
                    htmlFor='password'
                    className='block text-sm font-medium text-gray-700 mb-2'>
                    <div className='flex justify-between'>
                      <p>Password</p>
                      <Link href={"/forgot-password"}>
                        <p className='text-[#2D8D7C] underline'>
                          Forgot password?
                        </p>
                      </Link>
                    </div>
                  </label>
                  <div className='relative'>
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      id='password'
                      name='password'
                      value={loginData.password}
                      onChange={handleLoginChange}
                      required
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg transition-colors pr-12'
                      placeholder='Type your Password'
                    />
                    <button
                      type='button'
                      className='absolute inset-y-0 right-0 pr-3 flex items-center pt-0'
                      onClick={() => setShowLoginPassword(!showLoginPassword)}>
                      {showLoginPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>

                <button
                  type='submit'
                  disabled={loading}
                  className='w-full bg-[#2D8D7C] text-white py-3 px-4 rounded-lg hover:bg-[#09705d] focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
                  {loading ? (
                    <span className='flex items-center justify-center'>
                      Signing in...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>
            )}

            {/* Register Form */}
            {activeTab === "register" && (
              <form onSubmit={handleRegister} className='space-y-6'>
                <div>
                  <label
                    htmlFor='firstName'
                    className='block text-sm font-medium text-gray-700 mb-2'>
                    First Name
                  </label>
                  <input
                    type='text'
                    id='firstName'
                    name='firstName'
                    value={registerData.firstName}
                    onChange={handleRegisterChange}
                    required
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg  transition-colors'
                    placeholder='Your First Name'
                  />
                </div>

                <div>
                  <label
                    htmlFor='lastName'
                    className='block text-sm font-medium text-gray-700 mb-2'>
                    Last Name
                  </label>
                  <input
                    type='text'
                    id='lastName'
                    name='lastName'
                    value={registerData.lastName}
                    onChange={handleRegisterChange}
                    required
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg transition-colors'
                    placeholder='Your Last Name'
                  />
                </div>

                <div>
                  <label
                    htmlFor='email'
                    className='block text-sm font-medium text-gray-700 mb-2'>
                    Email Address
                  </label>
                  <input
                    type='email'
                    id='email'
                    name='email'
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    required
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg transition-colors'
                    placeholder='your.email@example.com'
                  />
                </div>

                <div>
                  <label
                    htmlFor='password'
                    className='block text-sm font-medium text-gray-700 mb-2'>
                    Password
                  </label>
                  <div className='relative'>
                    <input
                      type={showRegisterPassword ? "text" : "password"}
                      id='password'
                      name='password'
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      required
                      minLength='6'
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg transition-colors pr-12'
                      placeholder='Type your Password'
                    />
                    <button
                      type='button'
                      className='absolute inset-y-0 right-0 pr-3 flex items-center'
                      onClick={() =>
                        setShowRegisterPassword(!showRegisterPassword)
                      }>
                      {showRegisterPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                  <p className='mt-1 text-sm text-gray-500'>
                    Minimum 6 characters
                  </p>
                </div>

                {/* Hidden role field - always 1 for admin */}
                <input type='hidden' name='role' value='1' />

                <div className='flex items-center'>
                  <input
                    type='checkbox'
                    id='terms'
                    required
                    className='h-4 w-4 text-[#2D8D7C]  border-gray-300 rounded'
                  />
                  <label
                    htmlFor='terms'
                    className='ml-2 block text-sm text-gray-700'>
                    I agree to the{" "}
                    <a
                      href='/terms'
                      className='text-[#2D8D7C] hover:text-[#0e705e]'>
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href='/privacy'
                      className='text-[#2D8D7C] hover:text-[#0e705e]'>
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <button
                  type='submit'
                  disabled={loading}
                  className='w-full bg-[#2D8D7C] text-white py-3 px-4 rounded-lg hover:bg-[#066856] transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
                  {loading ? (
                    <span className='flex items-center justify-center'>
                      Creating Account...
                    </span>
                  ) : (
                    "Create Admin Account"
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Footer */}
          <div className='bg-gray-50 px-8 py-4 border-t border-gray-200'>
            <p className='text-center text-sm text-gray-600'>
              {activeTab === "login"
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                onClick={() =>
                  setActiveTab(activeTab === "login" ? "register" : "login")
                }
                className='text-[#2D8D7C] hover:text-[#176e5e] font-medium'>
                {activeTab === "login" ? "Register here" : "Login here"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
