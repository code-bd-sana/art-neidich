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