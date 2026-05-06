"use client";

import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import { getUsers } from "../../action/user.action";
import { updateJob } from "../../action/job.action";
import { extractErrorMessage } from "../../lib/error-utils";

function toDateInputValue(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toISOString().split("T")[0];
}

function toFormState(jobData) {
  return {
    inspector: jobData?.inspector?._id || "",
    formType: jobData?.formType || "",
    feeStatus: jobData?.feeStatus || "",
    agreedFee: jobData?.agreedFee ?? "",
    fhaCaseDetailsNo: jobData?.fhaCaseDetailsNo || "",
    orderId: jobData?.orderId || "",
    streetAddress: jobData?.streetAddress || "",
    developmentName: jobData?.developmentName || "",
    siteContactName: jobData?.siteContactName || "",
    siteContactPhone: jobData?.siteContactPhone || "",
    siteContactEmail: jobData?.siteContactEmail || "",
    dueDate: toDateInputValue(jobData?.dueDate),
    specialNotesForInspector: jobData?.specialNotesForInspector || "",
    specialNoteForApOrAr: jobData?.specialNoteForApOrAr || "",
  };
}

function getInspectorLabel(inspector) {
  if (!inspector) return "Unassigned";

  const name =
    `${inspector.firstName || ""} ${inspector.lastName || ""}`.trim();
  return name || inspector.email || inspector._id || "Unassigned";
}

