// action/notification.action.js
"use server";

import { cookies } from "next/headers";

/**
 * Fetch recent notifications for the current user
 */
export async function getUserNotifications(limit = 10) {
  try {
    // Get auth token from cookies
    const cookieStore = await cookies();
    const token =
      cookieStore.get("token")?.value || cookieStore.get("accessToken")?.value;

    if (!token) {
      throw new Error("Not authenticated");
    }

    // Fetch notifications from API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/notification?limit=${limit}&page=1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch notifications: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch notifications");
    }

    return {
      notifications: data.data || [],
      metaData: data.metaData || {},
      success: true,
    };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return {
      notifications: [],
      metaData: {},
      success: false,
      error: error.message,
    };
  }
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(notificationId) {
  try {
    // Note: Your backend doesn't have a mark-as-read endpoint yet
    // You'll need to add this to your API
    console.log(
      "Mark as read not implemented yet for notification:",
      notificationId,
    );
    return { success: true };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return { success: false, error: error.message };
  }
}
