"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  User,
  Ban,
  CheckCircle,
  Loader2,
  Search,
  X,
  Filter,
} from "lucide-react";
import { getUsers } from "@/action/user.action";
import { updateUserStatus } from "@/action/user.action";

export default function AdminPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [allAdmin, setAllAdmin] = useState([]); // Store ALL fetched Admin
  const [filteredAdmin, setFilteredAdmin] = useState([]); // All filtered Admin
  const [paginatedAdmin, setPaginatedAdmin] = useState([]); // Current page Admin
  const [totalPages, setTotalPages] = useState(1);
  const [actionLoading, setActionLoading] = useState({});
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const itemsPerPage = 10;

  // Fetch ALL admin from API (no pagination on server)
  const fetchAllAdmin = useCallback(async (search = "") => {
    try {
      setLoading(true);
      // Fetch a large number to get all admin
      const data = await getUsers(1, 1000, search, "1");

      if (data.success) {
        setAllAdmin(data.data || []);
      } else {
        setError(data.message || "Failed to load Admin");
      }
    } catch (err) {
      console.error("Error fetching Admin:", err);
      setError("Could not load Admin");
    } finally {
      setLoading(false);
    }
  }, []);

  // Apply filtering and pagination
  useEffect(() => {
    let filtered = [...allAdmin];

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((admin) => {
        if (filterStatus === "pending") {
          return !admin.isApproved;
        }
        if (filterStatus === "active") {
          return admin.isApproved && !admin.isSuspended;
        }
        if (filterStatus === "suspended") {
          return admin.isApproved && admin.isSuspended === true;
        }
        return true;
      });
    }

    setFilteredAdmin(filtered);

    // Calculate total pages
    const totalFiltered = filtered.length;
    const totalPages = Math.ceil(totalFiltered / itemsPerPage);
    setTotalPages(totalPages || 1);

    // Reset to page 1 if current page is beyond total pages
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }

    // Get paginated admin for current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = filtered.slice(startIndex, endIndex);
    setPaginatedAdmin(paginated);
  }, [allAdmin, filterStatus, currentPage]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1); // Reset to page 1 on search
      fetchAllAdmin(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Initial load
  useEffect(() => {
    fetchAllAdmin();
  }, [fetchAllAdmin]);

  // Handle approve action
  const handleApprove = async (adminId, adminName) => {
    try {
      setActionLoading((prev) => ({ ...prev, [adminId]: true }));
      setActionError(""); // Clear any previous errors

      const response = await updateUserStatus(adminId, "approve");

      if (response.success) {
        // Update the specific admin in our state
        setAllAdmin((prev) =>
          prev.map((admin) =>
            admin._id === adminId
              ? { ...admin, isApproved: true, isSuspended: false }
              : admin
          )
        );

        // Show success message
        setSuccessMessage(`${adminName} has been approved successfully!`);
        setSuccess(true);

        // Hide success message after 3 seconds
        setTimeout(() => {
          setSuccess(false);
          setSuccessMessage("");
        }, 3000);
      } else {
        setActionError(response.message || "Failed to approve admin");
      }
    } catch (err) {
      console.error("Error approving admin:", err);
      setActionError("Failed to approve admin");
    } finally {
      setActionLoading((prev) => ({ ...prev, [adminId]: false }));
    }
  };

  // Handle suspend action
  const handleSuspend = async (adminId, adminName) => {
    try {
      setActionLoading((prev) => ({ ...prev, [adminId]: true }));
      setActionError("");

      const response = await updateUserStatus(adminId, "suspend");

      if (response.success) {
        setAllAdmin((prev) =>
          prev.map((admin) =>
            admin._id === adminId
              ? { ...admin, isSuspended: true }
              : admin
          )
        );

        // Show success message
        setSuccessMessage(`${adminName} has been suspended successfully!`);
        setSuccess(true);

        setTimeout(() => {
          setSuccess(false);
          setSuccessMessage("");
        }, 3000);
      } else {
        setActionError(response.message || "Failed to suspend admin");
      }
    } catch (err) {
      console.error("Error suspending admin:", err);
      setActionError("Failed to suspend admin");
    } finally {
      setActionLoading((prev) => ({ ...prev, [adminId]: false }));
    }
  };

  // Handle unsuspend action
  const handleUnsuspend = async (adminId,adminName) => {
    try {
      setActionLoading((prev) => ({ ...prev, [adminId]: true }));
      setActionError("");

      const response = await updateUserStatus(adminId, "unsuspend");

      if (response.success) {
        setAllAdmin((prev) =>
          prev.map((admin) =>
            admin._id === adminId
              ? { ...admin, isSuspended: false }
              : admin
          )
        );

        // Show success message
        setSuccessMessage(
          `${adminName} has been unsuspended successfully!`
        );
        setSuccess(true);

        setTimeout(() => {
          setSuccess(false);
          setSuccessMessage("");
        }, 3000);
      } else {
        setActionError(response.message || "Failed to unsuspend admin");
      }
    } catch (err) {
      console.error("Error unsuspending admin:", err);
      setActionError("Failed to unsuspend admin");
    } finally {
      setActionLoading((prev) => ({ ...prev, [adminId]: false }));
    }
  };
  // Determine action button based on admin status
  const getActionButton = (admin) => {
    if (!admin.isApproved) {
      return {
        text: "Approve",
        color: "bg-teal-600 hover:bg-teal-700 text-white",
        icon: <Check className="text-white" size={16} />,
        onClick: () => handleApprove(admin._id, admin.firstName),
      };
    } else if (admin.isSuspended) {
      return {
        text: "Unsuspend",
        color: "bg-green-600 hover:bg-green-700 text-white",
        icon: <CheckCircle className="text-white" size={16} />,
        onClick: () => handleUnsuspend(admin._id, admin.firstName),
      };
    } else {
      return {
        text: "Suspend",
        color: "bg-red-600 hover:bg-red-700 text-white",
        icon: <Ban className="text-white" size={16} />,
        onClick: () => handleSuspend(admin._id, admin.firstName),
      };
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Calculate showing range
  const getShowingRange = () => {
    const start =
      filteredAdmin.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
    const end = Math.min(currentPage * itemsPerPage, filteredAdmin.length);
    return { start, end, total: filteredAdmin.length };
  };

  if (loading && paginatedAdmin.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 text-teal-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading admin...</p>
        </div>
      </div>
    );
  }

  const { start, end, total } = getShowingRange();
  const hasFilters = searchTerm || filterStatus !== "all";

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Admin List
          </h1>
          <p className="text-gray-600 mt-1">
            Manage all admin in the system
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
            <p className="font-medium">Error: {error}</p>
            <button
              onClick={() => setError(null)}
              className="text-sm text-red-600 hover:text-red-800 underline mt-1"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 flex items-center gap-2">
            <CheckCircle size={20} />
            <span className="text-sm font-medium">{successMessage}</span>
            <button
              onClick={() => {
                setSuccess(false);
                setSuccessMessage("");
              }}
              className="ml-auto text-green-600 hover:text-green-800"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Action Error Message */}
        {actionError && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
            <p className="font-medium">Error: {actionError}</p>
            <button
              onClick={() => setActionError("")}
              className="text-sm text-red-600 hover:text-red-800 underline mt-1"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Search and Filter Bar - Desktop */}
        <div className="hidden md:flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by name, email, or user ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Status Filter - Desktop */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">All Admin</option>
              <option value="pending">Pending Approval</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {hasFilters && (
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterStatus("all");
                setCurrentPage(1);
              }}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Search and Filter Bar - Mobile */}
        <div className="md:hidden space-y-3 mb-6">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search admin..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
            >
              <Filter size={18} />
              Filter
              {hasFilters && (
                <span className="ml-1 bg-teal-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  !
                </span>
              )}
            </button>

            <div className="text-sm text-gray-600">
              {total} Admin{total !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Mobile Filters Dropdown */}
          {showMobileFilters && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-800">Filter by Status</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {["all", "pending", "active", "suspended"].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setFilterStatus(status);
                      setCurrentPage(1);
                      setShowMobileFilters(false);
                    }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      filterStatus === status
                        ? "bg-teal-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {status === "all" && "All"}
                    {status === "pending" && "Pending"}
                    {status === "active" && "Active"}
                    {status === "suspended" && "Suspended"}
                  </button>
                ))}
              </div>
              {hasFilters && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterStatus("all");
                    setCurrentPage(1);
                    setShowMobileFilters(false);
                  }}
                  className="w-full mt-4 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            {paginatedAdmin.length === 0 ? (
              <div className="p-8 text-center">
                <User className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-600">
                  {hasFilters
                    ? "No admin found matching your criteria"
                    : "No admin found"}
                </p>
                {hasFilters && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setFilterStatus("all");
                      setCurrentPage(1);
                    }}
                    className="mt-2 text-sm text-teal-600 hover:text-teal-800"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                      Admin name
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                      Email
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                      User ID
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                      Status
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedAdmin.map((admin) => {
                    const action = getActionButton(admin);
                    const isLoading = actionLoading[admin._id];

                    return (
                      <tr
                        key={admin._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <User size={16} className="text-gray-600" />
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-800 block">
                                {admin.firstName} {admin.lastName}
                              </span>
                              <span className="text-xs text-gray-500">
                                {!admin.isApproved
                                  ? "Pending Approval"
                                  : admin.isSuspended
                                  ? "Suspended"
                                  : "Active"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-gray-600">
                            {admin.email}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm font-medium text-gray-800">
                            {admin.userId}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              !admin.isApproved
                                ? "bg-yellow-100 text-yellow-800"
                                : admin.isSuspended
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {!admin.isApproved
                              ? "Pending"
                              : admin.isSuspended
                              ? "Suspended"
                              : "Active"}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <button
                            onClick={action.onClick}
                            disabled={isLoading}
                            className={`px-4 py-2 text-sm flex gap-x-2 items-center rounded-lg transition-colors ${action.color} disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {isLoading ? (
                              <Loader2 className="animate-spin h-4 w-4" />
                            ) : (
                              <>
                                {action.icon}
                                {action.text}
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden">
            {paginatedAdmin.length === 0 ? (
              <div className="p-8 text-center">
                <User className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-600">
                  {hasFilters
                    ? "No admin found matching your criteria"
                    : "No admin found"}
                </p>
                {hasFilters && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setFilterStatus("all");
                      setCurrentPage(1);
                    }}
                    className="mt-2 text-sm text-teal-600 hover:text-teal-800"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {paginatedAdmin.map((admin) => {
                  const action = getActionButton(admin);
                  const isLoading = actionLoading[admin._id];

                  return (
                    <div key={admin._id} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User size={18} className="text-gray-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800">
                              {admin.firstName} {admin.lastName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {admin.email}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            !admin.isApproved
                              ? "bg-yellow-100 text-yellow-800"
                              : admin.isSuspended
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {!admin.isApproved
                            ? "Pending"
                            : admin.isSuspended
                            ? "Suspended"
                            : "Active"}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">User ID</p>
                          <p className="text-sm font-medium text-gray-800">
                            {admin.userId}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Status</p>
                          <p className="text-sm font-medium text-gray-800">
                            {!admin.isApproved
                              ? "Pending Approval"
                              : admin.isSuspended
                              ? "Suspended"
                              : "Active"}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={action.onClick}
                        disabled={isLoading}
                        className={`w-full px-4 py-2 text-sm flex justify-center gap-x-2 items-center rounded-lg transition-colors ${action.color} disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {isLoading ? (
                          <Loader2 className="animate-spin h-4 w-4" />
                        ) : (
                          <>
                            {action.icon}
                            {action.text}
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredAdmin.length > 0 && totalPages > 1 && (
            <div className="border-t border-gray-200 px-4 md:px-6 py-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  Showing {start} to {end} of {total} admin
                  {total !== 1 ? "s" : ""}
                  {hasFilters && (
                    <span className="ml-2 text-teal-600">• Filtered</span>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  {/* Previous Button */}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={16} />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center space-x-1">
                    {getPageNumbers().map((page, index) =>
                      page === "..." ? (
                        <span
                          key={`ellipsis-${index}`}
                          className="text-gray-400 px-1"
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 flex items-center justify-center text-sm rounded transition-colors ${
                            currentPage === page
                              ? "bg-teal-600 text-white font-semibold"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
