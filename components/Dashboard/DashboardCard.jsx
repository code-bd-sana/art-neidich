"use client";

import {
  LayoutDashboard,
  UserCircle,
  User,
  UserRoundSearch,
  Tags,
  UserCog,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/action/auth.action";

const DashboardCard = ({
  isCollapsed,
  onToggle,
  activeSection,
  onSectionChange,
}) => {
  const pathname = usePathname();
  const [localActive, setLocalActive] = useState(activeSection);
  const router = useRouter();

  // Update local active state when prop changes
  useEffect(() => {
    setLocalActive(activeSection);
  }, [activeSection]);

  const menuItems = [
    {
      id: "Dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      link: "/dashboard",
    },
    {
      id: "Manage Jobs",
      icon: User,
      label: "Manage Jobs",
      link: "/dashboard/manage-jobs",
    },
    {
      id: "Inspectors",
      icon: UserRoundSearch,
      label: "Inspectors",
      link: "/dashboard/inspectors",
    },
    { id: "Labels", icon: Tags, label: "Labels", link: "/dashboard/labels" },
  ];

  const otherItems = [
    {
      id: "Profile",
      icon: UserCircle,
      label: "Profile",
      link: "/dashboard/profile",
    },
    {
      id: "Admin Approval List",
      icon: UserCog,
      label: "Admin Approval List",
      link: "/dashboard/admin-list",
    },
  ];

  // Map URL path to menu item ID with exact matching
  const getItemIdFromPath = (path) => {
    const mapping = {
      "/dashboard": "Dashboard",
      "/dashboard/manage-jobs": "Manage Jobs",
      "/dashboard/inspectors": "Inspectors",
      "/dashboard/labels": "Labels",
      "/dashboard/profile": "Profile",
      "/dashboard/admin-list": "Admin Approval List",
    };

    // Check exact match
    if (mapping[path]) return mapping[path];

    if (path.startsWith("/manage-jobs/")) return "Manage Jobs";
    if (path.startsWith("/inspectors/")) return "Inspectors";
    if (path.startsWith("/labels/")) return "Labels";
    if (path.startsWith("/profile/")) return "Profile";
    if (path.startsWith("/admin-approval/")) return "Admin Approval List";

    return null;
  };

  // Determine if item is active - with strict matching
  const isItemActive = (item) => {
    // Get current active item from URL
    const currentActiveItemId = getItemIdFromPath(pathname);

    // If we have a URL-based active item, use it
    if (currentActiveItemId) {
      return item.id === currentActiveItemId;
    }

    // Fallback to localActive state (from clicks)
    return item.id === localActive;
  };

  const handleItemClick = (item) => {
    // Update local state immediately for visual feedback
    setLocalActive(item.id);

    // Update parent component's state
    if (onSectionChange) {
      onSectionChange(item.id);
    }
  };

  // Sync with URL on component mount and pathname changes
  useEffect(() => {
    const itemIdFromPath = getItemIdFromPath(pathname);
    if (itemIdFromPath) {
      setLocalActive(itemIdFromPath);
      if (onSectionChange) {
        onSectionChange(itemIdFromPath);
      }
    }
  }, [pathname, onSectionChange]);

  const handleLogout = async () => {
    try {
      // Call the server action - this will delete the httpOnly cookie
      await logoutAction();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback to redirect
      window.location.href = "/";
    }
  };

  return (
    <div
      className={`h-screen flex flex-col bg-white border-r border-gray-100 fixed left-0 top-0 bottom-0 ${
        isCollapsed ? "w-20" : "w-3/4 md:w-64"
      }`}>
      {/* Logo and Toggle */}
      <div className='p-4 border-b border-gray-200 flex items-center justify-between shrink-0'>
        {!isCollapsed && (
          <Link href='/'>
            <h1 className='text-4xl font-bold text-teal-600 logo hover:opacity-80 transition-opacity'>
              Art Neidich
            </h1>
          </Link>
        )}
        {isCollapsed && (
          <Link href='/'>
            <h1 className='text-4xl font-bold text-teal-600 logo hover:opacity-80 transition-opacity'>
              AN
            </h1>
          </Link>
        )}
      </div>

      {/* Navigation */}
      <div className='flex-1 py-4 overflow-y-auto'>
        <div className='px-4'>
          {/* Menu Section */}
          {!isCollapsed && (
            <p className='text-xs font-semibold text-gray-500 tracking-wider mb-3 px-2'>
              Menu
            </p>
          )}

          <div className='space-y-1 mb-8'>
            {menuItems.map((item) => (
              <Link
                href={item.link}
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`w-full flex items-center ${
                  isCollapsed ? "justify-center p-3" : "px-3 py-2.5"
                } rounded-lg transition-all duration-200 ${
                  isItemActive(item)
                    ? "bg-teal-600 text-white font-medium border border-teal-600"
                    : "text-black hover:bg-gray-100"
                }`}>
                <item.icon size={20} className='shrink-0' />
                {!isCollapsed && (
                  <span className='ml-3 text-sm truncate'>{item.label}</span>
                )}
              </Link>
            ))}
          </div>

          {/* Others Section */}
          {!isCollapsed && (
            <p className='text-xs font-semibold text-gray-500 tracking-wider mb-3 px-2'>
              Others
            </p>
          )}

          <div className='space-y-1'>
            {otherItems.map((item) => (
              <Link
                href={item.link}
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`w-full flex items-center ${
                  isCollapsed ? "justify-center p-3" : "px-3 py-2.5"
                } rounded-lg transition-all duration-200 ${
                  isItemActive(item)
                    ? "bg-teal-600 text-white font-medium border border-teal-600"
                    : "text-black hover:bg-gray-100"
                }`}>
                <item.icon size={20} className='shrink-0' />
                {!isCollapsed && (
                  <span className='ml-3 text-sm truncate'>{item.label}</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className='p-4 border-t border-gray-200 shrink-0'>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center ${
            isCollapsed ? "justify-center p-3" : "px-3 py-2.5"
          } rounded-lg transition-all duration-200 text-red-600 hover:bg-red-50 hover:text-red-700 border border-red-200 hover:border-red-300`}>
          <LogOut />
          {!isCollapsed && (
            <span className='ml-3 text-sm font-medium'>Logout</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default DashboardCard;
