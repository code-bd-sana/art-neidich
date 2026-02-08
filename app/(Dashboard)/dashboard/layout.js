"use client";

import { useState, cloneElement, useEffect } from "react";
import DashboardCard from "@/components/Dashboard/DashboardCard";
import { PanelLeft, PanelRight, Search, User } from "lucide-react";
import SummaryCard from "@/components/Dashboard/SummaryCard";
import {
  setupForegroundHandler,
  setupForegroundMessages,
} from "@/lib/foreground-messages";

export default function DashboardLayout({ children }) {
  const [showLeftSidebarMobile, setShowLeftSidebarMobile] = useState(false);
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [showRightSidebarMobile, setShowRightSidebarMobile] = useState(false);

  const toggleRightSidebarMobile = () => setShowRightSidebarMobile((p) => !p);

  const closeRightSidebarMobile = () => setShowRightSidebarMobile(false);

  useEffect(() => {
    setupForegroundMessages();
  }, []);

  return (
    <div className='min-h-screen flex flex-col md:flex-row overflow-hidden bg-gray-50'>
      {/* LEFT SIDEBAR (Desktop) */}
      <aside
        className={`hidden md:block transition-all duration-300 bg-white border-r border-gray-200 ${
          leftSidebarCollapsed ? "w-20" : "w-64"
        }`}>
        <DashboardCard
          isCollapsed={leftSidebarCollapsed}
          onToggle={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}
        />
      </aside>

      {/* LEFT SIDEBAR (Mobile) */}
      {showLeftSidebarMobile && (
        <>
          <div
            className='fixed inset-0 bg-black/30 backdrop-blur-sm z-40'
            onClick={() => setShowLeftSidebarMobile(false)}
          />
          <div className='fixed inset-y-0 left-0 w-3/4 bg-white shadow-xl z-50'>
            <DashboardCard
              isCollapsed={false}
              isMobile={true}
              onClose={() => setShowLeftSidebarMobile(false)}
            />
          </div>
        </>
      )}

      {/* MAIN AREA */}
      <div className='flex-1 flex flex-col min-w-0 overflow-hidden'>
        {/* TOP BAR */}
        <header className='bg-white border-b border-gray-200 p-4.5 flex items-center gap-3'>
          {/* Left mobile toggle */}
          <button
            onClick={() => setShowLeftSidebarMobile(true)}
            className='md:hidden p-2 rounded-lg hover:bg-gray-100'>
            <PanelLeft size={20} />
          </button>

          {/* Desktop collapse */}
          <button
            onClick={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}
            className='hidden md:flex p-2 rounded-lg hover:bg-gray-100'>
            <PanelLeft size={20} />
          </button>

          <div className='flex-1' />

          {/* Search */}
          {/* <div className='relative hidden md:block max-w-md'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
            <input
              type='text'
              placeholder='Search...'
              className='pl-10 pr-4 py-1 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-teal-500'
            />
          </div> */}

          {/* User + Mobile Toggle Button */}
          <div className='flex items-center gap-2'>
            {/* User info */}
            <div className='flex items-center'>
              <div className='w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center'>
                <User className='text-teal-600' size={18} />
              </div>
              <p className='ml-2 hidden md:block font-medium'>Art Neidich</p>
            </div>

            {/* MOBILE RIGHT SIDEBAR TOGGLE */}
            <button
              onClick={toggleRightSidebarMobile}
              className='md:hidden p-2 rounded-lg hover:bg-gray-100'
              title='Toggle summary panel'>
              <PanelRight size={20} />
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className='flex-1 overflow-y-auto'>
          {children &&
            cloneElement(children, {
              showRightSidebarMobile,
              closeRightSidebarMobile: closeRightSidebarMobile,
            })}
        </div>
      </div>

      {/* Mobile Summary Slide-over */}
      {showRightSidebarMobile && (
        <>
          <div
            className='fixed inset-0 bg-black/30 backdrop-blur-sm z-40'
            onClick={closeRightSidebarMobile}
          />
          <div className='fixed inset-y-0 right-0 w-3/4 bg-white shadow-xl z-50 overflow-y-auto'>
            <SummaryCard
              isCollapsed={false}
              isMobile={true}
              onClose={closeRightSidebarMobile}
            />
          </div>
        </>
      )}
    </div>
  );
}