export default function EditJobModal({ jobData, onClose, onUpdated }) {
  const [formData, setFormData] = useState(() => toFormState(jobData));
  const [inspectors, setInspectors] = useState([]);
  const [loadingInspectors, setLoadingInspectors] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (jobData) {
      setFormData(toFormState(jobData));
    }
  }, [jobData]);

  useEffect(() => {
    let isMounted = true;

    async function loadInspectors() {
      setLoadingInspectors(true);

      try {
        const response = await getUsers(1, 1000, "", "2");
        const list = response?.success ? response.data || [] : [];
        const approved = list.filter(
          (inspector) =>
            inspector.isApproved === true && !inspector.isSuspended,
        );

        if (isMounted) {
          setInspectors(approved);
        }
      } catch (err) {
        if (isMounted) {
          setError(extractErrorMessage(err, "Could not load inspectors."));
        }
      } finally {
        if (isMounted) {
          setLoadingInspectors(false);
        }
      }
    }

    loadInspectors();

    return () => {
      isMounted = false;
    };
  }, []);

  const currentInspector = jobData?.inspector;
  const inspectorOptions = currentInspector?._id
    ? [
        currentInspector,
        ...inspectors.filter((item) => item._id !== currentInspector._id),
      ]
    : inspectors;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        inspector: formData.inspector,
        formType: formData.formType,
        feeStatus: formData.feeStatus,
        agreedFee:
          formData.agreedFee === "" ? undefined : Number(formData.agreedFee),
        fhaCaseDetailsNo: formData.fhaCaseDetailsNo,
        orderId: formData.orderId,
        streetAddress: formData.streetAddress,
        developmentName: formData.developmentName,
        siteContactName: formData.siteContactName,
        siteContactPhone: formData.siteContactPhone,
        siteContactEmail: formData.siteContactEmail,
        dueDate: formData.dueDate || undefined,
        specialNotesForInspector: formData.specialNotesForInspector,
        specialNoteForApOrAr: formData.specialNoteForApOrAr,
      };

      const response = await updateJob(jobData._id, payload);

      if (!response?.success) {
        throw response;
      }

      onUpdated?.(response.data || null);
      onClose();
    } catch (err) {
      setError(extractErrorMessage(err, "Failed to update the job."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      <div className='absolute inset-0 bg-black/55' onClick={onClose} />

      <div className='relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl'>
        <div className='flex items-start justify-between border-b border-gray-200 px-6 py-4'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.2em] text-teal-600'>
              Admin Edit
            </p>
            <h2 className='mt-1 text-xl font-semibold text-gray-900'>
              Edit Job Details
            </h2>
            <p className='mt-1 text-sm text-gray-500'>
              Update the job record and keep the report history intact.
            </p>
          </div>

          <button
            type='button'
            onClick={onClose}
            className='rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700'>
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className='max-h-[calc(90vh-88px)] overflow-y-auto px-6 py-5'>
          {error && (
            <div className='mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'>
              {error}
            </div>
          )}

          <div className='grid gap-5 md:grid-cols-2'>
            <Field label='Inspector'>
              <select
                name='inspector'
                value={formData.inspector}
                onChange={handleChange}
                className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100'>
                {loadingInspectors ? (
                  <option value=''>Loading inspectors...</option>
                ) : (
                  <>
                    <option value=''>Select inspector</option>
                    {inspectorOptions.map((inspector) => (
                      <option key={inspector._id} value={inspector._id}>
                        {getInspectorLabel(inspector)}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </Field>

            <Field label='Form Type'>
              <select
                name='formType'
                value={formData.formType}
                onChange={handleChange}
                className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100'>
                <option value=''>Select form type</option>
                <option value='RCI Residential Building Code Inspection'>
                  RCI Residential Building Code Inspection
                </option>
                <option value='92051 - FHA Inspection'>
                  92051 - FHA Inspection
                </option>
              </select>
            </Field>

            <Field label='Fee Status'>
              <select
                name='feeStatus'
                value={formData.feeStatus}
                onChange={handleChange}
                className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100'>
                <option value=''>Select fee status</option>
                <option value='Standard'>Standard</option>
                <option value='Rush Order'>Rush Order</option>
                <option value='Occupied Fee'>Occupied Fee</option>
                <option value='Modified Fee'>Modified Fee</option>
                <option value='Long Distance Fee'>Long Distance Fee</option>
              </select>
            </Field>

            <Field label='Agreed Fee'>
              <input
                type='number'
                name='agreedFee'
                value={formData.agreedFee}
                onChange={handleChange}
                min='0'
                className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100'
              />
            </Field>

            <Field label='FHA Case Details No.'>
              <input
                type='text'
                name='fhaCaseDetailsNo'
                value={formData.fhaCaseDetailsNo}
                onChange={handleChange}
                className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100'
              />
            </Field>

            <Field label='Order ID'>
              <input
                type='text'
                name='orderId'
                value={formData.orderId}
                onChange={handleChange}
                className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100'
              />
            </Field>

            <Field label='Due Date'>
              <input
                type='date'
                name='dueDate'
                value={formData.dueDate}
                onChange={handleChange}
                className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100'
              />
            </Field>

            <Field label='Street Address' fullWidth>
              <input
                type='text'
                name='streetAddress'
                value={formData.streetAddress}
                onChange={handleChange}
                className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100'
              />
            </Field>

            <Field label='Development Name' fullWidth>
              <input
                type='text'
                name='developmentName'
                value={formData.developmentName}
                onChange={handleChange}
                className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100'
              />
            </Field>

            <Field label='Site Contact Name'>
              <input
                type='text'
                name='siteContactName'
                value={formData.siteContactName}
                onChange={handleChange}
                className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100'
              />
            </Field>

            <Field label='Site Contact Phone'>
              <input
                type='text'
                name='siteContactPhone'
                value={formData.siteContactPhone}
                onChange={handleChange}
                className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100'
              />
            </Field>

            <Field label='Site Contact Email'>
              <input
                type='email'
                name='siteContactEmail'
                value={formData.siteContactEmail}
                onChange={handleChange}
                className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100'
              />
            </Field>

            <Field label='Notes for Inspector' fullWidth>
              <textarea
                name='specialNotesForInspector'
                value={formData.specialNotesForInspector}
                onChange={handleChange}
                rows={4}
                className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100'
              />
            </Field>

            <Field label='Notes for AP / AR' fullWidth>
              <textarea
                name='specialNoteForApOrAr'
                value={formData.specialNoteForApOrAr}
                onChange={handleChange}
                rows={4}
                className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100'
              />
            </Field>
          </div>

          <div className='mt-6 flex flex-col-reverse gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:justify-end'>
            <button
              type='button'
              onClick={onClose}
              className='rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50'>
              Cancel
            </button>
            <button
              type='submit'
              disabled={saving}
              className='inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70'>
              {saving && <Loader2 className='animate-spin' size={16} />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children, fullWidth = false }) {
  return (
    <div className={fullWidth ? "md:col-span-2" : ""}>
      <label className='mb-2 block text-sm font-medium text-gray-700'>
        {label}
      </label>
      {children}
    </div>
  );
}
