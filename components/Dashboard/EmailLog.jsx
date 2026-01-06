"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { updateReportStatus } from "@/action/report.action";

export default function EmailLog({ jobData }) {
  console.log("EmailLog - jobData:", jobData);
  
  // Get report ID from jobData 
  const reportId = jobData?.reportId;
  
  console.log("reportId from jobData:", reportId);
  console.log("hasReport:", jobData?.hasReport);
  console.log("reportStatusLabel:", jobData?.reportStatusLabel);
  
  // Get initial status from reportStatusLabel
  const getInitialStatus = () => {
    // First check reportStatusLabel
    if (jobData?.reportStatusLabel) {
      console.log("Using reportStatusLabel:", jobData.reportStatusLabel);
      return jobData.reportStatusLabel;
    }
    
    // Fallback: if hasReport is false, it's "In Progress"
    if (jobData?.hasReport === false) {
      return "In Progress";
    }
    
    return "Submitted";
  };

  const [currentStatus, setCurrentStatus] = useState(getInitialStatus());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Update status when jobData changes
  useEffect(() => {
    const newStatus = getInitialStatus();
    console.log("Setting currentStatus to:", newStatus);
    setCurrentStatus(newStatus);
  }, [jobData]);

  // Format timestamp from jobData
  const formatTimestamp = () => {
    if (!jobData?.createdAt) return "2026-12-01 11:31:05 PM";

    const date = new Date(jobData.createdAt);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  // Get actual email for Message ID
  const getMessageId = () => {
    if (jobData?.siteContactEmail) return jobData.siteContactEmail;
    if (jobData?.inspector?.email) return jobData.inspector.email;
    if (jobData?.createdBy?.email) return jobData.createdBy.email;
    return "No email found";
  };

  // Status color based on display label
  const getStatusColor = (statusLabel) => {
    const status = statusLabel?.toLowerCase() || "";
    
    if (status.includes("progress")) {
      return "bg-blue-50 text-blue-700 border border-blue-200";
    } else if (status.includes("complete")) {
      return "bg-green-50 text-green-700 border border-green-200";
    } else if (status.includes("reject")) {
      return "bg-red-50 text-red-700 border border-red-200";
    } else if (status.includes("submit")) {
      return "bg-yellow-50 text-yellow-700 border border-yellow-200";
    } else {
      return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  // Convert display label to API status value
  const getApiStatusValue = (displayLabel) => {
    const label = displayLabel?.toLowerCase() || "";
    
    if (label.includes("progress")) return "in_progress";
    if (label.includes("complete")) return "completed";
    if (label.includes("reject")) return "rejected";
    if (label.includes("submit")) return "submitted";
    
    return "submitted";
  };

  // Convert API status value to display label
  const getDisplayLabel = (apiStatus) => {
    const statusMap = {
      "submitted": "Submitted",
      "in_progress": "In Progress", 
      "completed": "Completed",
      "rejected": "Rejected",
    };
    return statusMap[apiStatus] || apiStatus || "Submitted";
  };

  // Status options for dropdown (only when report exists)
  const statusOptions = [
    { value: "submitted", label: "Submitted" },
    { value: "completed", label: "Completed" },
    { value: "rejected", label: "Rejected" },
  ];

  // Check if status can be changed
  const canChangeStatus = () => {
    // If no report exists (hasReport: false), cannot change status
    if (jobData?.hasReport === false) {
      return false;
    }
    
    // Need a report ID to update
    if (!reportId) {
      return false;
    }
    
    // If current status is "In Progress", cannot change it
    if (currentStatus?.toLowerCase().includes("progress")) {
      return false;
    }
    
    return true;
  };

  // Handle status change
  const handleStatusChange = async (newStatus) => {
    console.log("=== Status Change ===");
    console.log("New status (API value):", newStatus);
    console.log("Display label:", getDisplayLabel(newStatus));
    console.log("reportId:", reportId);
    console.log("hasReport:", jobData?.hasReport);
    
    // Check if status can be changed
    if (!canChangeStatus()) {
      if (jobData?.hasReport === false) {
        setError("Cannot change status: Report not submitted yet");
      } else if (currentStatus?.toLowerCase().includes("progress")) {
        setError("Cannot change status: Report is still in progress");
      } else if (!reportId) {
        setError("Cannot change status: No report ID found");
      }
      return;
    }
    
    // Cannot change back to "in_progress"
    if (newStatus === "in_progress") {
      setError("Cannot change back to 'In Progress'");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Calling updateReportStatus with:", {
        reportId: reportId,
        status: newStatus
      });
      
      const result = await updateReportStatus(reportId, newStatus);
      console.log("API Response:", result);
      
      if (result?.success) {
        // Update local state with the display label
        setCurrentStatus(getDisplayLabel(newStatus));
        setError("✓ Status updated successfully");
        setTimeout(() => setError(null), 2000);
      } else {
        setError(result?.message || "Failed to update status");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      setError(err.message || "Failed to update status");
    } finally {
      setIsLoading(false);
      setIsDropdownOpen(false);
    }
  };

  const canChange = canChangeStatus();

  return (
    <div className="bg-gray-50">
      <div className="bg-white rounded-lg shadow-sm mx-4 md:mx-0">
        {/* Content */}
        <div className="p-4 md:p-6 lg:p-8">
          {/* Mobile Header */}
          <div className="md:hidden mb-6">
            <h3 className="text-lg font-medium text-gray-900">Email Communication</h3>
            <p className="text-sm text-gray-500 mt-1">
              Communication logs for this inspection
            </p>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:block mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              Email Communication
            </h3>
          </div>

          <div className="space-y-0">
            <DetailRow label="Timestamp" value={formatTimestamp()} />
            <DetailRow
              label="Status"
              value={
                <div className="relative inline-block">
                  <div className="inline-flex flex-col gap-1">
                    <div className="relative">
                      {/* Status display - only show dropdown if can change */}
                      {canChange ? (
                        <button
                          type="button"
                          onClick={() => !isLoading && setIsDropdownOpen(!isDropdownOpen)}
                          disabled={isLoading}
                          className={`inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full font-medium ${getStatusColor(
                            currentStatus
                          )} ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90 cursor-pointer"}`}
                        >
                          <span>{currentStatus}</span>
                          {!isLoading && (
                            <ChevronDown 
                              size={14} 
                              className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                            />
                          )}
                          {isLoading && (
                            <span className="ml-1">...</span>
                          )}
                        </button>
                      ) : (
                        // Static display when cannot change
                        <span className={`inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full font-medium ${getStatusColor(currentStatus)}`}>
                          <span>{currentStatus}</span>
                        </span>
                      )}
                      
                      {/* Dropdown menu - only show if can change */}
                      {isDropdownOpen && !isLoading && canChange && (
                        <>
                          <div 
                            className="fixed inset-0 z-10"
                            onClick={() => setIsDropdownOpen(false)}
                          />
                          <div className="absolute z-20 mt-1 w-48 rounded-md bg-white shadow-lg border border-gray-200">
                            <div className="py-1">
                              {statusOptions.map((option) => (
                                <button
                                  key={option.value}
                                  type="button"
                                  onClick={() => handleStatusChange(option.value)}
                                  className={`w-full text-left px-4 py-2 text-sm ${
                                    getApiStatusValue(currentStatus) === option.value
                                      ? "bg-gray-100 text-gray-900 font-medium"
                                      : "text-gray-700 hover:bg-gray-50"
                                  }`}
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    
                    {/* Error/Success messages */}
                    {error && (
                      <span className={`text-xs ${error.includes("✓") ? "text-green-600" : "text-red-600"}`}>
                        {error}
                      </span>
                    )}
                    
                    {/* Status information */}
                    <div className="text-xs text-gray-400">
                      {jobData?.hasReport === false ? (
                        "Report not submitted yet"
                      ) : currentStatus?.toLowerCase().includes("progress") ? (
                        "Report in progress - cannot change status"
                      ) : !reportId ? (
                        "No report ID found"
                      ) : (
                        "Click to change status"
                      )}
                    </div>
                  </div>
                </div>
              }
            />
            <DetailRow label="Message ID" value={getMessageId()} />
            <DetailRow label="Order ID" value={jobData?.orderId || "N/A"} />
            <DetailRow
              label="FHA Case"
              value={jobData?.fhaCaseDetailsNo || "N/A"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3 py-3 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600 sm:min-w-[140px] md:min-w-40">
        {label}
      </span>
      <span className="hidden sm:inline text-sm text-gray-400">:</span>
      <div className="text-sm text-gray-900 sm:ml-2 wrap-break-words">{value}</div>
    </div>
  );
}