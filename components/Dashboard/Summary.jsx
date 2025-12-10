export default function Summary() {

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className=" bg-white rounded-lg shadow-sm">
        {/* Content */}
        <div className="p-8">
          {/* Inspection Details */}
          <div className="space-y-4 mb-8">
            <DetailRow label="Inspector" value="John Doe" />
            <DetailRow label="FHA Case Details" value="511-3746727" />
            <DetailRow label="Order ID" value="8813218R" />
            <DetailRow
              label="Form Type"
              value="RCI Residential Building Code Inspection"
            />
            <DetailRow
              label="Street Address"
              value="1184 Crestview Drive, San Jose, California 95132"
            />
            <DetailRow label="Development" value="Histrung Heights" />
          </div>

          {/* Submission Details Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Submission Details
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Submission Date</span>
              <span className="text-sm text-gray-400">:</span>
              <div className="flex items-center gap-2">

                <span className="text-sm text-teal-600 font-medium">
                  22 Nov 2025
                </span>
              </div>
            </div>
          </div>

          {/* Site Contact Information Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Site Contact Information
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="inline-block bg-teal-600 text-white text-xs px-3 py-1 rounded-full mb-2">
                john.doe@gmail.com
              </div>
              <div className="flex items-start gap-2">
                <span className="text-sm text-gray-500 min-w-[150px]">
                  Site Contact Name
                </span>
                <span className="text-sm text-gray-400">:</span>
                <span className="text-sm text-gray-900">John Doe</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-sm text-gray-500 min-w-[150px]">
                  Site Contact Phone
                </span>
                <span className="text-sm text-gray-400">:</span>
                <span className="text-sm text-gray-900">+1 111 222 3333</span>
              </div>
            </div>
          </div>

          {/* Internal Notes Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Internal Notes
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-2">
                <span className="text-sm text-gray-500 min-w-[150px]">
                  Note to Inspector
                </span>
                <span className="text-sm text-gray-400">:</span>
                <span className="text-sm text-gray-900">
                  Look for the damages caused by thunder
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-sm text-gray-500 min-w-[150px]">
                  Notes to AP/AR
                </span>
                <span className="text-sm text-gray-400">:</span>
                <span className="text-sm text-gray-900">None</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-sm text-gray-500 min-w-[150px]">
                  From Inspector
                </span>
                <span className="text-sm text-gray-400">:</span>
                <span className="text-sm text-gray-900">
                  Looked for the damages caused by thunder, and found prove of
                  damages in rooftop.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-sm text-gray-500 min-w-[150px]">{label}</span>
      <span className="text-sm text-gray-400">:</span>
      <span className="text-sm text-gray-900">{value}</span>
    </div>
  );
}
