"use client";

import { useState, useEffect, useRef } from "react";
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
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);

  const filterOptions = ["In Progress", "Submitted", "Completed", "Rejected"];
  const filterRef = useRef(null);

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

  useEffect(() => {
    // Fetch inspections from API
    const fetchInspections = async (page = 1, limit = 10) => {
      setLoading(true);
      try {
        const data = await getJobs(page, limit);

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
    };
    fetchInspections(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-50 text-blue-700";
      case "Completed":
        return "bg-green-50 text-green-700";
      case "Rejected":
        return "bg-red-50 text-red-700";
      default:
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

  // Filter and search logic
  const filteredInspections = inspections.filter((inspection) => {
    const matchesSearch =
      inspection.fileCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.inspector.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      selectedFilters.length === 0 ||
      selectedFilters.includes(inspection.reportStatusLabel);

    return matchesSearch && matchesFilter;
  });

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

  const toggleFilter = (option) => {
    if (selectedFilters.includes(option)) {
      setSelectedFilters(selectedFilters.filter((f) => f !== option));
    } else {
      setSelectedFilters([...selectedFilters, option]);
    }
  };

  const clearFilters = () => {
    setSelectedFilters([]);
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

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-6">
      {/* Mobile Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Inspections</h1>
        </div>

        {/* Search and Filter Row - Side by side on Mobile */}
        <div className="flex items-center gap-3 mb-4">
          {/* Search Bar - Mobile */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search inspections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>

          {/* Filter Button - Mobile */}
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="p-3 rounded-lg bg-white border border-gray-300 shrink-0"
          >
            <Filter size={20} />
          </button>
        </div>

        {/* Filter Mobile - Full screen overlay */}
        {showFilter && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
            <div className="absolute bottom-0 w-full bg-white rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Filter</h2>
                <button
                  onClick={() => setShowFilter(false)}
                  className="text-gray-500"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-gray-800">Status</h3>
                {filterOptions.map((option) => (
                  <label
                    key={option}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <span className="text-gray-700">{option}</span>
                    <input
                      type="checkbox"
                      checked={selectedFilters.includes(option)}
                      onChange={() => toggleFilter(option)}
                      className="h-5 w-5 text-teal-600"
                    />
                  </label>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={clearFilters}
                  className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilter(false)}
                  className="flex-1 py-3 bg-teal-600 text-white rounded-lg font-medium"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filter Desktop */}
        <div
          className="hidden md:flex items-center justify-between mb-6"
          ref={filterRef}
        >
          <div className="flex items-center gap-3">
            {selectedFilters.length > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Clear all
              </button>
            )}
          </div>

          {showFilter && (
            <div className="absolute top-52 left-1/2 transform -translate-x-1/2 w-64 bg-white shadow-xl border border-gray-200 rounded-lg p-4 z-10 md:left-auto md:right-6 md:transform-none">
              <h3 className="font-medium text-gray-800 mb-3">
                Filter by Status
              </h3>
              <div className="space-y-2">
                {filterOptions.map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedFilters.includes(option)}
                      onChange={() => toggleFilter(option)}
                      className="h-4 w-4 text-teal-600"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Active Filters - Mobile */}
        {selectedFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedFilters.map((filter) => (
              <span
                key={filter}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-100 text-teal-800 rounded-full text-sm"
              >
                {filter}
                <button
                  onClick={() => toggleFilter(filter)}
                  className="text-teal-600 hover:text-teal-800"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm p-8 flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-teal-600 mb-4" size={32} />
          <p className="text-gray-600">Loading inspections...</p>
        </div>
      ) : (
        <>
          {/* Empty State */}
          {filteredInspections.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <Search size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                {searchTerm || selectedFilters.length > 0
                  ? "No matching inspections"
                  : "No inspections available"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedFilters.length > 0
                  ? "Try adjusting your search or filters"
                  : "Check back later for new inspections"}
              </p>
              {(searchTerm || selectedFilters.length > 0) && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedFilters([]);
                  }}
                  className="px-6 py-3 bg-teal-600 text-white rounded-lg font-medium"
                >
                  Clear all
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Mobile View - Cards */}
              <div className="md:hidden space-y-4">
                {filteredInspections.map((inspection) => (
                  <div
                    key={inspection.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                  >
                    <div
                      className="p-4 cursor-pointer"
                      onClick={() => toggleCardExpand(inspection.id)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <FileText size={16} className="text-gray-400" />
                            <span className="font-medium text-gray-800">
                              {inspection.fileCode}
                            </span>
                          </div>
                          <span className="text-sm text-gray-600">
                            Order: {inspection.orderId}
                          </span>
                        </div>
                        <button className="text-gray-400">
                          {expandedCard === inspection.id ? (
                            <ChevronUp />
                          ) : (
                            <ChevronDown />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <MapPin size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-700 truncate">
                          {inspection.address}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-700">
                            {inspection.inspector}
                          </span>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${inspection.statusColor}`}
                        >
                          {inspection.reportStatusLabel}
                        </span>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedCard === inspection.id && (
                      <div className="border-t border-gray-200 p-4 bg-gray-50">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              Date Out
                            </p>
                            <div className="flex items-center gap-2">
                              <Calendar size={14} className="text-gray-400" />
                              <span className="text-sm font-medium text-gray-800">
                                {inspection.dateOut}
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              Submitted
                            </p>
                            <div className="flex items-center gap-2">
                              <Calendar size={14} className="text-gray-400" />
                              <span className="text-sm font-medium text-gray-800">
                                {inspection.dateSubmitted}
                              </span>
                            </div>
                          </div>
                        </div>

                        <Link href={`/dashboard/view-details/${inspection.id}`}>
                          <button className="w-full py-3 bg-teal-600 text-white rounded-lg font-medium flex items-center justify-center gap-2">
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
              <div className="hidden md:block bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 border-b border-gray-200">
                          File Code
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 border-b border-gray-200">
                          Order ID
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 border-b border-gray-200">
                          Address
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 border-b border-gray-200">
                          Inspector
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 border-b border-gray-200">
                          Date Out
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 border-b border-gray-200">
                          Submitted
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 border-b border-gray-200">
                          Status
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 border-b border-gray-200">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredInspections.map((inspection) => (
                        <tr key={inspection.id} className="hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm font-medium text-gray-800">
                            {inspection.fileCode}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {inspection.orderId}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate">
                            {inspection.address}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {inspection.inspector}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {inspection.dateOut}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {inspection.dateSubmitted}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${inspection.statusColor}`}
                            >
                              {inspection.reportStatusLabel}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <Link
                              href={`/dashboard/view-details/${inspection.id}`}
                            >
                              <button className="text-teal-600 hover:text-teal-800 font-medium flex items-center hover:underline">
                                <Eye size={16} className="mr-2" />
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
              <div className="mt-6 md:hidden">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-gray-700 font-medium">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>

                <div className="flex justify-center gap-2">
                  {getPageNumbers().map((page, index) =>
                    page === "..." ? (
                      <span
                        key={`ellipsis-${index}`}
                        className="px-3 py-2 text-gray-500"
                      >
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
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Pagination - Desktop */}
              <div className="hidden md:block mt-6">
                <div className="bg-white px-6 py-4 border border-gray-200 rounded-lg flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing {filteredInspections.length} of {inspections.length}{" "}
                    inspections
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={handlePrevious}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50"
                    >
                      Previous
                    </button>

                    <div className="flex items-center gap-2">
                      {getPageNumbers().map((page, index) =>
                        page === "..." ? (
                          <span
                            key={`ellipsis-${index}`}
                            className="text-gray-500"
                          >
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
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}
                    </div>

                    <button
                      onClick={handleNext}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50"
                    >
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
