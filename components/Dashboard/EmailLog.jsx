import { useState } from 'react';

export default function EmailLog() {
  const [activeTab, setActiveTab] = useState('emailLog');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className=" bg-white rounded-lg shadow-sm">
        {/* Content */}
        <div className="p-8">
          <div className="space-y-4">
            <DetailRow label="Timestamp" value="2026-12-01 11:31:05 PM" />
            <DetailRow 
              label="Status" 
              value={
                <span className="inline-block bg-green-100 text-green-800 text-xs px-3 py-1 rounded font-medium">
                  Submitted
                </span>
              } 
            />
            <DetailRow label="Message ID" value="john.doe@gmail.com" />
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-sm text-gray-600 min-w-[120px]">{label}</span>
      <span className="text-sm text-gray-400">:</span>
      <div className="text-sm text-gray-900">{value}</div>
    </div>
  );
}