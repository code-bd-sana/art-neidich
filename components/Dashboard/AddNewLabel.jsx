"use client";

import { X } from "lucide-react";
import { useState } from "react";

const AddNewLabel = ({ onClose, onSave, loading = false }) => {
  const [labelName, setLabelName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!labelName.trim()) {
      setError("Label name is required");
      return;
    }
    
    onSave(labelName.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg w-full max-w-sm mx-4">
        <div className="p-4 border-b border-gray-300">
          <h2 className="text-lg font-semibold text-gray-800">Create New Label</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="font-bold">Label Name*</span>
            </label>
            <input
              type="text"
              value={labelName}
              onChange={(e) => {
                setLabelName(e.target.value);
                setError("");
              }}
              placeholder='e.g., Varanda'
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 ${
                error ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-teal-500"
              }`}
              autoFocus
              disabled={loading}
            />
            {error && (
              <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
          </div>
          
          <div className="flex justify-end gap-3 pt-3 border-t border-gray-300">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !labelName.trim()}
              className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Label"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewLabel;