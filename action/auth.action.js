"use server";

import { apiFetch } from "@/lib/fetcher";
import { cookies } from "next/headers";

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
        'Content-Type': 'application/json',
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
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });

    const token = response?.token || response?.data?.token;

    if (!token) {
      throw new Error("JWT token not returned from API");
    }

    const cookieStore = await cookies();

    cookieStore.set("token", String(token), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
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
====================== */
export async function logoutAction() {
  try {
    const cookieStore = await cookies();
    
    // Delete the httpOnly cookie (same way you set it)
    cookieStore.delete("token");
    
    // IMPORTANT: Force redirect from server
    redirect("/");
    
  } catch (error) {
    console.error("Logout error:", error);
    // Still try to redirect
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
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
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
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
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
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    console.log("Success:", response);
    return response;
    
  } catch (error) {
    console.error("Password change error:", error);
    
    let errorMessage = "Failed to change password";
    
    if (error.message.includes("User not found") || 
        error.message.includes("incorrect") || 
        error.message.includes("current") ||
        error.message.includes("invalid")) {
      errorMessage = "Current password is incorrect";
    } else if (error.message.includes("401") || error.message.includes("unauthorized")) {
      errorMessage = "Session expired. Please login again.";
    }
    
    throw new Error(errorMessage);
  }
}