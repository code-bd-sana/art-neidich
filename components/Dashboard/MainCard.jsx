"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  X,
  SortAsc,
} from "lucide-react";
import { getJobs } from "../../action/job.action";
import { extractErrorMessage } from "../../lib/error-utils";

const MainCard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [expandedCard, setExpandedCard] = useState(null);

  const searchTimeoutRef = useRef(null);
  const isInitialMount = useRef(true);

  const filterOptions = [
    { value: "all", label: "All Status" },
    { value: "in_progress", label: "In Progress" },
    { value: "submitted", label: "Submitted" },
    { value: "completed", label: "Completed" },
    { value: "rejected", label: "Rejected" },
  ];

  const sortOptions = [
    { value: "date_desc", label: "Date (Newest)" },
    { value: "date_asc", label: "Date (Oldest)" },
    { value: "location_asc", label: "Location (A-Z)" },
    { value: "location_desc", label: "Location (Z-A)" },
  ];

  const formatDate = (dateString) => {
    if (!dateString || dateString === "-") return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

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

  // Fetch function
  const fetchInspections = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getJobs(
        currentPage,
        itemsPerPage,
        searchTerm,
        selectedStatus,
      );

      if (data.success) {
        const transformedData = data.data.map((job) => ({
          id: job._id,
          fileCode: job.fhaCaseDetailsNo || "N/A",
          orderId: job.orderId || "N/A",
          address: job.streetAddress || "Address not available",
          inspector:
            job.inspector.firstName + " " + job.inspector.lastName ||
            "Unassigned",
          // inspector: job.inspector.email || "Unassigned",
          siteContactName: job.siteContactName || "Unassigned",
          dueDate: formatDate(job.dueDate),
          dateSubmitted: formatDate(job.createdAt),
          reportStatusLabel: job.reportStatusLabel,
          statusColor: getStatusColor(job.reportStatusLabel),
          rawData: job,
        }));
        console.log("data", data);
        setInspections(transformedData);
        setTotalPages(data.metaData?.totalPage || 1);
        setItemsPerPage(data.metaData?.limit || 10);
      } else {
        setError(extractErrorMessage(data, "Failed to load inspections."));
      }
    } catch (error) {
      console.error("Error fetching inspections:", error);
      setError(extractErrorMessage(error, "Failed to load inspections."));
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchTerm, selectedStatus]);

  // Single effect for all fetching
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      fetchInspections();
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    const debounceDelay = searchTerm ? 500 : 0;

    searchTimeoutRef.current = setTimeout(() => {
      fetchInspections();
    }, debounceDelay);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [fetchInspections, searchTerm, currentPage, selectedStatus]);

  // Handler for search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handler to clear search input
  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Handler for filter change
  const handleStatusChange = (statusValue) => {
    setSelectedStatus(statusValue);
    setCurrentPage(1);
    setShowFilter(false);
  };

  // Handler to clear all filters
  const clearFilters = () => {
    setSelectedStatus("all");
    setSearchTerm("");
    setCurrentPage(1);
    setShowFilter(false);
  };

  // Pagination Previous Page handlers
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setExpandedCard(null);
    }
  };

  // Pagination Next page handler
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setExpandedCard(null);
    }
  };

  // Toggle card expansion on mobile
  const toggleCardExpand = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  // Generate page numbers for pagination display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 3;

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

  // Handler for direct page number click
  const handlePageClick = (page) => {
    if (typeof page === "number") {
      setCurrentPage(page);
      setExpandedCard(null);
    }
  };

  // Get label for currently selected filter
  const getCurrentFilterLabel = () => {
    const option = filterOptions.find((opt) => opt.value === selectedStatus);
    return option ? option.label : "All Status";
  };

  // Sorting logic can be implemented here when showSort is toggled
  const handleSortChange = (sortValue) => {
    setSortBy(sortValue);
    setCurrentPage(1);
    setShowSort(false);
  };

  return (
    <div className='min-h-screen bg-gray-50 p-3 md:p-6'>
      <div className='mb-6'>
        <div className='flex items-center justify-between mb-4'>
          <h1 className='text-2xl font-bold text-gray-800'>Inspections</h1>
        </div>

        {error && (
          <div className='mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700'>
            {error}
          </div>
        )}

        {/* Search and Filter Row */}
        <div className='flex flex-col md:flex-row gap-3 mb-4'>
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
                <X size={18} />
              </button>
            )}
          </div>

          {/* Sort By Button - location & date */}
          <div className='flex gap-3'>
            <button
              onClick={() => setShowSort(!showSort)}
              className='px-4 py-3 rounded-lg bg-white border border-gray-300 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors'>
              <SortAsc size={20} />
              <span className='text-sm font-medium'>Sort By</span>
            </button>
          </div>

          {/* Filter Button - Both Mobile & Desktop */}
          <button
            onClick={() => setShowFilter(!showFilter)}
            className='px-4 py-3 rounded-lg bg-white border border-gray-300 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors'>
            <Filter size={20} />
            <span className='text-sm font-medium'>
              {getCurrentFilterLabel()}
            </span>
          </button>
        </div>

        {/* Filter Modal - Works for both Mobile & Desktop */}
        {showFilter && (
          <>
            {/* Backdrop */}
            <div
              className='fixed inset-0 bg-black/50 z-40'
              onClick={() => setShowFilter(false)}
            />

            {/* Modal */}
            <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 p-6'>
              <div className='flex justify-between items-center mb-6'>
                <h2 className='text-xl font-bold text-gray-800'>
                  Filter by Status
                </h2>
                <button
                  onClick={() => setShowFilter(false)}
                  className='text-gray-500 hover:text-gray-700'>
                  <X size={24} />
                </button>
              </div>

              <div className='space-y-2'>
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleStatusChange(option.value)}
                    className={`w-full text-left p-3 rounded-lg text-sm font-medium transition-colors ${
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
                  onClick={clearFilters}
                  className='flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors'>
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilter(false)}
                  className='flex-1 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors'>
                  Apply
                </button>
              </div>
            </div>
          </>
        )}

        {/* Active Filter Badge */}
        {selectedStatus !== "all" && (
          <div className='mb-4'>
            <span className='inline-flex items-center gap-1 px-3 py-1.5 bg-teal-100 text-teal-800 rounded-full text-sm'>
              {getCurrentFilterLabel()}
              <button
                onClick={clearFilters}
                className='text-teal-600 hover:text-teal-800 ml-1'>
                <X size={14} />
              </button>
            </span>
          </div>
        )}
      </div>

      {loading ? (
        <div className='bg-white rounded-xl shadow-sm p-8 flex flex-col items-center justify-center'>
          <Loader2 className='animate-spin text-teal-600 mb-4' size={32} />
          <p className='text-gray-600'>Loading inspections...</p>
        </div>
      ) : (
        <>
          {inspections.length === 0 ? (
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
              {/* Mobile Cards */}
              <div className='md:hidden space-y-4'>
                {inspections.map((inspection) => (
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

                    {expandedCard === inspection.id && (
                      <div className='border-t border-gray-200 p-4 bg-gray-50'>
                        <div className='grid grid-cols-2 gap-4 mb-4'>
                          <div>
                            <p className='text-xs text-gray-500 mb-1'>
                              Due Date
                            </p>
                            <div className='flex items-center gap-2'>
                              <Calendar size={14} className='text-gray-400' />
                              <span className='text-sm font-medium text-gray-800'>
                                {inspection.dueDate}
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className='text-xs text-gray-500 mb-1'>
                              Date Received
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

              {/* Desktop Table */}
              <div className='hidden md:block bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
                <div className='overflow-x-auto'>
                  <table className='w-full'>
                    <thead className='bg-gray-50'>
                      <tr>
                        {/* <th className='py-3 px-4 text-left text-sm font-semibold text-gray-600 border-b border-gray-200'>
                          File Code
                        </th> */}
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
                          Site Contact Name
                        </th>
                        <th className='py-3 px-4 text-left text-sm font-semibold text-gray-600 border-b border-gray-200'>
                          Date Out
                        </th>
                        <th className='py-3 px-4 text-left text-sm font-semibold text-gray-600 border-b border-gray-200'>
                          Date Received
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
                      {inspections.map((inspection) => (
                        <tr key={inspection.id} className='hover:bg-gray-50'>
                          {/* <td className='py-3 px-4 text-sm font-medium text-gray-800'>
                            {inspection.fileCode}
                          </td> */}
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
                            {inspection.siteContactName}
                          </td>
                          <td className='py-3 px-4 text-sm text-gray-600'>
                            {inspection.dueDate}
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

              {/* Pagination */}
              <div className='mt-6'>
                <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
                  <div className='text-sm text-gray-600 order-2 md:order-1'>
                    Page {currentPage} of {totalPages}
                  </div>

                  <div className='flex items-center gap-2 order-1 md:order-2'>
                    <button
                      onClick={handlePrevious}
                      disabled={currentPage === 1}
                      className='px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors'>
                      Previous
                    </button>

                    <div className='hidden md:flex gap-2'>
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
                            className={`w-10 h-10 rounded-lg transition-colors ${
                              currentPage === page
                                ? "bg-teal-600 text-white"
                                : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}>
                            {page}
                          </button>
                        ),
                      )}
                    </div>

                    <button
                      onClick={handleNext}
                      disabled={currentPage === totalPages}
                      className='px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors'>
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
