"use server";

import { apiFetch } from "@/lib/fetcher";
import { cookies } from "next/headers";

/* ======================
   Job
   GET /api/v1/job/
   Private Api
====================== */
export async function getJobs(page, limit, search = "", status = "all") {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    // Construct URL with search parameter
    const url = `/job?page=${page}&limit=${limit}${
      search ? `&search=${encodeURIComponent(search)}` : ""
    }&status=${status}`;

    const resp = await apiFetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
    });

    return resp;
  } catch (error) {
    console.error("Get jobs error:", error);
    throw error;
  }
}
/* ======================
   Job
   POST /api/v1/job/
   Private Api
====================== */
export async function postJob(jobData) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
      throw new Error("No authentication token found");
    }
    // console.log("Sending job data:", jobData);
    const resp = await apiFetch(`/job`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify(jobData),
    });

    console.log("Post job response:", resp);
    return resp;
  } catch (error) {
    console.error("Post job error:", error);
    throw error;
  }
}
/* ======================
   Job
   GET /api/v1/job/
   Private Api
====================== */
export async function getJobById(id) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const resp = await apiFetch(`/job/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
    });
    // console.log(resp);
    return resp;
  } catch (error) {
    console.error("Get jobs error:", error);
    throw error;
  }
}
