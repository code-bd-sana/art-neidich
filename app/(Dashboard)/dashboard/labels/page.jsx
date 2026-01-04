"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, MoreVertical, Edit2, Trash2 } from "lucide-react";
import AddNewLabel from "@/components/Dashboard/AddNewLabel";
import EditLabel from "@/components/Dashboard/EditLabel";

export default function Labels() {
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  
  // Only the labels from your list with IDs
  const [labels, setLabels] = useState([
    { id: 1, name: "Exterior Front Elevation" },
    { id: 2, name: "Exterior Left Elevation" },
    { id: 3, name: "Bathroom" },
    { id: 4, name: "Bedroom 2" },
    { id: 5, name: "Bedroom 3" },
    { id: 6, name: "Hallway" },
    { id: 7, name: "Utility / Laundry Room" },
    { id: 8, name: "Electric Panel" },
    { id: 9, name: "Family Room" },
    { id: 10, name: "Rear Elevation" },
    { id: 11, name: "Breakfast Nook" },
    { id: 12, name: "Kitchen" },
    { id: 13, name: "Exterior Right Elevation" },
    { id: 14, name: "Utilities On" },
    { id: 15, name: "Interior View Of Front Door" },
    { id: 16, name: "Bedroom" },
    { id: 17, name: "Den / Library" },
    { id: 18, name: "Primary - Owner Bedroom" },
    { id: 19, name: "Primary - Owner Bathroom" },
    { id: 20, name: "Primary - Owner Bathroom 2" },
    { id: 21, name: "Garage" }
  ]);

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

  // Handle delete
  const handleDelete = (labelId) => {
    if (confirm("Are you sure you want to delete this label?")) {
      setLabels(labels.filter(label => label.id !== labelId));
      setOpenMenuIndex(null);
    }
  };

  // Handle add new label
  const handleAddLabel = (labelName) => {
    const newLabel = {
      id: labels.length + 1,
      name: labelName
    };
    setLabels([...labels, newLabel]);
    setShowAddModal(false);
  };

  // Handle edit save
  const handleEditSave = (updatedLabel) => {
    setLabels(labels.map(label => 
      label.id === updatedLabel.id ? updatedLabel : label
    ));
    setShowEditModal(false);
    setSelectedLabel(null);
  };

  // Close menu when clicking outside
  const closeMenu = () => {
    setOpenMenuIndex(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Label List</h1>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center gap-2"
          >
            <Plus size={18} />
            <span>Create new label</span>
          </button>
        </div>

        {/* Labels Container */}
        <div className="bg-white rounded-lg border border-gray-300 p-6">
          {/* Labels Grid */}
          <div className="flex flex-wrap gap-3 mb-8">
            {labels.map((label, index) => (
              <div
                key={label.id}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2 group relative"
              >
                <span className="text-sm text-gray-800">{label.name}</span>
                
                {/* 3-dot menu button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMenu(index);
                  }}
                  className="p-1 text-gray-500 hover:text-gray-700 rounded hover:bg-gray-300"
                >
                  <MoreVertical size={16} />
                </button>
                
                {/* Dropdown menu */}
                {openMenuIndex === index && (
                  <div className="absolute right-0 top-full mt-1 z-10 w-32 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <button
                      onClick={() => handleEdit(label)}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <Edit2 size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(label.id)}
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

        </div>

        {/* Add New Label Modal */}
        {showAddModal && (
          <AddNewLabel 
            onClose={() => setShowAddModal(false)}
            onSave={handleAddLabel}
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
          />
        )}
      </div>

      {/* Close menu when clicking outside */}
      {openMenuIndex !== null && (
        <div 
          className="fixed inset-0 z-0"
          onClick={closeMenu}
        />
      )}
    </div>
  );
}