"use server";

import { apiFetch } from "@/lib/fetcher";
import { cookies } from "next/headers";

/* ======================
   Get Admin Overview
   GET /admin/overview
   Private Api
====================== */
export async function getAdminOverviewAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      throw new Error("Not authenticated");
    }

    const response = await apiFetch("/admin/overview", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store", // always fresh data
    });

    return response?.data || response; // return the data of the API
  } catch (error) {
    console.error("Get admin overview error:", error);
    throw new Error(error.message || "Failed to load admin overview");
  }
}
