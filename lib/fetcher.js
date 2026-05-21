"use server";

import { cookies } from "next/headers";
import {
  extractErrorList,
  extractErrorMessage,
  statusFallbackMessage,
} from "../lib/error-utils";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://76.13.100.15:8080/api/v1";

export async function apiFetch(endpoint, options = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let res;

  // Use AbortController for timeout to prevent minutes-long hangs in production
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

  try {
    res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
      ...options,
      signal: controller.signal,
    });
  } catch (networkError) {
    if (networkError.name === 'AbortError') {
      const error = new Error("Request timed out. The server is taking too long to respond.");
      error.status = 408;
      error.code = 408;
      throw error;
    }
    const error = new Error(
      "Unable to reach the server. Please check your internet connection.",
    );
    error.status = 0;
    error.code = 0;
    error.errors = [];
    error.response = null;
    error.cause = networkError;
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  let data;
  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    data = await res.json();
  } else {
    const text = await res.text();
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = text ? { message: text } : {};
    }
  }

  if (!res.ok) {
    const fallbackMessage = statusFallbackMessage(res.status);
    const error = new Error(extractErrorMessage(data, fallbackMessage));
    error.status = res.status;
    error.code = data?.code || res.status;
    error.errors = extractErrorList(data);
    error.response = data;
    throw error;
  }

  return data;
}
