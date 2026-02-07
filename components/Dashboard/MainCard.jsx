"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Eye,
  Search,
  Loader2,
  Filter,
  ChevronDown,
  ChevronUp,
  Calendar,
  MapPin,
  User,
  FileText,
} from "lucide-react";
import { getJobs } from "@/action/job.action";

const MainCard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [expandedCard, setExpandedCard] = useState(null);

  // Update filter options to match API status values
  const filterOptions = [
    { value: "all", label: "All Status" },
    { value: "in_progress", label: "In Progress" },
    { value: "submitted", label: "Submitted" },
    { value: "completed", label: "Completed" },
    { value: "rejected", label: "Rejected" },
  ];

  const filterRef = useRef(null);

  // Debounced search function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Fetch inspections function - now includes status parameter
  const fetchInspections = useCallback(
    async (page = 1, limit = 10, search = "", status = "all") => {
      setLoading(true);
      try {
        const data = await getJobs(page, limit, search, status);

        if (data.success) {
          // Transform API data
          const transformedData = data.data.map((job) => ({
            id: job._id,
            fileCode: job.fhaCaseDetailsNo || "N/A",
            orderId: job.orderId || "N/A",
            address: job.streetAddress || "Address not available",
            inspector: job.siteContactName || "Unassigned",
            dateOut: formatDate(job.dueDate),
            dateSubmitted: formatDate(job.createdAt),
            reportStatusLabel: job.reportStatusLabel,
            statusColor: getStatusColor(job.reportStatusLabel),
            rawData: job, // Keep original data for view details
          }));

          setInspections(transformedData);
          setTotalPages(data.metaData?.totalPage || 1);
          setItemsPerPage(data.metaData?.limit || 10);
        }
      } catch (error) {
        console.error("Error fetching inspections:", error);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Initial fetch and fetch when page or status changes
  useEffect(() => {
    fetchInspections(currentPage, itemsPerPage, searchTerm, selectedStatus);
  }, [currentPage, itemsPerPage, selectedStatus, fetchInspections, searchTerm]);

  // Debounced search effect
  useEffect(() => {
    const debouncedSearch = debounce((term) => {
      setCurrentPage(1); // Reset to first page on new search
      fetchInspections(1, itemsPerPage, term, selectedStatus);
    }, 500); // 500ms debounce delay

    debouncedSearch(searchTerm);

    // Cleanup
    return () => {
      // Clear any pending debounced calls if component unmounts
    };
  }, [searchTerm, itemsPerPage, selectedStatus, fetchInspections]);

  // Close filter when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || "";

    if (statusLower.includes("progress")) {
      return "bg-blue-50 text-blue-700";
    } else if (statusLower.includes("complete")) {
      return "bg-green-50 text-green-700";
    } else if (statusLower.includes("reject")) {
      return "bg-red-50 text-red-700";
    } else if (statusLower.includes("submit")) {
      return "bg-yellow-50 text-yellow-700 border border-yellow-200";
    } else {
      return "bg-gray-50 text-gray-700";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === "-") return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  // No frontend filtering needed since backend handles it
  const filteredInspections = inspections; // Use all returned inspections

  // Pagination handlers
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setShowFilter(false);
      setExpandedCard(null);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setShowFilter(false);
      setExpandedCard(null);
    }
  };

  const handleStatusChange = (statusValue) => {
    setSelectedStatus(statusValue);
    setCurrentPage(1); // Reset to first page when status changes
    setShowFilter(false);
  };

  const clearFilters = () => {
    setSelectedStatus("all");
    setSearchTerm("");
    setShowFilter(false);
  };

  const toggleCardExpand = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  // Generate pagination numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 3; // Reduced for mobile

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 2) {
        for (let i = 1; i <= 3; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 1) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 2; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handlePageClick = (page) => {
    if (typeof page === "number") {
      setCurrentPage(page);
      setShowFilter(false);
      setExpandedCard(null);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchTerm("");
  };

  // Get current filter label
  const getCurrentFilterLabel = () => {
    const option = filterOptions.find((opt) => opt.value === selectedStatus);
    return option ? option.label : "All Status";
  };

  return (
    <div className='min-h-screen bg-gray-50 p-3 md:p-6'>
      {/* Mobile Header */}
      <div className='mb-6'>
        <div className='flex items-center justify-between mb-4'>
          <h1 className='text-2xl font-bold text-gray-800'>Inspections</h1>
        </div>

        {/* Search and Filter Row - Side by side on Mobile */}
        <div className='flex items-center gap-3 mb-4'>
          {/* Search Bar - Mobile */}
          <div className='relative flex-1'>
            <input
              type='text'
              placeholder='Search inspections...'
              value={searchTerm}
              onChange={handleSearchChange}
              className='w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base'
            />
            <Search
              className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
              size={20}
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'>
                ✕
              </button>
            )}
          </div>

          {/* Filter Button - Mobile */}
          <button
            onClick={() => setShowFilter(!showFilter)}
            className='p-3 rounded-lg bg-white border border-gray-300 shrink-0 flex items-center gap-2'>
            <Filter size={20} />
            <span className='text-sm font-medium'>
              {getCurrentFilterLabel()}
            </span>
          </button>
        </div>

        {/* Filter Mobile - Full screen overlay */}
        {showFilter && (
          <div className='fixed inset-0 bg-black/50 bg-opacity-50 z-50 md:hidden'>
            <div className='absolute bottom-0 w-full bg-white rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto'>
              <div className='flex justify-between items-center mb-6'>
                <h2 className='text-xl font-bold text-gray-800'>
                  Filter by Status
                </h2>
                <button
                  onClick={() => setShowFilter(false)}
                  className='text-gray-500'>
                  ✕
                </button>
              </div>

              <div className='space-y-2'>
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onMouseDown={(e) => {
                      e.preventDefault(); // Prevent any default behavior
                      handleStatusChange(option.value);
                    }}
                    className={`w-full text-left p-3 rounded-lg text-sm font-medium ${
                      selectedStatus === option.value
                        ? "bg-teal-50 text-teal-700 border border-teal-200"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}>
                    {option.label}
                  </button>
                ))}
              </div>

              <div className='mt-6 flex gap-3'>
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    clearFilters();
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    clearFilters();
                  }}
                  className='flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium'>
                  Clear All
                </button>
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setShowFilter(false);
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    setShowFilter(false);
                  }}
                  className='flex-1 py-3 bg-teal-600 text-white rounded-lg font-medium'>
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filter Desktop */}
        <div
          className='hidden md:flex items-center justify-between mb-6'
          ref={filterRef}>
          <div className='flex items-center gap-3'>
            {selectedStatus !== "all" && (
              <button
                onClick={clearFilters}
                className='text-sm text-gray-600 hover:text-gray-800'>
                Clear filter
              </button>
            )}
          </div>

          <div className='relative'>
            {showFilter && (
              <div className='absolute top-full right-0 -mt-4 w-64 bg-white shadow-xl border border-gray-200 rounded-lg p-3 z-10'>
                <h3 className='font-medium text-gray-800 mb-3'>
                  Filter by Status
                </h3>
                <div className='space-y-2'>
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleStatusChange(option.value)}
                      className={`w-full text-left p-2 rounded text-sm font-medium ${
                        selectedStatus === option.value
                          ? "bg-teal-50 text-teal-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}>
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Active Filter Badge - Mobile */}
        {selectedStatus !== "all" && (
          <div className='mb-4'>
            <span className='inline-flex items-center gap-1 px-3 py-1.5 bg-teal-100 text-teal-800 rounded-full text-sm'>
              {getCurrentFilterLabel()}
              <button
                onClick={clearFilters}
                className='text-teal-600 hover:text-teal-800'>
                ✕
              </button>
            </span>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className='bg-white rounded-xl shadow-sm p-8 flex flex-col items-center justify-center'>
          <Loader2 className='animate-spin text-teal-600 mb-4' size={32} />
          <p className='text-gray-600'>Loading inspections...</p>
        </div>
      ) : (
        <>
          {/* Empty State */}
          {filteredInspections.length === 0 ? (
            <div className='bg-white rounded-xl shadow-sm p-8 text-center'>
              <Search size={48} className='text-gray-300 mx-auto mb-4' />
              <h3 className='text-lg font-medium text-gray-800 mb-2'>
                {searchTerm || selectedStatus !== "all"
                  ? "No matching inspections"
                  : "No inspections available"}
              </h3>
              <p className='text-gray-600 mb-6'>
                {searchTerm || selectedStatus !== "all"
                  ? "Try adjusting your search or filters"
                  : "Check back later for new inspections"}
              </p>
              {(searchTerm || selectedStatus !== "all") && (
                <button
                  onClick={clearFilters}
                  className='px-6 py-3 bg-teal-600 text-white rounded-lg font-medium'>
                  Clear all
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Mobile View - Cards */}
              <div className='md:hidden space-y-4'>
                {filteredInspections.map((inspection) => (
                  <div
                    key={inspection.id}
                    className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
                    <div
                      className='p-4 cursor-pointer'
                      onClick={() => toggleCardExpand(inspection.id)}>
                      <div className='flex justify-between items-start mb-3'>
                        <div>
                          <div className='flex items-center gap-2 mb-1'>
                            <FileText size={16} className='text-gray-400' />
                            <span className='font-medium text-gray-800'>
                              {inspection.fileCode}
                            </span>
                          </div>
                          <span className='text-sm text-gray-600'>
                            Order: {inspection.orderId}
                          </span>
                        </div>
                        <button className='text-gray-400'>
                          {expandedCard === inspection.id ? (
                            <ChevronUp />
                          ) : (
                            <ChevronDown />
                          )}
                        </button>
                      </div>

                      <div className='flex items-center gap-2 mb-2'>
                        <MapPin size={14} className='text-gray-400' />
                        <span className='text-sm text-gray-700 truncate'>
                          {inspection.address}
                        </span>
                      </div>

                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <User size={14} className='text-gray-400' />
                          <span className='text-sm text-gray-700'>
                            {inspection.inspector}
                          </span>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${inspection.statusColor}`}>
                          {inspection.reportStatusLabel}
                        </span>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedCard === inspection.id && (
                      <div className='border-t border-gray-200 p-4 bg-gray-50'>
                        <div className='grid grid-cols-2 gap-4 mb-4'>
                          <div>
                            <p className='text-xs text-gray-500 mb-1'>
                              Date Out
                            </p>
                            <div className='flex items-center gap-2'>
                              <Calendar size={14} className='text-gray-400' />
                              <span className='text-sm font-medium text-gray-800'>
                                {inspection.dateOut}
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className='text-xs text-gray-500 mb-1'>
                              Submitted
                            </p>
                            <div className='flex items-center gap-2'>
                              <Calendar size={14} className='text-gray-400' />
                              <span className='text-sm font-medium text-gray-800'>
                                {inspection.dateSubmitted}
                              </span>
                            </div>
                          </div>
                        </div>

                        <Link href={`/dashboard/view-details/${inspection.id}`}>
                          <button className='w-full py-3 bg-teal-600 text-white rounded-lg font-medium flex items-center justify-center gap-2'>
                            <Eye size={18} />
                            View Details
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Desktop View - Table */}
              <div className='hidden md:block bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
                <div className='overflow-x-auto'>
                  <table className='w-full'>
                    <thead className='bg-gray-50'>
                      <tr>
                        <th className='py-3 px-4 text-left text-sm font-semibold text-gray-600 border-b border-gray-200'>
                          File Code
                        </th>
                        <th className='py-3 px-4 text-left text-sm font-semibold text-gray-600 border-b border-gray-200'>
                          Order ID
                        </th>
                        <th className='py-3 px-4 text-left text-sm font-semibold text-gray-600 border-b border-gray-200'>
                          Address
                        </th>
                        <th className='py-3 px-4 text-left text-sm font-semibold text-gray-600 border-b border-gray-200'>
                          Inspector
                        </th>
                        <th className='py-3 px-4 text-left text-sm font-semibold text-gray-600 border-b border-gray-200'>
                          Date Out
                        </th>
                        <th className='py-3 px-4 text-left text-sm font-semibold text-gray-600 border-b border-gray-200'>
                          Submitted
                        </th>
                        <th className='py-3 px-4 text-left text-sm font-semibold text-gray-600 border-b border-gray-200'>
                          Status
                        </th>
                        <th className='py-3 px-4 text-left text-sm font-semibold text-gray-600 border-b border-gray-200'>
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200'>
                      {filteredInspections.map((inspection) => (
                        <tr key={inspection.id} className='hover:bg-gray-50'>
                          <td className='py-3 px-4 text-sm font-medium text-gray-800'>
                            {inspection.fileCode}
                          </td>
                          <td className='py-3 px-4 text-sm text-gray-600'>
                            {inspection.orderId}
                          </td>
                          <td className='py-3 px-4 text-sm text-gray-600 max-w-xs truncate'>
                            {inspection.address}
                          </td>
                          <td className='py-3 px-4 text-sm text-gray-600'>
                            {inspection.inspector}
                          </td>
                          <td className='py-3 px-4 text-sm text-gray-600'>
                            {inspection.dateOut}
                          </td>
                          <td className='py-3 px-4 text-sm text-gray-600'>
                            {inspection.dateSubmitted}
                          </td>
                          <td className='py-3 px-4'>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${inspection.statusColor}`}>
                              {inspection.reportStatusLabel}
                            </span>
                          </td>
                          <td className='py-3 px-4'>
                            <Link
                              href={`/dashboard/view-details/${inspection.id}`}>
                              <button className='text-teal-600 hover:text-teal-800 font-medium flex items-center hover:underline'>
                                <Eye size={16} className='mr-2' />
                                View
                              </button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination - Mobile */}
              <div className='mt-6 md:hidden'>
                <div className='flex items-center justify-between mb-4'>
                  <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className='px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50'>
                    Previous
                  </button>
                  <span className='text-gray-700 font-medium'>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className='px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50'>
                    Next
                  </button>
                </div>

                <div className='flex justify-center gap-2'>
                  {getPageNumbers().map((page, index) =>
                    page === "..." ? (
                      <span
                        key={`ellipsis-${index}`}
                        className='px-3 py-2 text-gray-500'>
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => handlePageClick(page)}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                          currentPage === page
                            ? "bg-teal-600 text-white"
                            : "border border-gray-300 text-gray-700"
                        }`}>
                        {page}
                      </button>
                    ),
                  )}
                </div>
              </div>

              {/* Pagination - Desktop */}
              <div className='hidden md:block mt-6'>
                <div className='bg-white px-6 py-4 border border-gray-200 rounded-lg flex items-center justify-between'>
                  <div className='text-sm text-gray-600'>
                    Showing {filteredInspections.length} of {inspections.length}{" "}
                    inspections
                  </div>

                  <div className='flex items-center gap-4'>
                    <button
                      onClick={handlePrevious}
                      disabled={currentPage === 1}
                      className='px-4 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50'>
                      Previous
                    </button>

                    <div className='flex items-center gap-2'>
                      {getPageNumbers().map((page, index) =>
                        page === "..." ? (
                          <span
                            key={`ellipsis-${index}`}
                            className='text-gray-500'>
                            ...
                          </span>
                        ) : (
                          <button
                            key={page}
                            onClick={() => handlePageClick(page)}
                            className={`w-8 h-8 rounded ${
                              currentPage === page
                                ? "bg-teal-600 text-white"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}>
                            {page}
                          </button>
                        ),
                      )}
                    </div>

                    <button
                      onClick={handleNext}
                      disabled={currentPage === totalPages}
                      className='px-4 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50'>
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MainCard;
