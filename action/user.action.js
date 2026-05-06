"use server";

import { apiFetch } from "../lib/fetcher";
import { cookies } from "next/headers";
import { normalizeActionError } from "../lib/error-utils";

/* ======================
   Get all Users
   GET /api/v1/user?
   Private Api
====================== */

export async function getUsers(page = 1, limit = 10, search = "", role = "") {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const resp = await apiFetch(
      `/user?page=${page}&limit=${limit}&search=${search}&role=${role}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.value}`,
        },
      },
    );

    return resp;
  } catch (error) {
    console.error("Get users error:", error);
    return normalizeActionError(error, "Failed to load users.");
  }
}
/* ======================
   Update User Status - Reusable for all actions
   PATCH /api/v1/user/:id/approve
   PATCH /api/v1/user/:id/suspend
   PATCH /api/v1/user/:id/unsuspend
   Private Api
====================== */
export async function updateUserStatus(userId, action) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    // Determine endpoint based on action
    let endpoint;
    switch (action) {
      case "approve":
        endpoint = `/user/${userId}/approve`;
        break;
      case "suspend":
        endpoint = `/user/${userId}/suspend`;
        break;
      case "unsuspend":
        endpoint = `/user/${userId}/unsuspend`;
        break;
      default:
        throw new Error(`Invalid action: ${action}`);
    }

    const resp = await apiFetch(endpoint, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify({}),
    });

    return resp;
  } catch (error) {
    console.error("Update user status error:", error);
    return normalizeActionError(error, "Failed to update user status.");
  }
}

/* ======================
   Delete User
   DELETE /api/v1/user/:id
   Private Api
====================== */
export async function deleteUser(userId) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const resp = await apiFetch(`/user/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
    });

    return resp;
  } catch (error) {
    console.error("Delete user error:", error);
    return normalizeActionError(error, "Failed to delete user.");
  }
}
