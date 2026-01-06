"use client";

export default function EmailLog({ jobData }) {
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

  // Get actual status
  const getStatus = () => {
    if (jobData?.reportStatusLabel) return jobData.reportStatusLabel;
    if (jobData?.hasReport) return "Report Submitted";
    return "Submitted";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "Completed":
        return "bg-green-50 text-green-700 border border-green-200";
      case "Rejected":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

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
                <span
                  className={`inline-block text-xs px-3 py-1.5 rounded-full font-medium ${getStatusColor(
                    getStatus()
                  )}`}
                >
                  {getStatus()}
                </span>
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