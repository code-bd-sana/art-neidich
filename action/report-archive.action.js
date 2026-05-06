"use server";

import { apiFetch } from "../lib/fetcher";
import { normalizeActionError } from "../lib/error-utils";

/* ======================
   Get Archived Reports
   GET /api/v1/report/archive/list
====================== */
export async function getArchivedReports(page = 1, limit = 10, search = "") {
  try {
    let url = `/report/archive/list?page=${page}&limit=${limit}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }

    const resp = await apiFetch(url, { method: "GET" });
    return resp;
  } catch (error) {
    console.error("Get archived reports error:", error);
    return normalizeActionError(error, "Failed to load archived reports.");
  }
}

/* ======================
   Restore Archived Reports
   POST /api/v1/report/archive/restore
====================== */
export async function restoreArchivedReports(reportIds) {
  try {
    const resp = await apiFetch("/report/archive/restore", {
      method: "POST",
      body: JSON.stringify({ reportIds }),
    });
    return resp;
  } catch (error) {
    console.error("Restore archived reports error:", error);
    return normalizeActionError(error, "Failed to restore archived reports.");
  }
}

/* ======================
   Permanently Delete Archived Reports
   DELETE /api/v1/report/archive/permanent
====================== */
export async function permanentlyDeleteArchivedReports(reportIds) {
  try {
    const resp = await apiFetch("/report/archive/permanent", {
      method: "DELETE",
      body: JSON.stringify({ reportIds }),
    });
    return resp;
  } catch (error) {
    console.error("Permanently delete archived reports error:", error);
    return normalizeActionError(
      error,
      "Failed to permanently delete archived reports.",
    );
  }
}
