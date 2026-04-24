"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Loader2, RotateCcw, Trash2, FileText, X } from "lucide-react";
import {
  getArchivedReports,
  restoreArchivedReports,
  permanentlyDeleteArchivedReports,
} from "../../../../action/report-archive.action";
import { extractErrorMessage } from "../../../../lib/error-utils";
import ArchiveReportCard from "../../../../components/Dashboard/ArchivePage/ArchiveReportCard";
import ArchiveReportTable from "../../../../components/Dashboard/ArchivePage/ArchiveReportTable";
import ArchivePagination from "../../../../components/Dashboard/ArchivePage/ArchivePagination";
import ArchiveReportModal from "../../../../components/Dashboard/ArchivePage/ArchiveReportModal";

const LIMIT = 10;

export default function ArchiveReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReports, setTotalReports] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  // Simple fetch function
  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getArchivedReports(currentPage, LIMIT, searchTerm);
      if (data.success) {
        setReports(data.data || []);
        setTotalPages(data.metaData?.totalPage || 1);
        setTotalReports(data.metaData?.totalReports || 0);
      } else {
        setError(extractErrorMessage(data, "Failed to load archived reports."));
      }
    } catch (err) {
      setError(extractErrorMessage(err, "Failed to load archived reports."));
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm]);

  // Single effect for everything
  useEffect(() => {
    // Debounce search
    const timer = setTimeout(
      () => {
        fetchReports();
      },
      searchTerm ? 400 : 0,
    );

    return () => clearTimeout(timer);
  }, [fetchReports, searchTerm]);

  // ─── Selection ────────────────────────────────────────────────────────────
  const toggleSelect = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const toggleSelectAll = () =>
    setSelectedIds(
      selectedIds.length === reports.length ? [] : reports.map((r) => r._id),
    );

  // ─── Restore ──────────────────────────────────────────────────────────────
  const handleRestore = async (ids) => {
    if (!ids.length) return;
    try {
      setActionLoading(true);
      setError("");
      const data = await restoreArchivedReports(ids);
      if (data.success) {
        setSuccess(`${ids.length} report(s) restored successfully.`);
        setSelectedIds([]);
        fetchReports();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(extractErrorMessage(data, "Failed to restore reports."));
      }
    } catch (err) {
      setError(extractErrorMessage(err, "Failed to restore reports."));
    } finally {
      setActionLoading(false);
    }
  };

  // ─── Permanent Delete ─────────────────────────────────────────────────────
  const handlePermanentDelete = async (ids) => {
    if (!ids.length) return;
    if (
      !window.confirm(
        `Permanently delete ${ids.length} report(s)? This cannot be undone.`,
      )
    )
      return;
    try {
      setActionLoading(true);
      setError("");
      const data = await permanentlyDeleteArchivedReports(ids);
      if (data.success) {
        setSuccess(`${ids.length} report(s) permanently deleted.`);
        setSelectedIds([]);

        // If we deleted all items on current page, go to previous page
        if (reports.length === ids.length && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchReports();
        }

        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(extractErrorMessage(data, "Failed to delete reports."));
      }
    } catch (err) {
      setError(extractErrorMessage(err, "Failed to delete reports."));
    } finally {
      setActionLoading(false);
    }
  };

  const allSelected =
    reports.length > 0 && selectedIds.length === reports.length;
  const someSelected = selectedIds.length > 0;

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className='min-h-screen bg-gray-50 p-3 md:p-6'>
      {/* Header */}
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-2xl font-bold text-gray-800'>Archived Reports</h1>
          <p className='text-sm text-gray-500 mt-0.5'>
            {totalReports} report{totalReports !== 1 ? "s" : ""} archived
          </p>
        </div>

        {someSelected && (
          <div className='flex items-center gap-2'>
            <span className='text-sm text-gray-600 mr-1'>
              {selectedIds.length} selected
            </span>
            <button
              onClick={() => handleRestore(selectedIds)}
              disabled={actionLoading}
              className='flex items-center gap-1.5 px-3 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 disabled:opacity-50 transition-colors'>
              <RotateCcw size={15} /> Restore
            </button>
            <button
              onClick={() => handlePermanentDelete(selectedIds)}
              disabled={actionLoading}
              className='flex items-center gap-1.5 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors'>
              <Trash2 size={15} /> Delete
            </button>
          </div>
        )}
      </div>

      {/* Search */}
      <div className='relative mb-4'>
        <input
          type='text'
          placeholder='Search by order ID, address, file code...'
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to page 1 on search
          }}
          className='w-full md:w-96 pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'
        />
        <Search
          className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
          size={18}
        />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm("");
              setCurrentPage(1);
            }}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'>
            <X size={16} />
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center justify-between'>
          {error}
          <button onClick={() => setError("")}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Success */}
      {success && (
        <div className='mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 flex items-center justify-between'>
          {success}
          <button onClick={() => setSuccess("")}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className='bg-white rounded-xl p-12 flex flex-col items-center justify-center border border-gray-200'>
          <Loader2 className='animate-spin text-teal-600 mb-3' size={28} />
          <p className='text-sm text-gray-500'>Loading archived reports...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className='bg-white rounded-xl p-12 text-center border border-gray-200'>
          <FileText size={44} className='text-gray-300 mx-auto mb-4' />
          <h3 className='text-base font-medium text-gray-800 mb-1'>
            {searchTerm ? "No results found" : "No archived reports"}
          </h3>
          <p className='text-sm text-gray-500'>
            {searchTerm
              ? "Try a different search term"
              : "Completed reports will appear here once archived"}
          </p>
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                setCurrentPage(1);
              }}
              className='mt-4 px-4 py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700'>
              Clear search
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Mobile Cards */}
          <div className='md:hidden space-y-3'>
            {reports.map((report) => (
              <ArchiveReportCard
                key={report._id}
                report={report}
                isExpanded={expandedCard === report._id}
                isSelected={selectedIds.includes(report._id)}
                actionLoading={actionLoading}
                onToggleExpand={() =>
                  setExpandedCard(
                    expandedCard === report._id ? null : report._id,
                  )
                }
                onToggleSelect={() => toggleSelect(report._id)}
                onRestore={() => handleRestore([report._id])}
                onDelete={() => handlePermanentDelete([report._id])}
                onView={() => setSelectedReport(report)}
              />
            ))}
          </div>

          {/* Desktop Table */}
          <ArchiveReportTable
            reports={reports}
            selectedIds={selectedIds}
            allSelected={allSelected}
            actionLoading={actionLoading}
            onToggleSelectAll={toggleSelectAll}
            onToggleSelect={toggleSelect}
            onRestore={handleRestore}
            onDelete={handlePermanentDelete}
            onView={setSelectedReport}
          />

          {/* Pagination */}
          <ArchivePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {/* Modal */}
      {selectedReport && (
        <ArchiveReportModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
}
