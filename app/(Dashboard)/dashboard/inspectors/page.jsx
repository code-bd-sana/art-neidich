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


// "use client";

// import { useState, useEffect } from "react";
// import { Check, ChevronLeft, ChevronRight, MoreVertical, Trash, User, Loader2, Search } from "lucide-react";
// import { getJobs } from "@/action/job.action";

// export default function InspectorPage() {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [inspectors, setInspectors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalInspectors, setTotalInspectors] = useState(0);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [itemsPerPage, setItemsPerPage] = useState(10);

//   // Fetch inspectors from API
//   const fetchInspectors = async (page = 1, limit = 10) => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       // Fixed: Call getJobs with parameters correctly
//       const data = await getJobs(page, limit);
      
//       console.log("API Response:", data);

//       if (data.success) {
//         // Transform API data to match your table structure
//         const transformedData = data.data.map((job, index) => ({
//           id: job._id || index,
//           name: `${job.createdBy?.firstName || 'Unknown'} ${job.createdBy?.lastName || ''}`.trim(),
//           email: job.createdBy?.email || 'N/A',
//           feeStatus: job.feeStatus || '-',
//           agreedFee: job.agreedFee ? `$${job.agreedFee}` : '-',
//           action: job.inspector?.role === "Unknown" ? "Approve" : "Remove",
//           actionColor: job.inspector?.role === "Unknown" ? "text-teal-600 hover:text-teal-700" : "text-red-600 hover:text-red-700",
//           // Additional fields from API if needed
//           orderId: job.orderId,
//           streetAddress: job.streetAddress,
//           formType: job.formType,
//           createdAt: job.createdAt,
//           dueDate: job.dueDate
//         }));
        
//         setInspectors(transformedData);
//         setTotalPages(data.metaData?.totalPage || 1);
//         setTotalInspectors(data.metaData?.totalJob || 0);
//         setItemsPerPage(data.metaData?.limit || 10);
//       } else {
//         throw new Error(data.message || 'Failed to fetch inspectors');
//       }
//     } catch (err) {
//       setError(err.message);
//       console.error('Error fetching inspectors:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch data when page changes
//   useEffect(() => {
//     fetchInspectors(currentPage);
//   }, [currentPage]);

//   // Handle page change
//   const handlePageChange = (page) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//       fetchInspectors(page);
//     }
//   };

//   // Handle actions
//   const handleAction = async (inspectorId, action) => {
//     console.log(`Clicked ${action} for inspector ${inspectorId}`);
    
//     try {
//       // Update API when action is performed
//       // This is a placeholder - update with your actual API endpoint
//       const response = await fetch(`/api/v1/job/${inspectorId}`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           status: action === "Approve" ? "approved" : "removed"
//         })
//       });
      
//       if (response.ok) {
//         // Refresh the data
//         fetchInspectors(currentPage);
//       }
//     } catch (error) {
//       console.error('Error performing action:', error);
//     }
//   };

//   // Handle search
//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   // Filter inspectors based on search term
//   const filteredInspectors = inspectors.filter(inspector => 
//     inspector.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     inspector.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     inspector.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     inspector.feeStatus.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Generate page numbers for pagination
//   const getPageNumbers = () => {
//     const pages = [];
//     const maxPagesToShow = 5;
    
//     if (totalPages <= maxPagesToShow) {
//       // Show all pages if total pages is less than max
//       for (let i = 1; i <= totalPages; i++) {
//         pages.push(i);
//       }
//     } else {
//       // Show limited pages with ellipsis
//       if (currentPage <= 3) {
//         // Near the start
//         for (let i = 1; i <= 4; i++) {
//           pages.push(i);
//         }
//         pages.push('...');
//         pages.push(totalPages);
//       } else if (currentPage >= totalPages - 2) {
//         // Near the end
//         pages.push(1);
//         pages.push('...');
//         for (let i = totalPages - 3; i <= totalPages; i++) {
//           pages.push(i);
//         }
//       } else {
//         // In the middle
//         pages.push(1);
//         pages.push('...');
//         pages.push(currentPage - 1);
//         pages.push(currentPage);
//         pages.push(currentPage + 1);
//         pages.push('...');
//         pages.push(totalPages);
//       }
//     }
    
//     return pages;
//   };

//   // Format date for display
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-3 md:p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-6">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <div>
//               <h1 className="text-xl md:text-3xl font-bold text-gray-800">Inspector List</h1>
//               <p className="text-gray-600 mt-1 text-sm md:text-base">
//                 {loading ? 'Loading...' : `Total ${totalInspectors} inspectors found`}
//               </p>
//             </div>
            
