"use client";

import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Search,
  MoreVertical,
  Eye,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const MainCard = () => {
  const [showFilter, setShowFilter] = useState(false);
  const filterOptions = ["Assigned", "In Progress", "Submitted", "Overdue"];
  const [selectedFilters, setSelectedFilters] = useState([]);

  const toggleFilter = (option) => {
    if (selectedFilters.includes(option)) {
      setSelectedFilters(selectedFilters.filter((f) => f !== option));
    } else {
      setSelectedFilters([...selectedFilters, option]);
    }
  };

  const clearFilters = () => {
    setSelectedFilters([]);
  };

  // data
  const inspections = [
    {
      fileCode: "123-456789-000",
      orderId: "881321HR",
      address: "45210 Westbridge Avenue, Portland, Oregon 97219",
      inspector: "Sunia Bayton",
      dateOut: "05/11/2025",
      dateSubmitted: "-",
      status: "Assigned",
      statusColor: "bg-gray-100 text-gray-800",
    },
    {
      fileCode: "123-456789-000",
      orderId: "881321HR",
      address: "45210 Westbridge Avenue, Portland, Oregon 97219",
      inspector: "Sunia Bayton",
      dateOut: "05/11/2025",
      dateSubmitted: "-",
      status: "Overdue",
      statusColor: "bg-gray-100 text-gray-800",
    },,
    {
      fileCode: "123-456789-001",
      orderId: "881321HR",
      address: "12345 Elm Drive, Austin, Texas 29001",
      inspector: "Liam O'Reilly",
      dateOut: "05/11/2025",
      dateSubmitted: "-",
      status: "In Progress",
      statusColor: "bg-yellow-100 text-yellow-800",
    },
    {
      fileCode: "123-456789-002",
      orderId: "881321HR",
      address: "1184 Chershver Drive, San Jose, California 95152",
      inspector: "Aisha Pavel",
      dateOut: "05/11/2025",
      dateSubmitted: "23/11/2025",
      status: "Submitted",
      statusColor: "bg-red-100 text-red-800",
    },
    {
      fileCode: "123-456789-003",
      orderId: "881321HR",
      address: "98765 Pine Lane, Seattle, Washington 08501",
      inspector: "Mayo Chow",
      dateOut: "04/11/2025",
      dateSubmitted: "-",
      status: "In Progress",
      statusColor: "bg-yellow-100 text-yellow-800",
    },
    {
      fileCode: "123-456789-000",
      orderId: "881321HR",
      address: "45210 Westbridge Avenue, Portland, Oregon 97219",
      inspector: "Sunia Bayton",
      dateOut: "05/11/2025",
      dateSubmitted: "-",
      status: "Assigned",
      statusColor: "bg-gray-100 text-gray-800",
    },
    {
      fileCode: "123-456789-004",
      orderId: "881321HR",
      address: "67231 Maple Street, San Francisco, California 94103",
      inspector: "Liam Pavel",
      dateOut: "05/11/2025",
      dateSubmitted: "25/11/2025",
      status: "Submitted",
      statusColor: "bg-red-100 text-red-800",
    },
    {
      fileCode: "123-456789-005",
      orderId: "881321HR",
      address: "45210 Westbridge Avenue, Portland, Oregon 97219",
      inspector: "Sofia Martinez",
      dateOut: "06/11/2025",
      dateSubmitted: "18/11/2025",
      status: "Submitted",
      statusColor: "bg-red-100 text-red-800",
    },
    {
      fileCode: "123-456789-002",
      orderId: "881321HR",
      address: "1184 Chershver Drive, San Jose, California 95152",
      inspector: "Aisha Pavel",
      dateOut: "05/11/2025",
      dateSubmitted: "23/11/2025",
      status: "Submitted",
      statusColor: "bg-red-100 text-red-800",
    },
    {
      fileCode: "123-456789-000",
      orderId: "881321HR",
      address: "45210 Westbridge Avenue, Portland, Oregon 97219",
      inspector: "Sunia Bayton",
      dateOut: "05/11/2025",
      dateSubmitted: "-",
      status: "Assigned",
      statusColor: "bg-gray-100 text-gray-800",
    },
    {
      fileCode: "123-456789-000",
      orderId: "881321HR",
      address: "45210 Westbridge Avenue, Portland, Oregon 97219",
      inspector: "Sunia Bayton",
      dateOut: "05/11/2025",
      dateSubmitted: "-",
      status: "Overdue",
      statusColor: "bg-gray-100 text-gray-800",
    },
  ];

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center gap-x-4">
        <p className="text-3xl py-5">Assigned Inspections</p>
        <div className="relative">
          <div
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-x-1 border border-gray-200 p-2 rounded-xl cursor-pointer bg-white"
          >
            <PlusCircle />
            Filter
          </div>

          {showFilter && (
            <div className="absolute mt-2 w-48 bg-white shadow-lg border border-gray-200 rounded-lg p-3 z-10">
              {filterOptions.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-x-2 py-1 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedFilters.includes(option)}
                    onChange={() => toggleFilter(option)}
                  />
                  {option}
                </label>
              ))}

              {selectedFilters.length > 0 && (
                <button
                  onClick={clearFilters}
                  className="btn bg-teal-600 mt-2 text-sm text-white p-2 rounded-xl hover:underline"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 border-b border-gray-200">
                  File Code Details
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
                  Date Submitted
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
              {inspections
                .filter((i) =>
                  selectedFilters.length === 0
                    ? true
                    : selectedFilters.includes(i.status)
                )
                .map((inspection, index) => (
                  <tr key={index} className="hover:bg-gray-50">
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
                        {inspection.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Link href="/view-details/:id">
                        <button className="text-teal-600 hover:text-teal-800 font-medium flex items-center">
                          <Eye size={16} className="mr-1" />
                          View Details
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-center bg-white">
          <div className="flex items-center space-x-4 text-sm">
            <button className="text-gray-700 hover:text-gray-900 font-medium px-2 py-1 rounded hover:bg-gray-100 transition-colors">
              &lt; Previous
            </button>

            <div className="flex items-center space-x-3">
              {[1, 2, 3, 4, 5, 6].map((page) => (
                <button
                  key={page}
                  className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
                    page === 1
                      ? "bg-teal-600 text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}
              <span className="text-gray-500">oo</span>
            </div>

            <button className="text-gray-700 hover:text-gray-900 font-medium px-2 py-1 rounded hover:bg-gray-100 transition-colors">
              Next &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainCard;
