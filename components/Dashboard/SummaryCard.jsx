"use client";

import {
  CheckCircle,
  Calendar,
  UserPlus,
  FileText,
  Clock,
  AlertCircle,
  Package,
  PanelLeft,
  PanelRight,
  ChevronDown,
} from "lucide-react";

const SummaryCard = ({ isCollapsed, onToggle }) => {
  const summaryStats = [
    { label: "Total Jobs", icon: Package },
    { label: "Pending", icon: Clock },
    { label: "Overdue", icon: AlertCircle },
    { label: "Completed Today", icon: CheckCircle },
  ];

  const activities = [
    {
      id: 1,
      icon: CheckCircle,
      iconColor: "text-blue-500",
      borderColor: "border-blue-100",
      text: "Job #10052 for 120 Oak Lane was submitted by Michael Chen.",
      action: "Trip to view report →",
      actionColor: "text-orange-600 hover:text-blue-800",
    },
    {
      id: 2,
      icon: Calendar,
      iconColor: "text-green-500",
      borderColor: "border-green-100",
      text: "Job #10051 for 450 Maple Ave was assigned to Sarah Jones.",
      action: "Due Mon Jan 8, 2019",
      actionColor: "text-orange-700 hover:text-blue-800",
    },
    {
      id: 3,
      icon: FileText,
      iconColor: "text-purple-500",
      borderColor: "border-purple-100",
      text: "Job #10046 for 78 Pine Street was submitted by Robert Kim.",
      action: "View details →",
      actionColor: "text-green-800 hover:text-purple-800",
    },
    {
      id: 5,
      icon: UserPlus,
      iconColor: "text-pink-500",
      borderColor: "border-pink-100",
      text: "New Inspector David Wilson was added to the system.",
      action: "Account Activated",
      actionColor: "text-green-800 hover:text-purple-800",
    },
  ];

  return (
    <div className="h-screen flex flex-col bg-[#EFEFF1] border-l border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-2 border-b border-gray-200 flex items-center justify-between shrink-0">
        {!isCollapsed && (
          <h2 className="font-semibold text-gray-800 truncate">Summary</h2>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 rounded-md hover:bg-gray-100 transition-colors shrink-0"
        >
          {isCollapsed ? <PanelLeft size={20} /> : <PanelRight size={20} />}
        </button>
      </div>

      {!isCollapsed ? (
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            {/* Summary Stats */}
            <div className="p-2">
              <div className="space-y-3">
                {summaryStats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 min-w-0">
                        <div
                          className={`p-2 rounded-lg ${stat.color} shrink-0`}
                        >
                          <stat.icon size={18} />
                        </div>
                        <span className="text-sm text-gray-600 truncate">
                          {stat.label}
                        </span>
                      </div>
                      <span className="text-lg font-bold text-gray-800 shrink-0 ml-2">
                        <ChevronDown />
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Activity Section */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-4">Activity</h3>

                <div className="space-y-3">
                  {activities.map((activity) => (
                    <div
                      key={activity.id}
                      className={`rounded-lg p-3 border ${activity.borderColor} `}
                    >
                      <div className="flex items-start">
                        <div
                          className={`p-1.5 rounded-2xl bg-[#E6E6E5] mr-2 shrink-0`}
                        >
                          <activity.icon size={16} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm text-gray-800 wrap-break-words">
                            {activity.text}
                          </p>
                          {activity.date && (
                            <p className="text-xs text-gray-500 mt-1">
                              {activity.date}
                            </p>
                          )}
                          {activity.action && (
                            <button
                              className={`text-xs font-medium mt-1 ${activity.actionColor} transition-colors wrap-break-words`}
                            >
                              {activity.action}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // 
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col items-center pt-6 space-y-5 overflow-y-auto">
            {summaryStats.map((stat, index) => (
              <div key={index} className="group relative">
                <div className={`p-3 rounded-lg ${stat.color} cursor-pointer`}>
                  <stat.icon size={20} />
                </div>
                <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                  {stat.label}
                </div>
              </div>
            ))}

            <div className="w-8 h-px bg-gray-300 my-2"></div>

            <div className="group relative">
              <div className="p-3 rounded-lg bg-gray-100 text-gray-600 cursor-pointer">
                <FileText size={20} />
              </div>
              <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                Activity
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryCard;
