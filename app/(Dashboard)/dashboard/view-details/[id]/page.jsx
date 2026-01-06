"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import EmailLog from "@/components/Dashboard/EmailLog";
import Photos from "@/components/Dashboard/Photos";
import Summary from "@/components/Dashboard/Summary";
import { getJobById } from "@/action/job.action";
import { Loader2 } from "lucide-react";

export default function ViewDetailsPage() {
  const [activeTab, setActiveTab] = useState("summary");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobData, setJobData] = useState(null);

  const params = useParams();
  const id = params.id;

  useEffect(() => {
    const fetchJobData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getJobById(id);
        if (data.success) {
          setJobData(data.data);
        } else {
          throw new Error(data.message || "Failed to fetch job details");
        }
      } catch (err) {
        console.error("Error fetching job details:", err);
        setError(err.message || "Failed to load inspection details");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchJobData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2
            className="animate-spin text-teal-600 mx-auto mb-4"
            size={32}
          />
          <p className="text-gray-600">Loading inspection details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={fetchJobData}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!jobData) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No inspection data found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">
              Inspection Details
            </h1>
            <span className="text-sm text-gray-500">
              ID: {jobData.orderId || jobData._id.substring(0, 8)}
            </span>
          </div>

          {/* Mobile Tabs */}
          <div className="flex overflow-x-auto pb-2 -mx-4 px-4">
            <button
              onClick={() => setActiveTab("summary")}
              className={`shrink-0 px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "summary"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Summary
            </button>
            <button
              onClick={() => setActiveTab("photos")}
              className={`shrink-0 px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "photos"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Photos
            </button>
            <button
              onClick={() => setActiveTab("emailLog")}
              className={`shrink-0 px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "emailLog"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Email Log
            </button>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block border-b border-gray-200 px-8 pt-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            Inspection Details
          </h1>

          {/* Desktop Tabs */}
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("summary")}
              className={`pb-4 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "summary"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Summary
            </button>
            <button
              onClick={() => setActiveTab("photos")}
              className={`pb-4 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "photos"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Photos
            </button>
            <button
              onClick={() => setActiveTab("emailLog")}
              className={`pb-4 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "emailLog"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Email Log
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-8">
          {activeTab === "summary" && <Summary jobData={jobData} />}
          {activeTab === "photos" && <Photos jobData={jobData} />}
          {activeTab === "emailLog" && <EmailLog jobData={jobData} />}
        </div>
      </div>
    </div>
  );
}
