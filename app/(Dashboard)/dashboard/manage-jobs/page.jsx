"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronDown, Loader2, CheckCircle, Search } from "lucide-react";
import { postJob } from "@/action/job.action";
import { getUsers } from "@/action/user.action";

export default function ManageJobs() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Inspector dropdown state
  const [inspectors, setInspectors] = useState([]);
  const [loadingInspectors, setLoadingInspectors] = useState(false);
  const [showInspectorDropdown, setShowInspectorDropdown] = useState(false);
  const [inspectorSearch, setInspectorSearch] = useState("");
  const [currentInspectorPage, setCurrentInspectorPage] = useState(1);
  const [totalInspectorPages, setTotalInspectorPages] = useState(1);
  const [hasMoreInspectors, setHasMoreInspectors] = useState(true);
  const dropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    inspector: "",
    feeStatus: "",
    fhaCase: "",
    streetAddress: "",
    siteContactPhone: "",
    siteContactName: "",
    dateCreated: new Date().toLocaleDateString("en-GB"),
    dateDue: "",
    specialNotesForInspector: "",
    formType: "RCI Residential Building Code Inspection",
    agreedFee: "",
    orderId: "",
    development: "Histrung Heights",
    specialNoteForApOrAr: "",
    siteContactEmail: "",
  });

  const [selectedInspector, setSelectedInspector] = useState(null);
  const [showFeeTypeDropdown, setShowFeeTypeDropdown] = useState(false);
  const [selectedFeeType, setSelectedFeeType] = useState("Select");

  const feeTypes = [
    "Standard",
    "Rush Order",
    "Occupied Fee",
    "Modified Fee",
    "Long Distance Fee",
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowInspectorDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch inspectors with pagination and search
  const fetchInspectors = useCallback(
    async (page = 1, search = "", reset = false) => {
      try {
        setLoadingInspectors(true);
        const limit = 10; // Fetch 10 at a time for pagination

        const data = await getUsers(page, limit, search, "2"); // role=2 for inspectors

        if (data.success) {
          // Filter only approved and non-suspended inspectors
          const approvedInspectors = data.data.filter(
            (inspector) =>
              inspector.isApproved === true && !inspector.isSuspended,
          );

          if (reset) {
            setInspectors(approvedInspectors);
          } else {
            setInspectors((prev) => [...prev, ...approvedInspectors]);
          }

          setTotalInspectorPages(data.metaData?.totalPage || 1);
          setHasMoreInspectors(page < (data.metaData?.totalPage || 1));
          setCurrentInspectorPage(page);
        }
      } catch (err) {
        console.error("Error fetching inspectors:", err);
        setError("Could not load inspectors list");
      } finally {
        setLoadingInspectors(false);
      }
    },
    [],
  );

  // Initial load
  useEffect(() => {
    fetchInspectors(1, "", true);
  }, [fetchInspectors]);

  // Handle inspector search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inspectorSearch !== "") {
        fetchInspectors(1, inspectorSearch, true);
      } else {
        fetchInspectors(1, "", true);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [inspectorSearch, fetchInspectors]);

  // Load more inspectors
  const loadMoreInspectors = () => {
    if (!loadingInspectors && hasMoreInspectors) {
      fetchInspectors(currentInspectorPage + 1, inspectorSearch, false);
    }
  };

  const handleInspectorSelect = (inspector) => {
    setSelectedInspector(inspector);
    setFormData((prev) => ({
      ...prev,
      inspector: inspector._id,
    }));
    setShowInspectorDropdown(false);
    setInspectorSearch("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFeeTypeSelect = (feeType) => {
    setSelectedFeeType(feeType);
    setFormData((prev) => ({
      ...prev,
      feeStatus: feeType,
    }));
    setShowFeeTypeDropdown(false);
  };

  const validateForm = () => {
    const requiredFields = [
      "inspector",
      "feeStatus",
      "fhaCase",
      "streetAddress",
      "siteContactPhone",
      "siteContactName",
      "dateDue",
      "formType",
      "agreedFee",
      "orderId",
      "siteContactEmail",
    ];

    for (const field of requiredFields) {
      if (!formData[field] || formData[field].trim() === "") {
        setError(`${field.replace(/([A-Z])/g, " $1")} is required`);
        return false;
      }
    }

    if (formData.specialNotesForInspector.length > 250) {
      setError("Note to inspector must be under 250 characters");
      return false;
    }

    if (formData.specialNoteForApOrAr.length > 250) {
      setError("Notes to AP/AR must be under 250 characters");
      return false;
    }

    if (
      isNaN(parseFloat(formData.agreedFee)) ||
      parseFloat(formData.agreedFee) <= 0
    ) {
      setError("Agreed fee must be a valid number greater than 0");
      return false;
    }

    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(formData.siteContactPhone.replace("+1 ", ""))) {
      setError("Please enter a valid phone number");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.siteContactEmail)) {
      setError("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Clean phone number
      const cleanPhone = formData.siteContactPhone.replace(/\D/g, "");
      const formattedPhone = cleanPhone.startsWith("1")
        ? cleanPhone.substring(1)
        : cleanPhone;

      // Format date properly
      const formatDateForAPI = (dateString) => {
        if (!dateString) return new Date().toISOString();
        const date = new Date(dateString);
        return date.toISOString();
      };

      // Prepare data for API with CORRECT field names and formats
      const jobData = {
        inspector: formData.inspector,
        feeStatus: formData.feeStatus,
        fhaCaseDetailsNo: formData.fhaCase,
        streetAddress: formData.streetAddress,
        siteContactPhone: formattedPhone,
        siteContactName: formData.siteContactName,
        siteContactEmail: formData.siteContactEmail,
        dueDate: formatDateForAPI(formData.dateDue),
        specialNotesForInspector: formData.specialNotesForInspector,
        formType: "RCI Residential Building Code Inspection",
        agreedFee: parseFloat(formData.agreedFee),
        orderId: formData.orderId,
        developmentName: formData.development,
        specialNoteForApOrAr: formData.specialNoteForApOrAr,
      };

      // console.log("Submitting job data (FINAL):", jobData);

      const response = await postJob(jobData);

      if (response.success) {
        setSuccess(true);

        // Reset form
        setFormData({
          inspector: "",
          feeStatus: "",
          fhaCase: "",
          streetAddress: "",
          siteContactPhone: "",
          siteContactName: "",
          dateCreated: new Date().toLocaleDateString("en-GB"),
          dateDue: "",
          specialNotesForInspector: "",
          formType: "RCI Residential Building Code Inspection",
          agreedFee: "",
          orderId: "",
          development: "Histrung Heights",
          specialNoteForApOrAr: "",
          siteContactEmail: "",
        });
        setSelectedInspector(null);
        setSelectedFeeType("Select");

        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      } else {
        setError(response.message || "Failed to create job");
      }
    } catch (err) {
      console.error("Error creating job:", err);
      setError(err.message || "An error occurred while creating the job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 p-4 md:p-6'>
      <div className=''>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h1 className='text-2xl md:text-3xl font-bold text-gray-800 mb-2'>
              Create new job
            </h1>
            <p className='text-gray-600'>
              Fill in the details below to create a new inspection job
            </p>
          </div>

          {success && (
            <div className='flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg'>
              <CheckCircle size={20} />
              <span className='text-sm font-medium'>
                Job created successfully!
              </span>
            </div>
          )}
        </div>

        {error && (
          <div className='mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200'>
            <p className='font-medium'>Error: {error}</p>
            <button
              onClick={() => setError(null)}
              className='text-sm text-red-600 hover:text-red-800 underline mt-1'>
              Dismiss
            </button>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className='bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 text-sm'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8'>
            {/* Left Column */}
            <div className='space-y-6'>
              {/* Inspector Select Dropdown */}
              <div className='relative' ref={dropdownRef}>
                <label className='block font-medium text-gray-700 mb-2'>
                  <span className='font-bold'>Select Inspector*</span>
                </label>

                {/* Selected Inspector Display */}
                <input
                  type='hidden'
                  name='inspector'
                  value={formData.inspector}
                  required
                />
                <button
                  type='button'
                  onClick={() =>
                    setShowInspectorDropdown(!showInspectorDropdown)
                  }
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white text-left flex justify-between items-center ${
                    !selectedInspector
                      ? "border-gray-300 text-gray-400"
                      : "border-gray-300 text-gray-800"
                  }`}>
                  <span>
                    {selectedInspector
                      ? `${selectedInspector.firstName} ${selectedInspector.lastName} (${selectedInspector.email})`
                      : "Select Inspector"}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      showInspectorDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Inspector Dropdown */}
                {showInspectorDropdown && (
                  <div className='absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-hidden flex flex-col'>
                    {/* Search Input */}
                    <div className='p-3 border-b border-gray-200'>
                      <div className='relative'>
                        <Search
                          className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                          size={18}
                        />
                        <input
                          type='text'
                          placeholder='Search inspectors...'
                          value={inspectorSearch}
                          onChange={(e) => setInspectorSearch(e.target.value)}
                          className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500'
                          autoFocus
                        />
                      </div>
                    </div>

                    {/* Inspector List */}
                    <div className='overflow-y-auto flex-1'>
                      {loadingInspectors && inspectors.length === 0 ? (
                        <div className='p-4 text-center'>
                          <Loader2 className='animate-spin mx-auto h-5 w-5 text-gray-400' />
                          <p className='text-sm text-gray-500 mt-2'>
                            Loading inspectors...
                          </p>
                        </div>
                      ) : inspectors.length === 0 ? (
                        <div className='p-4 text-center text-gray-500'>
                          No inspectors found
                        </div>
                      ) : (
                        <>
                          {inspectors.map((inspector) => (
                            <button
                              key={inspector._id}
                              type='button'
                              onClick={() => handleInspectorSelect(inspector)}
                              className={`w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                                selectedInspector?._id === inspector._id
                                  ? "bg-teal-50"
                                  : ""
                              }`}>
                              <div className='font-medium text-gray-800'>
                                {inspector.firstName} {inspector.lastName} -{" "}
                                {inspector.userId}
                              </div>
                              <div className='text-sm text-gray-600'>
                                {inspector.email}
                              </div>
                            </button>
                          ))}

                          {/* Load More Button */}
                          {hasMoreInspectors && (
                            <button
                              type='button'
                              onClick={loadMoreInspectors}
                              disabled={loadingInspectors}
                              className='w-full px-4 py-3 text-center text-teal-600 hover:bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-2 disabled:opacity-50'>
                              {loadingInspectors ? (
                                <>
                                  <Loader2 className='animate-spin h-4 w-4' />
                                  Loading...
                                </>
                              ) : (
                                "Load More"
                              )}
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Fee Status */}
              <div className='relative'>
                <label className='block font-medium text-gray-700 mb-2'>
                  <span className='font-bold'>Fee Status*</span>
                </label>
                <div className='relative'>
                  <input
                    type='hidden'
                    name='feeStatus'
                    value={formData.feeStatus}
                    required
                  />
                  <button
                    type='button'
                    onClick={() => setShowFeeTypeDropdown(!showFeeTypeDropdown)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white text-left flex justify-between items-center ${
                      selectedFeeType === "Select"
                        ? "border-gray-300 text-gray-400"
                        : "border-gray-300 text-gray-800"
                    }`}>
                    <span>{selectedFeeType}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        showFeeTypeDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {showFeeTypeDropdown && (
                    <div className='absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto'>
                      {feeTypes.map((feeType) => (
                        <button
                          key={feeType}
                          type='button'
                          onClick={() => handleFeeTypeSelect(feeType)}
                          className='w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0'>
                          {feeType}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* FHA Case Details */}
              <div>
                <label className='block font-medium text-gray-700 mb-2'>
                  <span className='font-bold'>FHA Case Details*</span>
                </label>
                <input
                  type='text'
                  name='fhaCase'
                  value={formData.fhaCase}
                  onChange={handleChange}
                  placeholder='e.g., 511-3746727'
                  required
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-400'
                />
              </div>

              {/* Street Address */}
              <div>
                <label className='block font-medium text-gray-700 mb-2'>
                  <span className='font-bold'>Street Address*</span>
                </label>
                <input
                  type='text'
                  name='streetAddress'
                  value={formData.streetAddress}
                  onChange={handleChange}
                  placeholder='e.g., 1184 Crestview Drive, San Jose, California 95132'
                  required
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-400'
                />
              </div>

              {/* Site Contact Phone */}
              <div>
                <label className='block font-medium text-gray-700 mb-2'>
                  <span className='font-bold'>Site Contact Phone*</span>
                </label>
                <div className='relative'>
                  <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'>
                    +1
                  </span>
                  <input
                    type='tel'
                    name='siteContactPhone'
                    value={formData.siteContactPhone}
                    onChange={handleChange}
                    placeholder='111 222 3333'
                    required
                    className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-400'
                  />
                </div>
              </div>

              {/* Site Contact Name */}
              <div>
                <label className='block font-medium text-gray-700 mb-2'>
                  <span className='font-bold'>Site Contact Name*</span>
                </label>
                <input
                  type='text'
                  name='siteContactName'
                  value={formData.siteContactName}
                  onChange={handleChange}
                  placeholder='John Doe'
                  required
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-400'
                />
              </div>

              {/* Date Created */}
              <div>
                <label className='block font-medium text-gray-700 mb-2'>
                  <span className='font-bold'>Date Created*</span>
                </label>
                <input
                  type='text'
                  name='dateCreated'
                  value={formData.dateCreated}
                  onChange={handleChange}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 cursor-not-allowed'
                  readOnly
                />
              </div>

              {/* Note to Inspector */}
              <div>
                <label className='block font-medium text-gray-700 mb-2'>
                  <span className='font-bold'>Note to Inspector*</span>
                </label>
                <textarea
                  name='specialNotesForInspector'
                  value={formData.specialNotesForInspector}
                  onChange={handleChange}
                  placeholder='Write your notes here...'
                  rows='3'
                  maxLength='250'
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-400 resize-none'
                />
                <p className='text-xs text-gray-500 mt-1'>
                  {formData.specialNotesForInspector.length}/250 characters
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className='space-y-6'>
              {/* Form Type */}
              <div>
                <label className='block font-medium text-gray-700 mb-2'>
                  <span className='font-bold'>Form Type*</span>
                </label>
                <select
                  name='formType'
                  value={formData.formType}
                  onChange={handleChange}
                  required
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white'>
                  <option value='RCI Residential Building Code Inspection'>
                    RCI Residential Building Code Inspection
                  </option>
                  <option value='Unknown'>Unknown</option>
                </select>
              </div>

              {/* Agreed Fee */}
              <div>
                <label className='block font-medium text-gray-700 mb-2'>
                  <span className='font-bold'>Agreed Fee*</span>
                </label>
                <div className='relative'>
                  <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'>
                    $
                  </span>
                  <input
                    type='number'
                    name='agreedFee'
                    value={formData.agreedFee}
                    onChange={handleChange}
                    placeholder='e.g., 50'
                    required
                    min='0'
                    step='0.01'
                    className='w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-400'
                  />
                </div>
              </div>

              {/* Order ID */}
              <div>
                <label className='block font-medium text-gray-700 mb-2'>
                  <span className='font-bold'>Order ID*</span>
                </label>
                <input
                  type='text'
                  name='orderId'
                  value={formData.orderId}
                  onChange={handleChange}
                  placeholder='e.g., 88132188'
                  required
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-400'
                />
              </div>

              {/* Development */}
              <div>
                <label className='block font-medium text-gray-700 mb-2'>
                  <span className='font-bold'>Development*</span>
                </label>
                <input
                  type='text'
                  name='development'
                  value={formData.development}
                  onChange={handleChange}
                  required
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                />
              </div>

              {/* Site Contact Email */}
              <div>
                <label className='block font-medium text-gray-700 mb-2'>
                  <span className='font-bold'>Site Contact Email*</span>
                </label>
                <input
                  type='email'
                  name='siteContactEmail'
                  value={formData.siteContactEmail}
                  onChange={handleChange}
                  placeholder='john.doe@example.com'
                  required
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-400'
                />
              </div>

              {/* Date Due */}
              <div>
                <label className='block font-medium text-gray-700 mb-2'>
                  <span className='font-bold'>Date Due*</span>
                </label>
                <input
                  type='date'
                  name='dateDue'
                  value={formData.dateDue}
                  onChange={handleChange}
                  required
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                />
              </div>

              {/* Notes to AP/AR */}
              <div>
                <label className='block font-medium text-gray-700 mb-2'>
                  <span className='font-bold'>Notes to AP/AR*</span>
                </label>
                <textarea
                  name='specialNoteForApOrAr'
                  value={formData.specialNoteForApOrAr}
                  onChange={handleChange}
                  placeholder='Write your notes here...'
                  rows='3'
                  maxLength='250'
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-400 resize-none'
                />
                <p className='text-xs text-gray-500 mt-1'>
                  {formData.specialNoteForApOrAr.length}/250 characters
                </p>
              </div>
            </div>
          </div>

          <div className='my-8 border-t border-gray-200'></div>

          <div className='flex justify-end'>
            <button
              type='submit'
              disabled={loading || !selectedInspector}
              className='px-8 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'>
              {loading ? (
                <>
                  <Loader2 className='animate-spin' size={20} />
                  Creating Job...
                </>
              ) : (
                "Assign Job"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
