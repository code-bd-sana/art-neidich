"use client";

import {
  CheckCircle,
  Calendar,
  Clock,
  AlertCircle,
  Package,
  PanelLeft,
  PanelRight,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getAdminOverviewAction } from "@/action/admin.action";

const SummaryCard = ({ isCollapsed, onToggle }) => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    inProgressJobs: 0,
    overDueJobs: 0,
    completedJobs: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedStats, setExpandedStats] = useState({});

  // Fetch real data on mount
  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getAdminOverviewAction();

        setStats({
          totalJobs: data.totalJobs || 0,
          inProgressJobs: data.inProgressJobs || 0,
          overDueJobs: data.overDueJobs || 0,
          completedJobs: data.completedJobs || 0,
        });
      } catch (err) {
        console.error("Failed to load overview:", err);
        setError(err.message || "Failed to load summary data");
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  const toggleStat = (index) => {
    setExpandedStats((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const summaryStats = [
    {
      label: "Total Jobs",
      value: stats.totalJobs,
      subtitle: `${stats.totalJobs} Total Jobs`,
      icon: Sparkles,
      iconColor: "text-gray-700",
    },
    {
      label: "Pending",
      value: stats.inProgressJobs,
      subtitle: `${stats.inProgressJobs} Pending`,
      icon: Clock,
      iconColor: "text-orange-500",
    },
    {
      label: "Overdue",
      value: stats.overDueJobs,
      subtitle: `${stats.overDueJobs} Overdue Jobs`,
      icon: AlertCircle,
      iconColor: "text-red-500",
    },
    {
      label: "Completed Today",
      value: stats.completedJobs,
      subtitle: `${stats.completedJobs} Completed Jobs`,
      icon: CheckCircle,
      iconColor: "text-gray-700",
    },
  ];

  const activities = [
    {
      id: "M",
      title: "Job #10052 for 129 Oak Lane was submitted by Michael Chen.",
      time: "Just now",
      action: "Tap to view report",
    },
    {
      id: "M",
      title: "Job #10051 for 450 Maple Ave was assigned to Sarah Jones.",
      time: "2 hours ago",
      dueDate: "Due: Dec 5, 2026",
    },
    {
      id: "M",
      title: "Job #10049 for 78 Pine Street was completed by Robert Kim.",
      time: "Yesterday, 4:30 PM",
    },
    {
      id: "M",
      title: "New inspector David Wilson was added to the system.",
      time: "Today, 9:15 AM",
    },
  ];

  return (
    <div className='h-screen flex flex-col bg-white border-l border-gray-200 overflow-hidden'>
      {/* Header */}
      <div className='px-4 py-3 border-b border-gray-200 flex items-center justify-between shrink-0'>
        {!isCollapsed && (
          <h2 className='text-sm font-normal text-gray-600'>Summary</h2>
        )}
        <button
          onClick={onToggle}
          className='p-1 rounded hover:bg-gray-100 transition-colors shrink-0 text-gray-600'>
          {isCollapsed ? <PanelLeft size={18} /> : <PanelRight size={18} />}
        </button>
      </div>

      {!isCollapsed ? (
        <div className='flex-1 overflow-hidden'>
          <div className='h-full overflow-y-auto'>
            {loading ? (
              <div className='flex flex-col items-center justify-center p-8 gap-3'>
                <div className='relative w-10 h-10'>
                  <div className='absolute inset-0 border-4 border-gray-200 rounded-full'></div>
                  <div className='absolute inset-0 border-4 border-orange-500 rounded-full border-t-transparent animate-spin'></div>
                </div>
                <p className='text-sm text-gray-500'>Loading summary...</p>
              </div>
            ) : error ? (
              <div className='text-center text-red-600 p-4'>{error}</div>
            ) : (
              <div className='px-4 py-3'>
                {/* Stats Items */}
                <div className='space-y-0'>
                  {summaryStats.map((stat, index) => (
                    <div
                      key={index}
                      className='py-3 border-b border-gray-100 last:border-b-0'>
                      <div className='flex items-start justify-between'>
                        <div className='flex items-start gap-2 flex-1'>
                          <stat.icon
                            size={16}
                            className={`mt-0.5 ${stat.iconColor}`}
                          />
                          <div className='flex-1 min-w-0'>
                            <div
                              className='flex items-center justify-between cursor-pointer select-none'
                              onClick={() => toggleStat(index)}>
                              <span className='text-sm font-normal text-gray-900'>
                                {stat.label}
                              </span>
                              <ChevronDown
                                size={16}
                                className={`text-gray-400 shrink-0 transition-transform duration-200 ${
                                  expandedStats[index] ? "rotate-180" : ""
                                }`}
                              />
                            </div>
                            {expandedStats[index] && stat.subtitle && (
                              <p className='text-[14px] text-gray-500 mt-0.5 animate-in fade-in slide-in-from-top-1 duration-200'>
                                {stat.subtitle}
                              </p>
                            )}
                          </div>
                        </div>
                        {/* <span className='text-lg font-bold text-gray-900 ml-4'>
                          {stat.value}
                        </span> */}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Activity Section */}
                <div className='mt-6 pt-4'>
                  <h3 className='text-xs font-medium text-gray-400 uppercase tracking-wide mb-4'>
                    Activity
                  </h3>
                  <div className='space-y-4'>
                    {activities.map((activity, index) => (
                      <div key={index} className='flex gap-3'>
                        <div className='w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center shrink-0 mt-0.5'>
                          <span className='text-xs font-medium text-gray-600'>
                            {activity.id}
                          </span>
                        </div>
                        <div className='flex-1 min-w-0'>
                          <p className='text-sm text-gray-900 leading-snug'>
                            {activity.title}
                          </p>
                          <p className='text-xs text-gray-500 mt-1'>
                            {activity.time}
                          </p>
                          {activity.action && (
                            <button className='text-xs text-orange-500 mt-1 flex items-center gap-1 hover:text-orange-600'>
                              {activity.action} →
                            </button>
                          )}
                          {activity.dueDate && (
                            <p className='text-xs text-orange-500 mt-1'>
                              {activity.dueDate}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className='flex-1 overflow-hidden flex flex-col items-center pt-6 space-y-5'>
          {summaryStats.map((stat, index) => (
            <div key={index} className='group relative'>
              <div className='p-3 rounded-lg bg-gray-100 cursor-pointer'>
                <stat.icon size={20} className={stat.iconColor} />
              </div>
              <div className='absolute left-full ml-2 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50'>
                {stat.label}: {stat.value}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SummaryCard;
