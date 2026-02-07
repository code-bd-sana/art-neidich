"use server";

import { apiFetch } from "@/lib/fetcher";
import { getOrCreateDeviceId } from "@/utils/deviceId";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

/* ======================
   Register
   POST /auth/register
   Public Api
====================== */
export async function registerAction(formData) {
  try {
    console.log("Register action called with data:", formData);

    return await apiFetch("/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: 1, // Fixed: Always 1 for admin
      }),
    });
  } catch (error) {
    console.error("Register action error:", error);
    throw error;
  }
}

/* ======================
   Login
   POST /auth/login
   Public Api
====================== */
export async function loginAction(formData) {
  try {
    console.log("Login action called with data:", formData);

    const response = await apiFetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
        deviceId: formData.deviceId,
        token: formData.token,
        platform: formData.platform,
        deviceName: formData.deviceName,
      }),
    });

    const token = response?.token || response?.data?.token;

    if (!token) {
      throw new Error("JWT token not returned from API");
    }

    const cookieStore = await cookies();

    cookieStore.set("token", String(token), {
      httpOnly: true,
      secure: false,
      // secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Login action error:", error);
    throw error;
  }
}

/* ======================
   Logout - Server Action
   POST /auth/logout
====================== */
export async function logoutAction(formData) {
  try {
    console.log("Logout action called with data:", formData);

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      console.warn("No token found in cookies during logout");
      // Continue anyway – backend may still process if deviceId is valid
    }

    const deviceId = formData.deviceId;

    if (!deviceId) {
      throw new Error("deviceId is required for logout");
    }

    // Call backend logout endpoint
    const response = await apiFetch("/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}), // only add if token exists
      },
      body: JSON.stringify({ deviceId }),
    });

    console.log("Backend logout response:", response);

    // Delete the cookie
    cookieStore.delete("token");

    // Force redirect
    redirect("/");
  } catch (error) {
    console.error("Logout action error:", error);
    // Still redirect even on error
    redirect("/");
  }
}
/* ======================
   Get Current User Profile
   GET /user/profile
   Protected Api
====================== */

export async function getCurrentUserAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return null;
    }

    const response = await apiFetch("/user/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    return response?.data || response;
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}

/* ======================
   Update User Profile
   PUT /user/profile
====================== */
export async function updateProfileAction(formData) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      throw new Error("Not authenticated");
    }

    // Prepare update data - ONLY profile fields
    const updateData = {
      firstName: String(formData.firstName || "").trim(),
      lastName: String(formData.lastName || "").trim(),
      email: String(formData.email || "").trim(),
    };

    console.log("Updating profile:", updateData);

    const response = await apiFetch("/user/profile", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    console.log("Profile update response:", response);
    return response;
  } catch (error) {
    console.error("Update profile error:", error);
    throw new Error(error.message || "Failed to update profile");
  }
}

/* ======================
   Forgot Password
   POST /auth/forgot-password
   Public Api
====================== */
export async function forgotPasswordAction(email, isWeb = true) {
  try {
    console.log("Forgot password action called for email:", email);

    const response = await apiFetch("/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        webRequest: isWeb, // true for web, false for mobile
      }),
    });

    return response;
  } catch (error) {
    console.error("Forgot password action error:", error);
    throw error;
  }
}

/* ======================
   Reset Password
   POST /auth/reset-password
   Public Api
====================== */
export async function resetPasswordAction(token, newPassword, email) {
  try {
    console.log("Reset password action called with:", {
      token: token.substring(0, 10) + "...", // partial log for safety
      email: email || "not provided",
    });

    const payload = {
      email: email,
      token: token,
      newPassword: newPassword,
    };

    if (email) {
      payload.email = email.trim().toLowerCase();
    }

    const response = await apiFetch("/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return response;
  } catch (error) {
    console.error("Reset password action error:", error);

    let msg = error.message || "Failed to reset password.";

    if (msg.toLowerCase().includes("expired")) {
      msg = "This reset link has expired. Please request a new one.";
    } else if (
      msg.toLowerCase().includes("invalid") ||
      msg.toLowerCase().includes("token")
    ) {
      msg = "Invalid or expired reset link. Please try again.";
    } else if (msg.toLowerCase().includes("not found")) {
      msg = "Account not found or link is invalid.";
    }

    throw new Error(msg);
  }
}

/* ======================
   Change Password
   POST /auth/change-password
====================== */
export async function changePasswordAction(passwordData) {
  try {
    console.log("=== changePasswordAction ===");

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      throw new Error("Your session has expired. Please login again.");
    }

    // Prepare data - your backend expects currentPassword, newPassword
    const requestData = {
      currentPassword: String(passwordData.oldPassword || "").trim(),
      newPassword: String(passwordData.newPassword || "").trim(),
    };

    console.log("Sending:", requestData);

    // Use apiFetch - it will add the base URL automatically
    const response = await apiFetch("/auth/change-password", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    console.log("Success:", response);
    return response;
  } catch (error) {
    console.error("Password change error:", error);

    let errorMessage = "Failed to change password";

    if (
      error.message.includes("User not found") ||
      error.message.includes("incorrect") ||
      error.message.includes("current") ||
      error.message.includes("invalid")
    ) {
      errorMessage = "Current password is incorrect";
    } else if (
      error.message.includes("401") ||
      error.message.includes("unauthorized")
    ) {
      errorMessage = "Session expired. Please login again.";
    }

    throw new Error(errorMessage);
  }
}
