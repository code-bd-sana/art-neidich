import {
  FileText,
  MapPin,
  User,
  Calendar,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Trash2,
  Eye,
} from "lucide-react";
import { formatDate } from "../../../components/Dashboard/ArchivePage/ArchiveFormatDate";

export default function ArchiveReportCard({
  report,
  isExpanded,
  isSelected,
  actionLoading,
  onToggleExpand,
  onToggleSelect,
  onRestore,
  onDelete,
  onView,
}) {
  const job = report.job || {};

  return (
    <div
      className={`bg-white rounded-xl border overflow-hidden transition-colors ${
        isSelected ? "border-teal-400" : "border-gray-200"
      }`}>
      <div className='p-4 cursor-pointer' onClick={onToggleExpand}>
        <div className='flex items-start justify-between mb-2'>
          <div className='flex items-center gap-2'>
            <input
              type='checkbox'
              checked={isSelected}
              onChange={(e) => {
                e.stopPropagation();
                onToggleSelect();
              }}
              onClick={(e) => e.stopPropagation()}
              className='w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500'
            />
            <div>
              <div className='flex items-center gap-1.5'>
                <FileText size={14} className='text-gray-400' />
                <span className='font-medium text-sm text-gray-800'>
                  {job.fhaCaseDetailsNo || "N/A"}
                </span>
              </div>
              <span className='text-xs text-gray-500'>
                Order: {job.orderId || "N/A"}
              </span>
            </div>
          </div>
          <span className='px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium'>
            Archived
          </span>
        </div>

        <div className='flex items-center gap-1.5 mb-1.5'>
          <MapPin size={13} className='text-gray-400 shrink-0' />
          <span className='text-xs text-gray-600 truncate'>
            {job.streetAddress || "Address not available"}
          </span>
        </div>

        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-1.5'>
            <User size={13} className='text-gray-400' />
            <span className='text-xs text-gray-600'>
              {job.siteContactName || "Unassigned"}
            </span>
          </div>
          {isExpanded ? (
            <ChevronUp size={16} className='text-gray-400' />
          ) : (
            <ChevronDown size={16} className='text-gray-400' />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className='border-t border-gray-100 p-4 bg-gray-50 space-y-3'>
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <p className='text-xs text-gray-400 mb-0.5'>Completed</p>
              <div className='flex items-center gap-1'>
                <Calendar size={12} className='text-gray-400' />
                <span className='text-xs font-medium text-gray-700'>
                  {formatDate(report.completedAt)}
                </span>
              </div>
            </div>
            <div>
              <p className='text-xs text-gray-400 mb-0.5'>Created</p>
              <div className='flex items-center gap-1'>
                <Calendar size={12} className='text-gray-400' />
                <span className='text-xs font-medium text-gray-700'>
                  {formatDate(report.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <div className='flex gap-2'>
            <button
              onClick={onRestore}
              disabled={actionLoading}
              className='flex-1 py-2 bg-teal-600 text-white text-xs rounded-lg font-medium flex items-center justify-center gap-1.5 disabled:opacity-50'>
              <RotateCcw size={13} />
              Restore
            </button>
            <button
              onClick={onDelete}
              disabled={actionLoading}
              className='flex-1 py-2 bg-red-50 text-red-600 text-xs rounded-lg font-medium flex items-center justify-center gap-1.5 border border-red-200 disabled:opacity-50'>
              <Trash2 size={13} />
              Delete
            </button>
            <button
              onClick={onView}
              className='flex-1 py-2 bg-white text-gray-700 text-xs rounded-lg font-medium flex items-center justify-center gap-1.5 border border-gray-200'>
              <Eye size={13} />
              View
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
