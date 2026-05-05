"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  User,
  CheckCircle,
  Loader2,
  Search,
  X,
  Trash2,
} from "lucide-react";
import { extractErrorMessage } from "../../../../lib/error-utils";
import {
  deleteUser,
  getUsers,
  updateUserStatus,
} from "../../../../action/user.action";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("admins");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [allAdmin, setAllAdmin] = useState([]);
  const [filteredAdmin, setFilteredAdmin] = useState([]);
  const [paginatedAdmin, setPaginatedAdmin] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [actionLoading, setActionLoading] = useState({});
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const itemsPerPage = 10;

  const fetchAllAdmin = useCallback(async (search = "") => {
    try {
      setLoading(true);
      const data = await getUsers(1, 1000, search, "1");

      if (data.success) {
        setAllAdmin(data.data || []);
      } else {
        setError(extractErrorMessage(data, "Failed to load admin list."));
      }
    } catch (err) {
      console.error("Error fetching admin:", err);
      setError(extractErrorMessage(err, "Could not load admin list."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let filtered = [...allAdmin];

    if (activeTab === "admins") {
      filtered = filtered.filter((admin) => admin.isApproved);
    } else {
      filtered = filtered.filter((admin) => !admin.isApproved);
    }

    setFilteredAdmin(filtered);

    const totalFiltered = filtered.length;
    const nextTotalPages = Math.ceil(totalFiltered / itemsPerPage);
    setTotalPages(nextTotalPages || 1);

    if (currentPage > nextTotalPages && nextTotalPages > 0) {
      setCurrentPage(1);
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = filtered.slice(startIndex, endIndex);
    setPaginatedAdmin(paginated);
  }, [allAdmin, activeTab, currentPage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchAllAdmin(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, fetchAllAdmin]);

  useEffect(() => {
    fetchAllAdmin();
  }, [fetchAllAdmin]);

  const triggerSuccess = (message) => {
    setSuccessMessage(message);
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
      setSuccessMessage("");
    }, 3000);
  };

  const getActionLoadingKey = (id, action) => `${id}-${action}`;

  const isActionLoading = (id, action) =>
    Boolean(actionLoading[getActionLoadingKey(id, action)]);

  const handleApprove = async (adminId, adminName) => {
    const loadingKey = getActionLoadingKey(adminId, "approve");

    try {
      setActionLoading((prev) => ({ ...prev, [loadingKey]: true }));
      setActionError("");

      const response = await updateUserStatus(adminId, "approve");

      if (response.success) {
        setAllAdmin((prev) =>
          prev.map((admin) =>
            admin._id === adminId
              ? { ...admin, isApproved: true, isSuspended: false }
              : admin,
          ),
        );
        triggerSuccess(`${adminName} has been approved successfully!`);
      } else {
        setActionError(
          extractErrorMessage(response, "Failed to approve admin."),
        );
      }
    } catch (err) {
      console.error("Error approving admin:", err);
      setActionError(extractErrorMessage(err, "Failed to approve admin."));
    } finally {
      setActionLoading((prev) => ({ ...prev, [loadingKey]: false }));
    }
  };

  const handleDelete = async (adminId, adminName) => {
    const loadingKey = getActionLoadingKey(adminId, "delete");

    try {
      setActionLoading((prev) => ({ ...prev, [loadingKey]: true }));
      setActionError("");

      const response = await deleteUser(adminId);

      if (response.success) {
        setAllAdmin((prev) => prev.filter((admin) => admin._id !== adminId));
        triggerSuccess(`${adminName} has been deleted successfully!`);
      } else {
        setActionError(
          extractErrorMessage(response, "Failed to delete admin."),
        );
      }
    } catch (err) {
      console.error("Error deleting admin:", err);
      setActionError(extractErrorMessage(err, "Failed to delete admin."));
    } finally {
      setActionLoading((prev) => ({ ...prev, [loadingKey]: false }));
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setActionError("");
  };

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

  const getShowingRange = () => {
    const start =
      filteredAdmin.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
    const end = Math.min(currentPage * itemsPerPage, filteredAdmin.length);
    return { start, end, total: filteredAdmin.length };
  };

  const totalApprovedAdmins = allAdmin.filter(
    (admin) => admin.isApproved,
  ).length;
  const totalPendingAdmins = allAdmin.filter(
    (admin) => !admin.isApproved,
  ).length;

  if (loading && paginatedAdmin.length === 0) {
    return (
      <div className='min-h-screen bg-gray-50 p-4 md:p-6 flex items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='animate-spin h-8 w-8 text-teal-600 mx-auto mb-4' />
          <p className='text-gray-600'>Loading admin...</p>
        </div>
      </div>
    );
  }

  const { start, end, total } = getShowingRange();
  const hasFilters = Boolean(searchTerm);
  const isApprovalTab = activeTab === "approvals";

  return (
    <div className='min-h-screen bg-gray-50 p-4 md:p-6'>
      <div>
        <div className='mb-6'>
          <h1 className='text-2xl md:text-3xl font-bold text-gray-800'>
            Admin Management
          </h1>
          <p className='text-gray-600 mt-1'>
            View approved admins and manage pending admin approvals
          </p>
        </div>

        <div className='mb-6 bg-white rounded-xl border border-gray-200 p-2 flex flex-wrap gap-2'>
          <button
            onClick={() => handleTabChange("admins")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "admins"
                ? "bg-teal-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}>
            Admin List ({totalApprovedAdmins})
          </button>
          <button
            onClick={() => handleTabChange("approvals")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "approvals"
                ? "bg-teal-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}>
            Admin Approval List ({totalPendingAdmins})
          </button>
        </div>

        {error && (
          <div className='mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200'>
            <p className='font-medium'>Error: {error}</p>
            <button
              onClick={() => setError(null)}
              className='text-sm text-red-600 hover:text-red-800 underline mt-1'>
              Dismiss
            </button>
          </div>
        )}

        {success && (
          <div className='mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 flex items-center gap-2'>
            <CheckCircle size={20} />
            <span className='text-sm font-medium'>{successMessage}</span>
            <button
              onClick={() => {
                setSuccess(false);
                setSuccessMessage("");
              }}
              className='ml-auto text-green-600 hover:text-green-800'>
              <X size={16} />
            </button>
          </div>
        )}

        {actionError && (
          <div className='mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200'>
            <p className='font-medium'>Error: {actionError}</p>
            <button
              onClick={() => setActionError("")}
              className='text-sm text-red-600 hover:text-red-800 underline mt-1'>
              Dismiss
            </button>
          </div>
        )}

        <div className='flex items-center gap-4 mb-6'>
          <div className='relative flex-1 max-w-md'>
            <Search
              className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
              size={20}
            />
            <input
              type='text'
              placeholder='Search by name, email, or user ID...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'>
                <X size={20} />
              </button>
            )}
          </div>

          {hasFilters && (
            <button
              onClick={() => {
                setSearchTerm("");
                setCurrentPage(1);
              }}
              className='px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'>
              Clear Search
            </button>
          )}
        </div>

        <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
          <div className='hidden md:block overflow-x-auto'>
            {paginatedAdmin.length === 0 ? (
              <div className='p-8 text-center'>
                <User className='mx-auto h-12 w-12 text-gray-300 mb-4' />
                <p className='text-gray-600'>
                  {isApprovalTab
                    ? "No pending admin approval requests found"
                    : "No approved admin found"}
                </p>
                {hasFilters && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setCurrentPage(1);
                    }}
                    className='mt-2 text-sm text-teal-600 hover:text-teal-800'>
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <table className='w-full'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='py-4 px-6 text-left text-sm font-semibold text-gray-700 border-b border-gray-200'>
                      Admin name
                    </th>
                    <th className='py-4 px-6 text-left text-sm font-semibold text-gray-700 border-b border-gray-200'>
                      Email
                    </th>
                    <th className='py-4 px-6 text-left text-sm font-semibold text-gray-700 border-b border-gray-200'>
                      User ID
                    </th>
                    <th className='py-4 px-6 text-left text-sm font-semibold text-gray-700 border-b border-gray-200'>
                      Status
                    </th>
                    {isApprovalTab && (
                      <th className='py-4 px-6 text-left text-sm font-semibold text-gray-700 border-b border-gray-200'>
                        Action
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {paginatedAdmin.map((admin) => {
                    const isApproveLoading = isActionLoading(
                      admin._id,
                      "approve",
                    );
                    const isDeleteLoading = isActionLoading(
                      admin._id,
                      "delete",
                    );

                    return (
                      <tr
                        key={admin._id}
                        className='hover:bg-gray-50 transition-colors'>
                        <td className='py-4 px-6'>
                          <div className='flex items-center space-x-3'>
                            <div className='w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center'>
                              <User size={16} className='text-gray-600' />
                            </div>
                            <div>
                              <span className='text-sm font-medium text-gray-800 block'>
                                {admin.firstName} {admin.lastName}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className='py-4 px-6'>
                          <span className='text-sm text-gray-600'>
                            {admin.email}
                          </span>
                        </td>
                        <td className='py-4 px-6'>
                          <span className='text-sm font-medium text-gray-800'>
                            {admin.userId}
                          </span>
                        </td>
                        <td className='py-4 px-6'>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium ${
                              isApprovalTab
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}>
                            {isApprovalTab ? "Pending" : "Approved"}
                          </span>
                        </td>
                        {isApprovalTab && (
                          <td className='py-4 px-6'>
                            <div className='flex items-center gap-2'>
                              <button
                                onClick={() =>
                                  handleApprove(admin._id, admin.firstName)
                                }
                                disabled={isApproveLoading || isDeleteLoading}
                                className='min-w-[120px] px-4 py-2 text-sm flex gap-x-2 items-center justify-center rounded-lg transition-colors bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50 disabled:cursor-not-allowed'>
                                {isApproveLoading ? (
                                  <>
                                    <Loader2 className='animate-spin h-4 w-4' />
                                    Approving...
                                  </>
                                ) : (
                                  <>
                                    <Check className='text-white' size={16} />
                                    Approve
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() =>
                                  handleDelete(admin._id, admin.firstName)
                                }
                                disabled={isApproveLoading || isDeleteLoading}
                                className='min-w-[110px] px-4 py-2 text-sm flex gap-x-2 items-center justify-center rounded-lg transition-colors bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed'>
                                {isDeleteLoading ? (
                                  <>
                                    <Loader2 className='animate-spin h-4 w-4' />
                                    Deleting...
                                  </>
                                ) : (
                                  <>
                                    <Trash2 className='text-white' size={16} />
                                    Delete
                                  </>
                                )}
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          <div className='md:hidden'>
            {paginatedAdmin.length === 0 ? (
              <div className='p-8 text-center'>
                <User className='mx-auto h-12 w-12 text-gray-300 mb-4' />
                <p className='text-gray-600'>
                  {isApprovalTab
                    ? "No pending admin approval requests found"
                    : "No approved admin found"}
                </p>
                {hasFilters && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setCurrentPage(1);
                    }}
                    className='mt-2 text-sm text-teal-600 hover:text-teal-800'>
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <div className='divide-y divide-gray-200'>
                {paginatedAdmin.map((admin) => {
                  const isApproveLoading = isActionLoading(
                    admin._id,
                    "approve",
                  );
                  const isDeleteLoading = isActionLoading(admin._id, "delete");

                  return (
                    <div key={admin._id} className='p-4 hover:bg-gray-50'>
                      <div className='flex justify-between items-start mb-3'>
                        <div className='flex items-center space-x-3'>
                          <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center'>
                            <User size={18} className='text-gray-600' />
                          </div>
                          <div>
                            <h3 className='font-medium text-gray-800'>
                              {admin.firstName} {admin.lastName}
                            </h3>
                            <p className='text-sm text-gray-600'>
                              {admin.email}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            isApprovalTab
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}>
                          {isApprovalTab ? "Pending" : "Approved"}
                        </span>
                      </div>

                      <div className='grid grid-cols-2 gap-4 mb-4'>
                        <div>
                          <p className='text-xs text-gray-500 mb-1'>User ID</p>
                          <p className='text-sm font-medium text-gray-800'>
                            {admin.userId}
                          </p>
                        </div>
                        <div>
                          <p className='text-xs text-gray-500 mb-1'>Status</p>
                          <p className='text-sm font-medium text-gray-800'>
                            {isApprovalTab ? "Pending Approval" : "Approved"}
                          </p>
                        </div>
                      </div>

                      {isApprovalTab && (
                        <div className='grid grid-cols-2 gap-2'>
                          <button
                            onClick={() =>
                              handleApprove(admin._id, admin.firstName)
                            }
                            disabled={isApproveLoading || isDeleteLoading}
                            className='w-full px-4 py-2 text-sm flex justify-center gap-x-2 items-center rounded-lg transition-colors bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50 disabled:cursor-not-allowed'>
                            {isApproveLoading ? (
                              <>
                                <Loader2 className='animate-spin h-4 w-4' />
                                Approving...
                              </>
                            ) : (
                              <>
                                <Check className='text-white' size={16} />
                                Approve
                              </>
                            )}
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(admin._id, admin.firstName)
                            }
                            disabled={isApproveLoading || isDeleteLoading}
                            className='w-full px-4 py-2 text-sm flex justify-center gap-x-2 items-center rounded-lg transition-colors bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed'>
                            {isDeleteLoading ? (
                              <>
                                <Loader2 className='animate-spin h-4 w-4' />
                                Deleting...
                              </>
                            ) : (
                              <>
                                <Trash2 className='text-white' size={16} />
                                Delete
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {filteredAdmin.length > 0 && totalPages > 1 && (
            <div className='border-t border-gray-200 px-4 md:px-6 py-4'>
              <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
                <div className='text-sm text-gray-600'>
                  Showing {start} to {end} of {total}{" "}
                  {isApprovalTab ? "pending admin" : "admin"}
                  {total !== 1 ? "s" : ""}
                  {hasFilters && (
                    <span className='ml-2 text-teal-600'>• Filtered</span>
                  )}
                </div>

                <div className='flex items-center space-x-4'>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className='flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'>
                    <ChevronLeft size={16} />
                    <span className='hidden sm:inline'>Previous</span>
                  </button>

                  <div className='flex items-center space-x-1'>
                    {getPageNumbers().map((page, index) =>
                      page === "..." ? (
                        <span
                          key={`ellipsis-${index}`}
                          className='text-gray-400 px-1'>
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
                          }`}>
                          {page}
                        </button>
                      ),
                    )}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className='flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'>
                    <span className='hidden sm:inline'>Next</span>
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
