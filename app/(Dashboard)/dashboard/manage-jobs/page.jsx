"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function ManageJobs() {
  const [formData, setFormData] = useState({
    inspector: "",
    feeStatus: "",
    fhaCase: "",
    streetAddress: "",
    siteContactPhone: "",
    siteContactName: "",
    dateCreated: "22/11/2025",
    dateDue: "30/12/2025",
    noteToInspector: "",
    formType: "RCI Residential Building Code Inspection",
    agreedFee: "",
    orderId: "",
    development: "Histrung Heights",
    closingDate: "30/12/2025",
    notesToAPAR: "",
  });

  const [showFeeTypeDropdown, setShowFeeTypeDropdown] = useState(false);
  const [selectedFeeType, setSelectedFeeType] = useState("Select");

  const feeTypes = [
    "Standard",
    "Rush Order",
    "Occupied Fee",
    "Modified Fee",
    "Long Distance Fee",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Create new job
        </h1>
        <p className="text-gray-600 mb-8">
          Fill in the details below to create a new inspection job
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-sm "
        >
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 ">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Inspector Select */}
              <div>
                <label className="block font-medium text-gray-500 mb-2">
                  <span className="font-bold">Select Inspector*</span>
                </label>
                <select
                  name="inspector"
                  value={formData.inspector}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                >
                  <option value="">Select</option>
                  <option value="inspector1">Inspector 1</option>
                  <option value="inspector2">Inspector 2</option>
                  <option value="inspector3">Inspector 3</option>
                </select>
              </div>

              {/* Fee Status with Dropdown */}
              <div className="relative">
                <label className="block  font-medium text-gray-500 mb-2">
                  <span className="font-bold">Fee Status*</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowFeeTypeDropdown(!showFeeTypeDropdown)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white text-left flex justify-between items-center"
                  >
                    <span
                      className={
                        selectedFeeType === "Select"
                          ? "text-gray-400"
                          : "text-gray-800"
                      }
                    >
                      {selectedFeeType}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        showFeeTypeDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {showFeeTypeDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {feeTypes.map((feeType) => (
                        <button
                          key={feeType}
                          type="button"
                          onClick={() => {
                            setSelectedFeeType(feeType);
                            setShowFeeTypeDropdown(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                        >
                          {feeType}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* FHA Case Details */}
              <div>
                <label className="block  font-medium text-gray-500 mb-2">
                  <span className="font-bold">FHA Case Details*</span>
                </label>
                <input
                  type="text"
                  name="fhaCase"
                  value={formData.fhaCase}
                  onChange={handleChange}
                  placeholder="e.g., 511-3746727"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-400"
                />
              </div>

              {/* Street Address */}
              <div>
                <label className="block font-medium text-gray-500 mb-2">
                  <span className="font-bold">Street Address*</span>
                </label>
                <input
                  type="text"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleChange}
                  placeholder="e.g., 1184 Crestview Drive, San Jose, California 95132"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-400"
                />
              </div>

              {/* Site Contact Phone */}
              <div>
                <label className="block font-medium text-gray-500 mb-2">
                  <span className="font-bold">Site Contact Phone*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    +1
                  </span>
                  <input
                    type="tel"
                    name="siteContactPhone"
                    value={formData.siteContactPhone}
                    onChange={handleChange}
                    placeholder="111 222 3333"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Site Contact Name */}
              <div>
                <label className="block  font-medium text-gray-500 mb-2">
                  <span className="font-bold">Site Contact Name*</span>
                </label>
                <input
                  type="text"
                  name="siteContactName"
                  value={formData.siteContactName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-400"
                />
              </div>

              {/* Date Created */}
              <div>
                <label className="block font-medium text-gray-500 mb-2">
                  <span className="font-bold">Date Created*</span>
                </label>
                <input
                  type="text"
                  name="dateCreated"
                  value={formData.dateCreated}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50"
                  readOnly
                />
              </div>

              {/* Date Due */}
              <div>
                <label className="block font-medium text-gray-500 mb-2">
                  <span className="font-bold">Date Due*</span>
                </label>
                <input
                  type="text"
                  name="dateDue"
                  value={formData.dateDue}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50"
                  readOnly
                />
              </div>

              {/* Note to Inspector */}
              <div>
                <label className="block font-medium text-gray-500 mb-2">
                  <span className="font-bold">Note to Inspector*</span>
                </label>
                <textarea
                  name="noteToInspector"
                  value={formData.noteToInspector}
                  onChange={handleChange}
                  placeholder="Write your notes here..."
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-400 resize-none"
                />
                <p className=" text-gray-500 mt-2">
                  Keep notes under 250 characters.{" "}
                  {formData.noteToInspector.length}/250
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Form Type */}
              <div>
                <label className="block font-medium text-gray-500 mb-2">
                  <span className="font-bold">Form Type*</span>
                </label>
                <select
                  name="formType"
                  value={formData.formType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                >
                  <option value="RCI Residential Building Code Inspection">
                    RCI Residential Building Code Inspection
                  </option>
                  <option value="Commercial Inspection">
                    Commercial Inspection
                  </option>
                  <option value="Structural Inspection">
                    Structural Inspection
                  </option>
                </select>
              </div>

              {/* Agreed Fee */}
              <div>
                <label className="block font-medium text-gray-500 mb-2">
                  <span className="font-bold">Agreed Fee*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="text"
                    name="agreedFee"
                    value={formData.agreedFee}
                    onChange={handleChange}
                    placeholder="e.g., 50"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Order ID */}
              <div>
                <label className="block font-medium text-gray-500 mb-2">
                  <span className="font-bold">Order ID*</span>
                </label>
                <input
                  type="text"
                  name="orderId"
                  value={formData.orderId}
                  onChange={handleChange}
                  placeholder="e.g., 88132188"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-400"
                />
              </div>

              {/* Development */}
              <div>
                <label className="block  font-medium text-gray-500 mb-2">
                  <span className="font-bold">Development*</span>
                </label>
                <input
                  type="text"
                  name="development"
                  value={formData.development}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50"
                  readOnly
                />
              </div>

              {/* Site Contact Name (duplicate in right column as per image) */}
              <div>
                <label className="block font-medium text-gray-500 mb-2">
                  <span className="font-bold">Site Contact Name*</span>
                </label>
                <input
                  type="text"
                  name="siteContactNameRight"
                  value={formData.siteContactName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-400"
                />
              </div>

              {/* Site Contact Email */}
              <div>
                <label className="block  font-medium text-gray-500 mb-2">
                  <span className="font-bold">Site Contact Email*</span>
                </label>
                <input
                  type="email"
                  name="siteContactEmail"
                  value={formData.siteContactEmail}
                  onChange={handleChange}
                  placeholder="john.doe@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-400"
                />
              </div>

              {/* Closing Date */}
              <div>
                <label className="block font-medium text-gray-500 mb-2">
                  <span className="font-bold">Closing Date*</span>
                </label>
                <input
                  type="text"
                  name="closingDate"
                  value={formData.closingDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50"
                  readOnly
                />
              </div>

              {/* Notes to AP/AR */}
              <div>
                <label className="block  font-medium text-gray-500 mb-2">
                  <span className="font-bold">Notes to AP/AR*</span>
                </label>
                <textarea
                  name="notesToAPAR"
                  value={formData.notesToAPAR}
                  onChange={handleChange}
                  placeholder="Write your notes here..."
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-400 resize-none"
                />
                <p className=" text-gray-500 mt-2">
                  Keep notes under 250 characters. {formData.notesToAPAR.length}
                  /250
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="my-8 border-t border-gray-200"></div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-8 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              Assign Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
