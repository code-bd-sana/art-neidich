"use server";

import { apiFetch } from "../lib/fetcher";
import { normalizeActionError } from "../lib/error-utils";

/* ======================
   Get Archive Settings
   GET /api/v1/archive-settings
====================== */
export async function getArchiveSettings() {
  try {
    const resp = await apiFetch("/archive-settings", {
      method: "GET",
    });

    return resp;
  } catch (error) {
    console.error("Get archive settings error:", error);
    return normalizeActionError(error, "Failed to load archive settings.");
  }
}

/* ======================
   Update Archive Settings
   PUT /api/v1/archive-settings
====================== */
export async function updateArchiveSettings(autoArchiveDays) {
  try {
    const resp = await apiFetch("/archive-settings", {
      method: "PUT",
      body: JSON.stringify({ autoArchiveDays }),
    });

    return resp;
  } catch (error) {
    console.error("Update archive settings error:", error);
    return normalizeActionError(error, "Failed to update archive settings.");
  }
}
