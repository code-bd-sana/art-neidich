"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, MoreVertical, Edit2, Trash2, Loader2 } from "lucide-react";
import AddNewLabel from "@/components/Dashboard/AddNewLabel";
import EditLabel from "@/components/Dashboard/EditLabel";
import {
  getLabels,
  createLabel,
  updateLabel,
  deleteLabel,
} from "@/action/label.action";

export default function Labels() {
  const [searchTerm, setSearchTerm] = useState("");
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalLabels, setTotalLabels] = useState(0);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch labels from API
  const fetchLabels = useCallback(async (page = 1, loadMore = false) => {
    try {
      if (loadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      setError(null);

      // Fetch with page parameter
      const response = await getLabels(page, 10); // 10 per page

      if (response.success) {
        if (loadMore) {
          // Append to existing labels
          setLabels((prev) => [...prev, ...(response.data || [])]);
        } else {
          // Replace with new labels
          setLabels(response.data || []);
        }

        // Update pagination info
        const totalPages = response.metaData?.totalPage || 1;
        const totalItems = response.metaData?.total || 0;

        setTotalLabels(totalItems);
        setHasMore(page < totalPages);
        setCurrentPage(page);
      } else {
        setError(response.message || "Failed to load labels");
      }
    } catch (err) {
      console.error("Error fetching labels:", err);
      setError("Could not load labels");
    } finally {
      if (loadMore) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  }, []);

  const loadMore = () => {
    if (hasMore && !loadingMore) {
      fetchLabels(currentPage + 1, true);
    }
  };

  // Initial load
  useEffect(() => {
    fetchLabels();
  }, [fetchLabels]);

  // Handle add new label
  const handleAddLabel = async (labelName) => {
  try {
    setActionLoading(true);
    setError(null);
    
    const response = await createLabel(labelName);
    
    if (response.success) {
      // Add the new label to the beginning of the list
      if (response.data) {
        setLabels(currentLabels => [response.data, ...currentLabels]);
      }
      
      setShowAddModal(false);
      
      setSuccessMessage("Label created successfully!");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
      // Also refresh from server
      setTimeout(() => {
        fetchLabels(1, false, searchTerm);
      }, 500);
      
    } else {
      setError(response.message || "Failed to create label");
    }
  } catch (err) {
    console.error("Error creating label:", err);
    setError("Failed to create label");
  } finally {
    setActionLoading(false);
  }
};

  // Handle edit save
  const handleEditSave = async (updatedLabel) => {
  try {
    setActionLoading(true);
    setError(null);
    
    console.log("Updating label:", updatedLabel);
    
    const response = await updateLabel(updatedLabel._id, updatedLabel.label);
    
    console.log("Update response:", response);
    
    if (response.success) {
      // Update the state IMMEDIATELY
      setLabels(prevLabels => {
        const newLabels = prevLabels.map(label => {
          if (label._id === updatedLabel._id) {
            // Create a NEW object with updated properties
            return {
              ...label,
              label: updatedLabel.label,
              updatedAt: new Date().toISOString()
            };
          }
          return label;
        });
        
        console.log("Updated labels state:", newLabels);
        return newLabels;
      });
      
      // Close modal
      setShowEditModal(false);
      setSelectedLabel(null);
      
      // Show success
      setSuccessMessage("Label updated successfully!");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
    } else {
      setError(response.message || "Failed to update label");
    }
  } catch (err) {
    console.error("Error updating label:", err);
    setError("Failed to update label");
  } finally {
    setActionLoading(false);
  }
};
  // Handle delete
  const handleDelete = async (labelId, labelName) => {
    if (confirm(`Are you sure you want to delete "${labelName}"?`)) {
      try {
        setActionLoading(true);
        setError(null);

        const response = await deleteLabel(labelId);

        if (response.success) {
          // Refresh labels list
          await fetchLabels();
          setOpenMenuIndex(null);

          // Show success message
          setSuccessMessage("Label deleted successfully!");
          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
        } else {
          setError(response.message || "Failed to delete label");
        }
      } catch (err) {
        console.error("Error deleting label:", err);
        setError("Failed to delete label");
      } finally {
        setActionLoading(false);
      }
    } else {
      setOpenMenuIndex(null);
    }
  };

  // Handle menu toggle
  const toggleMenu = (index) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  // Handle edit
  const handleEdit = (label) => {
    setSelectedLabel(label);
    setShowEditModal(true);
    setOpenMenuIndex(null);
  };

  // Close menu when clicking outside
  const closeMenu = () => {
    setOpenMenuIndex(null);
  };

  if (loading && labels.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 text-teal-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading labels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Label List</h1>
            <p className="text-gray-600 mt-1">Manage all image labels</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={actionLoading}
          >
            <Plus size={18} />
            <span>Create new label</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
            <p className="font-medium">Error: {error}</p>
            <button
              onClick={() => setError(null)}
              className="text-sm text-red-600 hover:text-red-800 underline mt-1"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 flex items-center gap-2">
            <span className="text-sm font-medium">{successMessage}</span>
            <button
              onClick={() => setSuccess(false)}
              className="ml-auto text-green-600 hover:text-green-800"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Labels Container */}
        <div className="bg-white rounded-lg border border-gray-300 p-6">
          {/* Loading overlay for initial load */}
          {loading && !loadingMore && labels.length === 0 && (
            <div className="text-center py-8">
              <Loader2 className="animate-spin h-8 w-8 text-teal-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading labels...</p>
            </div>
          )}

          {/* Labels Grid */}
          {labels.length > 0 && (
            <>
              <div className="flex flex-wrap gap-3 mb-6">
                {labels.map((label, index) => (
                  <div
                    key={label._id}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2 group relative"
                  >
                    <span className="text-sm text-gray-800">{label.label}</span>

                    {/* 3-dot menu button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMenu(index);
                      }}
                      className="p-1 text-gray-500 hover:text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading || loadingMore}
                    >
                      <MoreVertical size={16} />
                    </button>

                    {/* Dropdown menu */}
                    {openMenuIndex === index && (
                      <div className="absolute right-0 top-full mt-1 z-20 w-32 bg-white border border-gray-200 rounded-lg shadow-lg">
                        <button
                          onClick={() => handleEdit(label)}
                          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <Edit2 size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(label._id, label.label)}
                          className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Load More section */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                {/* Show current count */}
                <div className="text-sm text-gray-600 mb-4">
                  Showing {labels.length} labels
                </div>

                {/* Load More button */}
                {hasMore && (
                  <div className="text-center">
                    <button
                      onClick={loadMore}
                      disabled={loadingMore}
                      className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingMore ? (
                        <>
                          <Loader2 className="animate-spin h-4 w-4" />
                          Loading more...
                        </>
                      ) : (
                        <>Load More Labels</>
                      )}
                    </button>
                  </div>
                )}

                {/* Show when all labels are loaded */}
                {!hasMore && labels.length > 0 && (
                  <div className="text-center text-sm text-gray-500">
                    All labels loaded
                  </div>
                )}
              </div>
            </>
          )}

          {/* Show empty state */}
          {!loading && labels.length === 0 && (
            <div className="text-center py-8">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              </div>
              <p className="text-gray-600">No labels found</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-2 text-sm text-teal-600 hover:text-teal-800"
              >
                Create your first label
              </button>
            </div>
          )}
        </div>

        {/* Add New Label Modal */}
        {showAddModal && (
          <AddNewLabel
            onClose={() => setShowAddModal(false)}
            onSave={handleAddLabel}
            loading={actionLoading}
          />
        )}

        {/* Edit Label Modal */}
        {showEditModal && selectedLabel && (
          <EditLabel
            label={selectedLabel}
            onClose={() => {
              setShowEditModal(false);
              setSelectedLabel(null);
            }}
            onSave={handleEditSave}
            loading={actionLoading}
          />
        )}
      </div>

      {/* Close menu when clicking outside */}
      {openMenuIndex !== null && (
        <div className="fixed inset-0 z-10" onClick={closeMenu} />
      )}
    </div>
  );
}
