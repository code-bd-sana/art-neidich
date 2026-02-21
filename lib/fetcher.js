"use server";

import { cookies } from "next/headers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://76.13.100.15:8080/api/v1";

export async function apiFetch(endpoint, options = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  let data;
  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    data = await res.json();
  } else {
    const text = await res.text();
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { message: text };
    }
  }

  if (!res.ok) {
    throw new Error(data?.message || "Something went wrong");
  }

  return data;
}
