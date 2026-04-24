"use client";

import { useEffect } from "react";
import {
  X,
  FileText,
  MapPin,
  User,
  Calendar,
  Phone,
  Mail,
  Building2,
  Hash,
  ClipboardList,
  BadgeInfo,
  DollarSign,
} from "lucide-react";

const formatDate = (dateString) => {
  if (!dateString || dateString === "-") return "—";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
};

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className='flex items-start gap-3 py-2.5 border-b border-gray-100 last:border-0'>
      <div className='mt-0.5 shrink-0 w-7 h-7 rounded-md bg-gray-100 flex items-center justify-center'>
        <Icon size={14} className='text-gray-500' />
      </div>
      <div className='min-w-0'>
        <p className='text-xs text-gray-400 mb-0.5'>{label}</p>
        <p className='text-sm text-gray-800 font-medium wrap-break-words'>
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className='mb-5'>
      <h3 className='text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1'>
        {title}
      </h3>
      <div className='bg-white border border-gray-200 rounded-xl px-4 divide-y divide-gray-100'>
        {children}
      </div>
    </div>
  );
}

export default function ArchiveReportModal({ report, onClose }) {
  const job = report?.job || {};
  const inspector = job?.inspector || {};

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!report) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-end md:items-center justify-center'
      aria-modal='true'
      role='dialog'>
      {/* Backdrop */}
      <div className='absolute inset-0 bg-black/50' onClick={onClose} />

      {/* Panel */}
      <div className='relative w-full md:max-w-lg md:mx-4 bg-gray-50 rounded-t-2xl md:rounded-2xl shadow-2xl max-h-[92vh] flex flex-col'>
        {/* Header */}
        <div className='flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white rounded-t-2xl md:rounded-t-2xl shrink-0'>
          <div className='flex items-center gap-3'>
            <div className='w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center'>
              <FileText size={18} className='text-teal-600' />
            </div>
            <div>
              <h2 className='text-base font-semibold text-gray-800 leading-tight'>
                Report Details
              </h2>
              <p className='text-xs text-gray-400'>
                {job.orderId || report._id}
              </p>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <span className='px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full'>
              Archived
            </span>
            <button
              onClick={onClose}
              className='p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors'>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className='overflow-y-auto flex-1 p-4'>
          {/* Report Info */}
          <Section title='Report'>
            <InfoRow
              icon={Hash}
              label='File Code / FHA Case No.'
              value={job.fhaCaseDetailsNo}
            />
            <InfoRow
              icon={ClipboardList}
              label='Order ID'
              value={job.orderId}
            />
            <InfoRow icon={BadgeInfo} label='Form Type' value={job.formType} />
            <InfoRow
              icon={Calendar}
              label='Completed At'
              value={formatDate(report.completedAt)}
            />
            <InfoRow
              icon={Calendar}
              label='Created At'
              value={formatDate(report.createdAt)}
            />
          </Section>

          {/* Job / Site Info */}
          <Section title='Job Details'>
            <InfoRow
              icon={MapPin}
              label='Street Address'
              value={job.streetAddress}
            />
            <InfoRow
              icon={Building2}
              label='Development Name'
              value={job.developmentName}
            />
            <InfoRow
              icon={Calendar}
              label='Due Date'
              value={formatDate(job.dueDate)}
            />
            <InfoRow
              icon={DollarSign}
              label='Agreed Fee'
              value={
                job.agreedFee ? `$${job.agreedFee.toLocaleString()}` : null
              }
            />
            <InfoRow
              icon={BadgeInfo}
              label='Fee Status'
              value={job.feeStatus}
            />
          </Section>

          {/* Site Contact */}
          <Section title='Site Contact'>
            <InfoRow icon={User} label='Name' value={job.siteContactName} />
            <InfoRow icon={Phone} label='Phone' value={job.siteContactPhone} />
            <InfoRow icon={Mail} label='Email' value={job.siteContactEmail} />
          </Section>

          {/* Inspector */}
          {inspector?._id && (
            <Section title='Inspector'>
              <InfoRow
                icon={User}
                label='Name'
                value={
                  inspector.firstName || inspector.lastName
                    ? `${inspector.firstName || ""} ${inspector.lastName || ""}`.trim()
                    : null
                }
              />
              <InfoRow icon={Mail} label='Email' value={inspector.email} />
              <InfoRow icon={BadgeInfo} label='Role' value={inspector.role} />
            </Section>
          )}

          {/* Special Notes */}
          {(job.specialNotesForInspector || job.specialNoteForApOrAr) && (
            <Section title='Notes'>
              {job.specialNotesForInspector && (
                <InfoRow
                  icon={FileText}
                  label='Notes for Inspector'
                  value={job.specialNotesForInspector}
                />
              )}
              {job.specialNoteForApOrAr && (
                <InfoRow
                  icon={FileText}
                  label='Notes for AP/AR'
                  value={job.specialNoteForApOrAr}
                />
              )}
            </Section>
          )}
        </div>

        {/* Footer */}
        <div className='px-4 py-3 border-t border-gray-200 bg-white rounded-b-2xl shrink-0'>
          <button
            onClick={onClose}
            className='w-full py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors'>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
