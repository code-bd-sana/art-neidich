"use server";

import { apiFetch } from "@/lib/fetcher";
import { cookies } from "next/headers";


/* ======================
   Report
   GET /api/v1/report/:id
   Private Api
====================== */
export async function getReportById(id) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token'); 

    if (!token) {
      throw new Error("No authentication token found");
    }

    const resp =  await apiFetch(`/report/${id}`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}`, 
      },
    });
    // console.log(resp)
    return resp
  } catch (error) {
    console.error("Get report error:", error);
    throw error;
  }
}
/* ======================
   Report
   PATCH /api/v1/report/:id/status
   Private Api
====================== */
export async function updateReportStatus(id, status) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token'); 

    if (!token) {
      throw new Error("No authentication token found");
    }

    const resp =  await apiFetch(`/report/${id}/status`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}`, 
      },
      body: {
        "status": status
      }
    });
    // console.log(resp)
    return resp
  } catch (error) {
    console.error("Report status update error:", error);
    throw error;
  }
}