"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Loader2, X } from "lucide-react";
import { extractErrorMessage } from "../../../../lib/error-utils";
import {
  getArchiveSettings,
  updateArchiveSettings,
} from "../../../../action/archive.action";

const AUTO_ARCHIVE_OPTIONS = [
  { label: "After 7 days", value: 7 },
  { label: "After 15 days", value: 15 },
  { label: "After 30 days", value: 30 },
  { label: "After 60 days", value: 60 },
  { label: "After 120 days", value: 120 },
];

export default function ArchiveSettingsPage() {
  const [selectedDays, setSelectedDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch current settings on mount
  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true);
        setError(null);

        const response = await getArchiveSettings();

        if (response.success) {
          setSelectedDays(response.data.autoArchiveDays);
        } else {
          setError(
            extractErrorMessage(response, "Failed to load archive settings."),
          );
        }
      } catch (err) {
        console.error("Error fetching archive settings:", err);
        setError(extractErrorMessage(err, "Could not load archive settings."));
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  // Handle update
  const handleUpdate = async () => {
    try {
      setUpdating(true);
      setError(null);

      const response = await updateArchiveSettings(selectedDays);

      if (response.success) {
        setSuccessMessage("Archive settings updated successfully!");
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(
          extractErrorMessage(response, "Failed to update archive settings."),
        );
      }
    } catch (err) {
      console.error("Error updating archive settings:", err);
      setError(extractErrorMessage(err, "Failed to update archive settings."));
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 p-6 flex items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='animate-spin h-8 w-8 text-teal-600 mx-auto mb-4' />
          <p className='text-gray-600'>Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      {/* Error Message */}
      {error && (
        <div className='mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200'>
          <div className='flex items-center justify-between'>
            <p className='font-medium'>Error: {error}</p>
            <button
              onClick={() => setError(null)}
              className='text-red-600 hover:text-red-800'>
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className='mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200'>
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium'>{successMessage}</span>
            <button
              onClick={() => setSuccess(false)}
              className='text-green-600 hover:text-green-800'>
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Settings Card */}
      <div className='bg-white rounded-lg border border-gray-300 p-6 max-w-lg'>
        {/* Auto-Archive Dropdown */}
        <div className='mb-5'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Auto-Archive Completed Jobs <span className='text-red-500'>*</span>
          </label>

          <div className='relative'>
            <select
              className='w-full appearance-none border border-gray-300 rounded-md px-4 py-2.5 pr-10 text-gray-800 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:opacity-60'
              value={selectedDays}
              onChange={(e) => setSelectedDays(Number(e.target.value))}
              disabled={updating}>
              {AUTO_ARCHIVE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Custom chevron */}
            <div className='pointer-events-none absolute inset-y-0 right-3 flex items-center'>
              <ChevronDown size={16} className='text-gray-400' />
            </div>
          </div>
        </div>

        {/* Storage Info */}
        {/* <div className='space-y-3 mb-6'>
          <div className='flex items-center gap-2 text-sm text-gray-500'>
            <span className='w-48'>Maximum Photo Storage</span>
            <span className='text-gray-400'>:</span>
            <span className='text-gray-700'>{MAX_PHOTO_STORAGE_GB} GB</span>
          </div>

          <div className='flex items-center gap-2 text-sm text-gray-500'>
            <span className='w-48'>Current Storage Used</span>
            <span className='text-gray-400'>:</span>
            <span className='text-gray-700'>
              {CURRENT_STORAGE_USED_GB} GB of {MAX_PHOTO_STORAGE_GB} GB
            </span>
          </div>
        </div> */}

        {/* Update Button */}
        <div className='flex justify-end'>
          <button
            onClick={handleUpdate}
            disabled={updating}
            className='px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'>
            {updating ? (
              <>
                <Loader2 className='animate-spin h-4 w-4' />
                Updating...
              </>
            ) : (
              "Update"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
