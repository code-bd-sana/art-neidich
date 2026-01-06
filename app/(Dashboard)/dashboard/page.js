"use client";

import { useState } from "react";
import MainCard from "@/components/Dashboard/MainCard";
import SummaryCard from "@/components/Dashboard/SummaryCard";
import { PanelRight } from "lucide-react";

export default function DashboardHome() {
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  const [showRightSidebarMobile, setShowRightSidebarMobile] = useState(false);

  const handleRightToggleDesktop = () =>
    setRightSidebarCollapsed((s) => !s);

  const handleRightToggleMobile = () =>
    setShowRightSidebarMobile((s) => !s);

  const closeRightMobile = () => setShowRightSidebarMobile(false);

  return (
    <div className="flex flex-col min-h-full">

      <div className="flex flex-1 overflow-hidden">
        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-4">
          <MainCard />
          {/* other main dashboard content */}
        </div>

        {/* Desktop Summary Sidebar */}
        <aside
          className={`hidden md:block transition-all duration-300 border-l border-gray-200 bg-white  " ${
            rightSidebarCollapsed ? "w-16" : "w-64"
          }`}
        >
          <SummaryCard
            isCollapsed={rightSidebarCollapsed}
            onToggle={handleRightToggleDesktop}
          />
        </aside>

        {/* Mobile Summary Slide-over */}
        {showRightSidebarMobile && (
          <>
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              onClick={closeRightMobile}
            />
            <div className="fixed inset-y-0 right-0 w-3/4 bg-white shadow-xl z-50 overflow-y-auto">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="font-semibold">Dashboard Summary</h2>
                <button
                  onClick={closeRightMobile}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>
              <SummaryCard
                isCollapsed={false}
                isMobile={true}
                onClose={closeRightMobile}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}