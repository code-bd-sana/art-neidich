"use server";

import { apiFetch } from "../lib/fetcher";
import { normalizeActionError } from "../lib/error-utils";

/* ======================
   Update Label
   PUT /api/v1/image-label/:id
====================== */
export async function updateLabel(labelId, labelName) {
  try {
    // apiFetch already handles cookies and auth
    const resp = await apiFetch(`/image-label/${labelId}`, {
      method: "PUT",
      body: JSON.stringify({ label: labelName }),
    });

    return resp;
  } catch (error) {
    console.error("Update label error:", error);
    return normalizeActionError(error, "Failed to update label.");
  }
}

/* ======================
   Create Label
   POST /api/v1/image-label/
====================== */
export async function createLabel(labelName) {
  try {
    const resp = await apiFetch(`/image-label`, {
      method: "POST",
      body: JSON.stringify({ label: labelName }),
    });

    return resp;
  } catch (error) {
    console.error("Create label error:", error);
    return normalizeActionError(error, "Failed to create label.");
  }
}

/* ======================
   Delete Label
   DELETE /api/v1/image-label/:id
====================== */
export async function deleteLabel(labelId) {
  try {
    const resp = await apiFetch(`/image-label/${labelId}`, {
      method: "DELETE",
    });

    return resp;
  } catch (error) {
    console.error("Delete label error:", error);
    return normalizeActionError(error, "Failed to delete label.");
  }
}

/* ======================
   Get Labels
   GET /api/v1/image-label?page=1&limit=10&search=...
====================== */
export async function getLabels(page = 1, limit = 20, search = "") {
  try {
    let url = `/image-label?page=${page}&limit=${limit}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }

    const resp = await apiFetch(url, {
      method: "GET",
    });

    return resp;
  } catch (error) {
    console.error("Get labels error:", error);
    return normalizeActionError(error, "Failed to load labels.");
  }
}
