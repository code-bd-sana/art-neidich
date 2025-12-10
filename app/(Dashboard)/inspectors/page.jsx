"use client";

import { useState } from "react";
import { Check, ChevronLeft, ChevronRight, MoreVertical, Trash, User } from "lucide-react";

export default function InspectorPage() {
  const [currentPage, setCurrentPage] = useState(1);

  // Inspector data matching your image
  const inspectors = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@gmail.com",
      feeStatus: "-",
      agreedFee: "-",
      action: "Approve",
      actionColor: "text-teal-600 hover:text-teal-700"
    },
    {
      id: 2,
      name: "John Doe",
      email: "john.doe@gmail.com",
      feeStatus: "-",
      agreedFee: "-",
      action: "Approve",
      actionColor: "text-teal-600 hover:text-teal-700"
    },
    {
      id: 3,
      name: "John Doe",
      email: "john.doe@gmail.com",
      feeStatus: "-",
      agreedFee: "-",
      action: "Approve",
      actionColor: "text-teal-600 hover:text-teal-700"
    },
    {
      id: 4,
      name: "John Doe",
      email: "john.doe@gmail.com",
      feeStatus: "Rush Order",
      agreedFee: "$300",
      action: "Remove",
      actionColor: "text-red-600 hover:text-red-700"
    },
    {
      id: 5,
      name: "John Doe",
      email: "john.doe@gmail.com",
      feeStatus: "Long Distance",
      agreedFee: "$400",
      action: "Remove",
      actionColor: "text-red-600 hover:text-red-700"
    },
    {
      id: 6,
      name: "John Doe",
      email: "john.doe@gmail.com",
      feeStatus: "Occupied Fee",
      agreedFee: "$100",
      action: "Remove",
      actionColor: "text-red-600 hover:text-red-700"
    },
    {
      id: 7,
      name: "John Doe",
      email: "john.doe@gmail.com",
      feeStatus: "Standard Fee",
      agreedFee: "$50+",
      action: "Remove",
      actionColor: "text-red-600 hover:text-red-700"
    },
    {
      id: 8,
      name: "John Doe",
      email: "john.doe@gmail.com",
      feeStatus: "Rush Order",
      agreedFee: "$300",
      action: "Remove",
      actionColor: "text-red-600 hover:text-red-700"
    },
    {
      id: 9,
      name: "John Doe",
      email: "john.doe@gmail.com",
      feeStatus: "Long Distance",
      agreedFee: "$400",
      action: "Remove",
      actionColor: "text-red-600 hover:text-red-700"
    },
    {
      id: 10,
      name: "John Doe",
      email: "john.doe@gmail.com",
      feeStatus: "Modified Fee",
      agreedFee: "$200",
      action: "Remove",
      actionColor: "text-red-600 hover:text-red-700"
    }
  ];

  // Handle actions
  const handleAction = (inspectorId, action) => {
    console.log(`Clicked ${action} for inspector ${inspectorId}`);
    // Add your action logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div >
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Inspector List</h1>
          <p className="text-gray-600 mt-1">Manage all inspectors in the system</p>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                    Inspector name
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                    Email
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                    Fee status
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                    Agreed fee
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {inspectors.map((inspector) => (
                  <tr key={inspector.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <User size={16} className="text-gray-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-800">
                          {inspector.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-600">{inspector.email}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-sm font-medium ${
                        inspector.feeStatus === "-" 
                          ? "text-gray-500" 
                          : "text-gray-800"
                      }`}>
                        {inspector.feeStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-sm font-medium ${
                        inspector.agreedFee === "-" 
                          ? "text-gray-500" 
                          : "text-gray-800"
                      }`}>
                        {inspector.agreedFee}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleAction(inspector.id, inspector.action)}
                        className={`py-1.5 text-sm flex gap-x-2 items-center rounded-lg transition-colors ${inspector.actionColor}`}
                      >
                        {inspector.action} {inspector.action === "Approve" ? <Check className=" text-teal-600"/> : <Trash className="text-sm text-red-500"/>}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex items-center justify-center space-x-4">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
                <span>Previous</span>
              </button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5, 6].map((page) => (
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
                ))}
                
                {/* Ellipsis */}
                <span className="text-gray-400 px-1">--</span>
              </div>

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage(Math.min(6, currentPage + 1))}
                disabled={currentPage === 6}
                className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Add New Inspector Button */}
        <div className="mt-6 flex justify-end">
          <button className="px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-2">
            <User size={18} />
            <span>Add New Inspector</span>
          </button>
        </div>
      </div>
    </div>
  );
}