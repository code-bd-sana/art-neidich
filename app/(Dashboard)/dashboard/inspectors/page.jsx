"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  User,
  Ban,
  CheckCircle,
  Loader2,
  Search,
  X,
  Filter,
  Trash2,
} from "lucide-react";
import { extractErrorMessage } from "../../../../lib/error-utils";
import {
  deleteUser,
  getUsers,
  updateUserStatus,
} from "../../../../action/user.action";

export default function InspectorPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [allInspectors, setAllInspectors] = useState([]);
  const [filteredInspectors, setFilteredInspectors] = useState([]);
  const [paginatedInspectors, setPaginatedInspectors] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [actionLoading, setActionLoading] = useState({});
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [openActionMenuId, setOpenActionMenuId] = useState(null);

  const itemsPerPage = 10;

  const fetchAllInspectors = useCallback(async (search = "") => {
    try {
      setLoading(true);
      const data = await getUsers(1, 1000, search, "2");

      if (data.success) {
        setAllInspectors(data.data || []);
      } else {
        setError(extractErrorMessage(data, "Failed to load inspectors."));
      }
    } catch (err) {
      console.error("Error fetching inspectors:", err);
      setError(extractErrorMessage(err, "Could not load inspectors."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let filtered = [...allInspectors];

    if (filterStatus !== "all") {
      filtered = filtered.filter((inspector) => {
        if (filterStatus === "pending") {
          return !inspector.isApproved;
        }
        if (filterStatus === "active") {
          return inspector.isApproved && !inspector.isSuspended;
        }
        if (filterStatus === "suspended") {
          return inspector.isApproved && inspector.isSuspended === true;
        }
        return true;
      });
    }

    setFilteredInspectors(filtered);

    const totalFiltered = filtered.length;
    const nextTotalPages = Math.ceil(totalFiltered / itemsPerPage);
    setTotalPages(nextTotalPages || 1);

    if (currentPage > nextTotalPages) {
      setCurrentPage(1);
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = filtered.slice(startIndex, endIndex);
    setPaginatedInspectors(paginated);
  }, [allInspectors, filterStatus, currentPage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchAllInspectors(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, fetchAllInspectors]);

  useEffect(() => {
    fetchAllInspectors();
  }, [fetchAllInspectors]);

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

  const handleApprove = async (inspectorId, inspectorName) => {
    const loadingKey = getActionLoadingKey(inspectorId, "approve");

    try {
      setActionLoading((prev) => ({ ...prev, [loadingKey]: true }));
      setActionError("");
      setOpenActionMenuId(null);

      const response = await updateUserStatus(inspectorId, "approve");

      if (response.success) {
        setAllInspectors((prev) =>
          prev.map((inspector) =>
            inspector._id === inspectorId
              ? { ...inspector, isApproved: true, isSuspended: false }
              : inspector,
          ),
        );

        triggerSuccess(`${inspectorName} has been approved successfully!`);
      } else {
        setActionError(
          extractErrorMessage(response, "Failed to approve inspector."),
        );
      }
    } catch (err) {
      console.error("Error approving inspector:", err);
      setActionError(extractErrorMessage(err, "Failed to approve inspector."));
    } finally {
      setActionLoading((prev) => ({ ...prev, [loadingKey]: false }));
    }
  };

  const handleSuspend = async (inspectorId, inspectorName) => {
    const loadingKey = getActionLoadingKey(inspectorId, "suspend");

    try {
      setActionLoading((prev) => ({ ...prev, [loadingKey]: true }));
      setActionError("");
      setOpenActionMenuId(null);

      const response = await updateUserStatus(inspectorId, "suspend");

      if (response.success) {
        setAllInspectors((prev) =>
          prev.map((inspector) =>
            inspector._id === inspectorId
              ? { ...inspector, isSuspended: true }
              : inspector,
          ),
        );

        triggerSuccess(`${inspectorName} has been suspended successfully!`);
      } else {
        setActionError(
          extractErrorMessage(response, "Failed to suspend inspector."),
        );
      }
    } catch (err) {
      console.error("Error suspending inspector:", err);
      setActionError(extractErrorMessage(err, "Failed to suspend inspector."));
    } finally {
      setActionLoading((prev) => ({ ...prev, [loadingKey]: false }));
    }
  };

  const handleUnsuspend = async (inspectorId, inspectorName) => {
    const loadingKey = getActionLoadingKey(inspectorId, "unsuspend");

    try {
      setActionLoading((prev) => ({ ...prev, [loadingKey]: true }));
      setActionError("");
      setOpenActionMenuId(null);

      const response = await updateUserStatus(inspectorId, "unsuspend");

      if (response.success) {
        setAllInspectors((prev) =>
          prev.map((inspector) =>
            inspector._id === inspectorId
              ? { ...inspector, isSuspended: false }
              : inspector,
          ),
        );

        triggerSuccess(`${inspectorName} has been unsuspended successfully!`);
      } else {
        setActionError(
          extractErrorMessage(response, "Failed to unsuspend inspector."),
        );
      }
    } catch (err) {
      console.error("Error unsuspending inspector:", err);
      setActionError(
        extractErrorMessage(err, "Failed to unsuspend inspector."),
      );
    } finally {
      setActionLoading((prev) => ({ ...prev, [loadingKey]: false }));
    }
  };

  const handleDelete = async (inspectorId, inspectorName) => {
    const loadingKey = getActionLoadingKey(inspectorId, "delete");

    try {
      setActionLoading((prev) => ({ ...prev, [loadingKey]: true }));
      setActionError("");
      setOpenActionMenuId(null);

      const response = await deleteUser(inspectorId);

      if (response.success) {
        setAllInspectors((prev) =>
          prev.filter((inspector) => inspector._id !== inspectorId),
        );
        triggerSuccess(`${inspectorName} has been deleted successfully!`);
      } else {
        setActionError(
          extractErrorMessage(response, "Failed to delete inspector."),
        );
      }
    } catch (err) {
      console.error("Error deleting inspector:", err);
      setActionError(extractErrorMessage(err, "Failed to delete inspector."));
    } finally {
      setActionLoading((prev) => ({ ...prev, [loadingKey]: false }));
    }
  };

  const getInspectorActions = (inspector) => {
    const actions = [];

    if (!inspector.isApproved) {
      actions.push({
        key: "approve",
        label: "Approve",
        icon: <Check size={14} />,
        className: "text-teal-700",
        onClick: () => handleApprove(inspector._id, inspector.firstName),
      });
    } else if (inspector.isSuspended) {
      actions.push({
        key: "unsuspend",
        label: "Unsuspend",
        icon: <CheckCircle size={14} />,
        className: "text-green-700",
        onClick: () => handleUnsuspend(inspector._id, inspector.firstName),
      });
    } else {
      actions.push({
        key: "suspend",
        label: "Suspend",
        icon: <Ban size={14} />,
        className: "text-amber-700",
        onClick: () => handleSuspend(inspector._id, inspector.firstName),
      });
    }

    actions.push({
      key: "delete",
      label: "Delete",
      icon: <Trash2 size={14} />,
      className: "text-red-700",
      onClick: () => handleDelete(inspector._id, inspector.firstName),
    });

    return actions;
  };

  const renderActionDropdown = (inspector) => {
    const actions = getInspectorActions(inspector);
    const isAnyActionLoading = actions.some((action) =>
      isActionLoading(inspector._id, action.key),
    );

    return (
      <div className='relative'>
        <button
          onClick={() =>
            setOpenActionMenuId((prev) =>
              prev === inspector._id ? null : inspector._id,
            )
          }
          disabled={isAnyActionLoading}
          className='px-3 py-2 text-sm inline-flex items-center gap-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'>
          {isAnyActionLoading ? (
            <>
              <Loader2 className='animate-spin h-4 w-4' />
              Processing...
            </>
          ) : (
            <>
              Actions
              <ChevronDown size={14} />
            </>
          )}
        </button>

        {openActionMenuId === inspector._id && !isAnyActionLoading && (
          <div className='absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden'>
            {actions.map((action) => (
              <button
                key={action.key}
                onClick={action.onClick}
                className={`w-full px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 ${action.className}`}>
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
    setOpenActionMenuId(null);
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
      filteredInspectors.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
    const end = Math.min(currentPage * itemsPerPage, filteredInspectors.length);
    return { start, end, total: filteredInspectors.length };
  };

  if (loading && paginatedInspectors.length === 0) {
    return (
      <div className='min-h-screen bg-gray-50 p-4 md:p-6 flex items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='animate-spin h-8 w-8 text-teal-600 mx-auto mb-4' />
          <p className='text-gray-600'>Loading inspectors...</p>
        </div>
      </div>
    );
  }

  const { start, end, total } = getShowingRange();
  const hasFilters = searchTerm || filterStatus !== "all";

  return (
    <div className='min-h-screen bg-gray-50 p-4 md:p-6'>
      <div>
        <div className='mb-6'>
          <h1 className='text-2xl md:text-3xl font-bold text-gray-800'>
            Inspector List
          </h1>
          <p className='text-gray-600 mt-1'>
            Manage all inspectors in the system
          </p>
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

        <div className='hidden md:flex items-center gap-4 mb-6'>
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

          <div className='flex items-center gap-2'>
            <span className='text-sm font-medium text-gray-700'>Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
                setOpenActionMenuId(null);
              }}
              className='px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'>
              <option value='all'>All Inspectors</option>
              <option value='pending'>Pending Approval</option>
              <option value='active'>Active</option>
              <option value='suspended'>Suspended</option>
            </select>
          </div>

          {hasFilters && (
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterStatus("all");
                setCurrentPage(1);
                setOpenActionMenuId(null);
              }}
              className='px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'>
              Clear Filters
            </button>
          )}
        </div>

        <div className='md:hidden space-y-3 mb-6'>
          <div className='relative'>
            <Search
              className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
              size={20}
            />
            <input
              type='text'
              placeholder='Search inspectors...'
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

          <div className='flex items-center justify-between'>
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className='flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700'>
              <Filter size={18} />
              Filter
              {hasFilters && (
                <span className='ml-1 bg-teal-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                  !
                </span>
              )}
            </button>

            <div className='text-sm text-gray-600'>
              {total} inspector{total !== 1 ? "s" : ""}
            </div>
          </div>

          {showMobileFilters && (
            <div className='bg-white border border-gray-200 rounded-lg p-4 shadow-sm'>
              <div className='flex justify-between items-center mb-3'>
                <h3 className='font-medium text-gray-800'>Filter by Status</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className='text-gray-500'>
                  <X size={20} />
                </button>
              </div>
              <div className='grid grid-cols-2 gap-2'>
                {["all", "pending", "active", "suspended"].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setFilterStatus(status);
                      setCurrentPage(1);
                      setShowMobileFilters(false);
                      setOpenActionMenuId(null);
                    }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      filterStatus === status
                        ? "bg-teal-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}>
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
                    setOpenActionMenuId(null);
                  }}
                  className='w-full mt-4 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'>
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>

        <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
          <div className='hidden md:block overflow-x-auto'>
            {paginatedInspectors.length === 0 ? (
              <div className='p-8 text-center'>
                <User className='mx-auto h-12 w-12 text-gray-300 mb-4' />
                <p className='text-gray-600'>
                  {hasFilters
                    ? "No inspectors found matching your criteria"
                    : "No inspectors found"}
                </p>
                {hasFilters && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setFilterStatus("all");
                      setCurrentPage(1);
                      setOpenActionMenuId(null);
                    }}
                    className='mt-2 text-sm text-teal-600 hover:text-teal-800'>
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <table className='w-full'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='py-4 px-6 text-left text-sm font-semibold text-gray-700 border-b border-gray-200'>
                      Inspector name
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
                    <th className='py-4 px-6 text-left text-sm font-semibold text-gray-700 border-b border-gray-200'>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {paginatedInspectors.map((inspector) => (
                    <tr
                      key={inspector._id}
                      className='hover:bg-gray-50 transition-colors'>
                      <td className='py-4 px-6'>
                        <div className='flex items-center space-x-3'>
                          <div className='w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center'>
                            <User size={16} className='text-gray-600' />
                          </div>
                          <div>
                            <span className='text-sm font-medium text-gray-800 block'>
                              {inspector.firstName} {inspector.lastName}
                            </span>
                            <span className='text-xs text-gray-500'>
                              {!inspector.isApproved
                                ? "Pending Approval"
                                : inspector.isSuspended
                                  ? "Suspended"
                                  : "Active"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className='py-4 px-6'>
                        <span className='text-sm text-gray-600'>
                          {inspector.email}
                        </span>
                      </td>
                      <td className='py-4 px-6'>
                        <span className='text-sm font-medium text-gray-800'>
                          {inspector.userId}
                        </span>
                      </td>
                      <td className='py-4 px-6'>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            !inspector.isApproved
                              ? "bg-yellow-100 text-yellow-800"
                              : inspector.isSuspended
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                          }`}>
                          {!inspector.isApproved
                            ? "Pending"
                            : inspector.isSuspended
                              ? "Suspended"
                              : "Active"}
                        </span>
                      </td>
                      <td className='py-4 px-6'>
                        {renderActionDropdown(inspector)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className='md:hidden'>
            {paginatedInspectors.length === 0 ? (
              <div className='p-8 text-center'>
                <User className='mx-auto h-12 w-12 text-gray-300 mb-4' />
                <p className='text-gray-600'>
                  {hasFilters
                    ? "No inspectors found matching your criteria"
                    : "No inspectors found"}
                </p>
                {hasFilters && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setFilterStatus("all");
                      setCurrentPage(1);
                      setOpenActionMenuId(null);
                    }}
                    className='mt-2 text-sm text-teal-600 hover:text-teal-800'>
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className='divide-y divide-gray-200'>
                {paginatedInspectors.map((inspector) => (
                  <div key={inspector._id} className='p-4 hover:bg-gray-50'>
                    <div className='flex justify-between items-start mb-3'>
                      <div className='flex items-center space-x-3'>
                        <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center'>
                          <User size={18} className='text-gray-600' />
                        </div>
                        <div>
                          <h3 className='font-medium text-gray-800'>
                            {inspector.firstName} {inspector.lastName}
                          </h3>
                          <p className='text-sm text-gray-600'>
                            {inspector.email}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          !inspector.isApproved
                            ? "bg-yellow-100 text-yellow-800"
                            : inspector.isSuspended
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                        }`}>
                        {!inspector.isApproved
                          ? "Pending"
                          : inspector.isSuspended
                            ? "Suspended"
                            : "Active"}
                      </span>
                    </div>

                    <div className='grid grid-cols-2 gap-4 mb-4'>
                      <div>
                        <p className='text-xs text-gray-500 mb-1'>User ID</p>
                        <p className='text-sm font-medium text-gray-800'>
                          {inspector.userId}
                        </p>
                      </div>
                      <div>
                        <p className='text-xs text-gray-500 mb-1'>Status</p>
                        <p className='text-sm font-medium text-gray-800'>
                          {!inspector.isApproved
                            ? "Pending Approval"
                            : inspector.isSuspended
                              ? "Suspended"
                              : "Active"}
                        </p>
                      </div>
                    </div>

                    <div className='flex justify-end'>
                      {renderActionDropdown(inspector)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {filteredInspectors.length > 0 && totalPages > 1 && (
            <div className='border-t border-gray-200 px-4 md:px-6 py-4'>
              <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
                <div className='text-sm text-gray-600'>
                  Showing {start} to {end} of {total} inspector
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
