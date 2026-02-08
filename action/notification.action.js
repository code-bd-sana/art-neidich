// action/notification.action.js
"use server";

import { apiFetch } from "@/lib/fetcher";
import { cookies } from "next/headers";

/* ======================
   Notifications
   GET /api/v1/notification/
   Private Api
====================== */
export async function getNotifications() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    // Get all notifications (first 10)
    const resp = await apiFetch(`/notification?page=1&limit=10`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
    });

    return resp;
  } catch (error) {
    console.error("Get notifications error:", error);
    throw error;
  }
}
