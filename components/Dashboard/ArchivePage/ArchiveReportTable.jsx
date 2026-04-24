import { RotateCcw, Trash2, Eye, Loader2 } from "lucide-react";
import { formatDate } from "../../../components/Dashboard/ArchivePage/ArchiveFormatDate";

export default function ArchiveReportTable({
  reports,
  selectedIds,
  allSelected,
  actionLoading,
  restoringIds = [],
  deletingIds = [],
  onToggleSelectAll,
  onToggleSelect,
  onRestore,
  onDelete,
  onView,
}) {
  const isReportRestoring = (reportId) => restoringIds.includes(reportId);
  const isReportDeleting = (reportId) => deletingIds.includes(reportId);
  const isReportLoading = (reportId) =>
    isReportRestoring(reportId) || isReportDeleting(reportId);

  return (
    <div className='hidden md:block bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='py-3 px-4 border-b border-gray-200'>
                <input
                  type='checkbox'
                  checked={allSelected}
                  onChange={onToggleSelectAll}
                  disabled={actionLoading}
                  className='w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 disabled:opacity-50'
                />
              </th>
              {[
                "FHA Case Details",
                "Address",
                "Inspector",
                "Date Due",
                "Date Submitted",
                "Created",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className='py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200'>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100'>
            {reports.map((report) => {
              const job = report.job || {};
              const isSelected = selectedIds.includes(report._id);
              const isLoading = isReportLoading(report._id);
              const isRestoring = isReportRestoring(report._id);
              const isDeleting = isReportDeleting(report._id);

              return (
                <tr
                  key={report._id}
                  className={`hover:bg-gray-50 transition-colors ${
                    isSelected ? "bg-teal-50" : ""
                  } ${isLoading ? "opacity-60" : ""}`}>
                  <td className='py-3 px-4'>
                    <input
                      type='checkbox'
                      checked={isSelected}
                      onChange={() => onToggleSelect(report._id)}
                      disabled={isLoading}
                      className='w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 disabled:opacity-50'
                    />
                  </td>
                  <td className='py-3 px-4 text-sm font-medium text-gray-800'>
                    {job.fhaCaseDetailsNo || "N/A"}
                  </td>
                  <td className='py-3 px-4 text-sm text-gray-600 max-w-xs truncate'>
                    {job.streetAddress || "—"}
                  </td>
                  <td className='py-3 px-4 text-sm text-gray-600'>
                    {job.siteContactName || "Unassigned"}
                  </td>
                  <td className='py-3 px-4 text-sm text-gray-600'>
                    {formatDate(job.dueDate)}
                  </td>
                  <td className='py-3 px-4 text-sm text-gray-600'>
                    {formatDate(report.completedAt)}
                  </td>
                  <td className='py-3 px-4 text-sm text-gray-600'>
                    {formatDate(report.createdAt)}
                  </td>
                  <td className='py-3 px-4'>
                    <div className='flex items-center gap-2'>
                      <button
                        onClick={() => onRestore([report._id])}
                        disabled={isLoading}
                        title='Restore'
                        className='p-1.5 text-teal-600 hover:bg-teal-50 rounded-md disabled:opacity-50 transition-colors relative'>
                        {isRestoring ? (
                          <Loader2 size={15} className='animate-spin' />
                        ) : (
                          <RotateCcw size={15} />
                        )}
                      </button>
                      <button
                        onClick={() => onDelete([report._id])}
                        disabled={isLoading}
                        title='Permanently Delete'
                        className='p-1.5 text-red-500 hover:bg-red-50 rounded-md disabled:opacity-50 transition-colors relative'>
                        {isDeleting ? (
                          <Loader2 size={15} className='animate-spin' />
                        ) : (
                          <Trash2 size={15} />
                        )}
                      </button>
                      <button
                        onClick={() => onView(report)}
                        disabled={isLoading}
                        title='View Details'
                        className='p-1.5 text-gray-500 hover:bg-gray-100 rounded-md disabled:opacity-50 transition-colors'>
                        <Eye size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
