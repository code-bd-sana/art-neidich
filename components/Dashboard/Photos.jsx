import { ArrowDownToLine, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function Photos() {
  const [currentPage, setCurrentPage] = useState(1);

  const photoData = [
    { id: 1, location: 'Exterior Front Elevation', count: 2 },
    { id: 2, location: 'Exterior Left Elevation', count: 1 },
    { id: 3, location: 'Exterior Right Elevation', count: 1 },
    { id: 4, location: 'Interior view of front door', count: 1 },
    { id: 5, location: 'Bedroom 1', count: 1 },
    { id: 6, location: 'Bedroom 2', count: 1 },
    { id: 7, location: 'Bathroom', count: 1 },
    { id: 8, location: 'Halfway', count: 2 },
    { id: 9, location: 'Utility / Laundry Room', count: 2 },
    { id: 10, location: 'Family Room', count: 2 },
  ];

  return (
    <div>
      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-12 gap-4 px-6 py-2">
            <div className="col-span-6">
              <span className="text-sm font-medium text-gray-700">Photos</span>
            </div>
            <div className="col-span-2">
              <span className="text-sm font-medium text-gray-700">Inspector</span>
            </div>
            <div className="col-span-4">
              <span className="text-sm font-medium text-gray-700">Action</span>
            </div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200 bg-white">
          {photoData.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-4 px-6 py-2 hover:bg-gray-50 transition-colors items-center">
              {/* Photos Column */}
              <div className="col-span-6">
                <span className="text-sm text-gray-900">{item.location}</span>
              </div>

              {/* Inspector Column */}
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 whitespace-nowrap">
                    {item.count} {item.count === 1 ? 'Photo' : 'Photos'}
                  </span>
                </div>
              </div>

              {/* Action Column */}
              <div className="col-span-4">
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 transition-colors whitespace-nowrap">
                    <span>Download Image</span><ArrowRight/>
                  </button>
                  
                  <button className="flex items-center gap-2 px-4 py-1.5 border border-orange-500 text-orange-500 rounded-full text-sm hover:bg-orange-50 transition-colors whitespace-nowrap">
                    <span>Report</span><ArrowDownToLine />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-center gap-2">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentPage === 1}
        >
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </span>
        </button>

        {[1, 2, 3, 4, 5, 6].map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
              currentPage === page
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        ))}

        <span className="px-2 text-gray-400">...</span>

        <button
          onClick={() => setCurrentPage(Math.min(6, currentPage + 1))}
          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentPage === 6}
        >
          <span className="flex items-center gap-1">
            Next
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}