//             {/* Search Bar */}
//             <div className="relative">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                 <input
//                   type="text"
//                   placeholder="Search inspectors..."
//                   value={searchTerm}
//                   onChange={handleSearch}
//                   className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//           <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//             <p className="text-sm text-gray-600">Total Inspectors</p>
//             <p className="text-2xl font-bold text-gray-800">{totalInspectors}</p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//             <p className="text-sm text-gray-600">Active Jobs</p>
//             <p className="text-2xl font-bold text-gray-800">
//               {inspectors.filter(i => i.action === "Approve").length}
//             </p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//             <p className="text-sm text-gray-600">Pending Approval</p>
//             <p className="text-2xl font-bold text-gray-800">
//               {inspectors.filter(i => i.action === "Remove").length}
//             </p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//             <p className="text-sm text-gray-600">Current Page</p>
//             <p className="text-2xl font-bold text-gray-800">{currentPage} / {totalPages}</p>
//           </div>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
//             <p className="text-red-600">Error: {error}</p>
//             <button
//               onClick={() => fetchInspectors(currentPage)}
//               className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
//             >
//               Retry
//             </button>
//           </div>
//         )}

//         {/* Table Container */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//           {loading ? (
//             // Loading State
//             <div className="flex justify-center items-center py-20">
//               <Loader2 className="animate-spin text-teal-600" size={32} />
//               <span className="ml-3 text-gray-600">Loading inspectors...</span>
//             </div>
//           ) : (
//             <>
//               {/* Table - Mobile View */}
//               <div className="md:hidden">
//                 {filteredInspectors.length === 0 && !searchTerm ? (
//                   <div className="text-center py-8">
//                     <p className="text-gray-500">No inspectors found</p>
//                   </div>
//                 ) : filteredInspectors.length === 0 && searchTerm ? (
//                   <div className="text-center py-8">
//                     <p className="text-gray-500">No inspectors match your search</p>
//                   </div>
//                 ) : (
//                   <div className="divide-y divide-gray-200">
//                     {filteredInspectors.map((inspector) => (
//                       <div key={inspector.id} className="p-4 hover:bg-gray-50">
//                         <div className="flex items-center justify-between mb-3">
//                           <div className="flex items-center space-x-3">
//                             <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
//                               <User size={20} className="text-gray-600" />
//                             </div>
//                             <div>
//                               <p className="font-medium text-gray-800">{inspector.name}</p>
//                               <p className="text-sm text-gray-600">{inspector.email}</p>
//                             </div>
//                           </div>
//                           <button
//                             onClick={() => handleAction(inspector.id, inspector.action)}
//                             className={`px-3 py-1 text-xs flex items-center gap-1 rounded-lg transition-colors ${inspector.actionColor}`}
//                           >
//                             {inspector.action === "Approve" ? <Check size={14} /> : <Trash size={14} />}
//                             <span>{inspector.action}</span>
//                           </button>
//                         </div>
                        
