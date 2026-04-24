export default function ArchivePagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 2) {
      pages.push(1, 2, 3, "...", totalPages);
    } else if (currentPage >= totalPages - 1) {
      pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", currentPage, "...", totalPages);
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className='mt-4 bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between'>
      <span className='text-sm text-gray-500'>
        Page {currentPage} of {totalPages}
      </span>
      <div className='flex items-center gap-1'>
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className='px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded disabled:opacity-40 transition-colors'>
          Previous
        </button>
        {getPageNumbers().map((page, i) =>
          page === "..." ? (
            <span key={`e-${i}`} className='px-2 text-gray-400 text-sm'>
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 text-sm rounded transition-colors ${
                currentPage === page
                  ? "bg-teal-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}>
              {page}
            </button>
          ),
        )}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className='px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded disabled:opacity-40 transition-colors'>
          Next
        </button>
      </div>
    </div>
  );
}