//                         <div className="grid grid-cols-2 gap-2 text-sm">
//                           <div>
//                             <p className="text-gray-500">Fee Status</p>
//                             <p className="font-medium">{inspector.feeStatus}</p>
//                           </div>
//                           <div>
//                             <p className="text-gray-500">Agreed Fee</p>
//                             <p className="font-medium">{inspector.agreedFee}</p>
//                           </div>
//                           {inspector.orderId && (
//                             <div className="col-span-2">
//                               <p className="text-gray-500">Order ID</p>
//                               <p className="font-medium">{inspector.orderId}</p>
//                             </div>
//                           )}
//                           {inspector.dueDate && (
//                             <div className="col-span-2">
//                               <p className="text-gray-500">Due Date</p>
//                               <p className="font-medium">{formatDate(inspector.dueDate)}</p>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Table - Desktop View */}
//               <div className="hidden md:block overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
//                         Inspector name
//                       </th>
//                       <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
//                         Email
//                       </th>
//                       <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
//                         Fee status
//                       </th>
//                       <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
//                         Agreed fee
//                       </th>
//                       <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
//                         Order ID
//                       </th>
//                       <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
//                         Due Date
//                       </th>
//                       <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
//                         Action
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200">
//                     {filteredInspectors.length === 0 ? (
//                       <tr>
//                         <td colSpan="7" className="py-8 text-center text-gray-500">
//                           {searchTerm ? "No inspectors match your search" : "No inspectors found"}
//                         </td>
//                       </tr>
//                     ) : (
//                       filteredInspectors.map((inspector) => (
//                         <tr key={inspector.id} className="hover:bg-gray-50 transition-colors">
//                           <td className="py-4 px-6">
//                             <div className="flex items-center space-x-3">
//                               <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
//                                 <User size={16} className="text-gray-600" />
//                               </div>
//                               <span className="text-sm font-medium text-gray-800">
//                                 {inspector.name}
//                               </span>
//                             </div>
//                           </td>
//                           <td className="py-4 px-6">
//                             <span className="text-sm text-gray-600">{inspector.email}</span>
//                           </td>
//                           <td className="py-4 px-6">
//                             <span className={`text-sm font-medium ${
//                               inspector.feeStatus === "-" 
//                                 ? "text-gray-500" 
//                                 : "text-gray-800"
//                             }`}>
//                               {inspector.feeStatus}
//                             </span>
//                           </td>
//                           <td className="py-4 px-6">
//                             <span className={`text-sm font-medium ${
//                               inspector.agreedFee === "-" 
//                                 ? "text-gray-500" 
//                                 : "text-gray-800"
//                             }`}>
//                               {inspector.agreedFee}
//                             </span>
//                           </td>
//                           <td className="py-4 px-6">
//                             <span className="text-sm text-gray-600 font-mono">
//                               {inspector.orderId || 'N/A'}
//                             </span>
//                           </td>
//                           <td className="py-4 px-6">
//                             <span className="text-sm text-gray-600">
//                               {formatDate(inspector.dueDate)}
//                             </span>
//                           </td>
//                           <td className="py-4 px-6">
//                             <button
//                               onClick={() => handleAction(inspector.id, inspector.action)}
//                               className={`py-1.5 px-3 text-sm flex gap-x-2 items-center rounded-lg transition-colors ${inspector.actionColor}`}
//                             >
//                               {inspector.action === "Approve" ? (
//                                 <Check className="text-teal-600" size={14} />
//                               ) : (
//                                 <Trash className="text-red-500" size={14} />
//                               )}
//                               <span>{inspector.action}</span>
//                             </button>
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Pagination */}
//               {filteredInspectors.length > 0 && (
//                 <div className="border-t border-gray-200 px-4 md:px-6 py-4">
//                   <div className="flex flex-col md:flex-row items-center justify-between gap-4">
//                     {/* Items per page info */}
//                     <div className="text-sm text-gray-600">
//                       Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
//                       <span className="font-medium">
//                         {Math.min(currentPage * itemsPerPage, totalInspectors)}
//                       </span>{" "}
//                       of <span className="font-medium">{totalInspectors}</span> inspectors
//                     </div>

//                     {/* Page Navigation */}
//                     <div className="flex items-center space-x-2">
//                       {/* Previous Button */}
//                       <button
//                         onClick={() => handlePageChange(currentPage - 1)}
//                         disabled={currentPage === 1}
//                         className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg border border-gray-300"
//                       >
//                         <ChevronLeft size={16} />
//                         <span className="hidden sm:inline">Previous</span>
//                       </button>

//                       {/* Page Numbers */}
//                       <div className="flex items-center space-x-1">
//                         {getPageNumbers().map((page, index) => (
//                           page === '...' ? (
//                             <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
//                               ...
//                             </span>
//                           ) : (
//                             <button
//                               key={page}
//                               onClick={() => handlePageChange(page)}
//                               className={`w-8 h-8 flex items-center justify-center text-sm rounded transition-colors ${
//                                 currentPage === page
//                                   ? "bg-teal-600 text-white font-semibold"
//                                   : "text-gray-600 hover:bg-gray-100 border border-gray-300"
//                               }`}
//                             >
//                               {page}
//                             </button>
//                           )
//                         ))}
//                       </div>

//                       {/* Next Button */}
//                       <button
//                         onClick={() => handlePageChange(currentPage + 1)}
//                         disabled={currentPage === totalPages}
//                         className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg border border-gray-300"
//                       >
//                         <span className="hidden sm:inline">Next</span>
//                         <ChevronRight size={16} />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>

//         {/* Add New Inspector Button */}
//         <div className="mt-6 flex justify-end">
//           <button className="px-4 md:px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-2">
//             <User size={18} />
//             <span>Add New Inspector</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }