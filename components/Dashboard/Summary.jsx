"use client"

import { useState } from 'react';
import { Calendar, Phone, Mail, MapPin, User, FileText, Building } from 'lucide-react';

export default function Summary({ jobData }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Mobile Stats Cards */}
      <div className="md:hidden grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Order ID</p>
          <p className="text-sm font-semibold text-gray-800 truncate">
            {jobData.orderId || 'N/A'}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Status</p>
          <p className="text-sm font-semibold text-gray-800">
            {jobData.feeStatus || 'N/A'}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Fee</p>
          <p className="text-sm font-semibold text-gray-800">
            ${jobData.agreedFee || '0'}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Due Date</p>
          <p className="text-sm font-semibold text-gray-800">
            {formatDate(jobData.dueDate)}
          </p>
        </div>
      </div>

      {/* Inspection Details */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-200">
          Inspection Details
        </h2>
        
        <div className="space-y-3">
          <DetailRowMobile 
            label="Inspector" 
            value={`${jobData.inspector?.firstName || ''} ${jobData.inspector?.lastName || ''}`.trim() || 'Unassigned'}
            icon={<User size={16} />}
          />
          <DetailRowMobile 
            label="FHA Case Details" 
            value={jobData.fhaCaseDetailsNo || 'N/A'}
            icon={<FileText size={16} />}
          />
          <DetailRowMobile 
            label="Order ID" 
            value={jobData.orderId || 'N/A'}
            icon={<FileText size={16} />}
          />
          <DetailRowMobile 
            label="Form Type" 
            value={jobData.formType || 'N/A'}
            icon={<FileText size={16} />}
          />
          <DetailRowMobile 
            label="Fee Status" 
            value={jobData.feeStatus || 'N/A'}
            icon={<FileText size={16} />}
          />
          <DetailRowMobile 
            label="Agreed Fee" 
            value={`$${jobData.agreedFee || '0'}`}
            icon={<FileText size={16} />}
          />
        </div>

        {/* Address Section - Mobile Full Width */}
        <div className="md:hidden bg-gray-50 rounded-lg p-4 mt-4">
          <div className="flex items-start gap-3 mb-2">
            <MapPin className="text-gray-400 mt-0.5" size={16} />
            <div>
              <p className="text-xs text-gray-600 mb-1">Address</p>
              <p className="text-sm font-medium text-gray-900">
                {jobData.streetAddress || 'Address not available'}
              </p>
            </div>
          </div>
          
          {jobData.developmentName && (
            <div className="flex items-center gap-3 mt-3">
              <Building className="text-gray-400" size={16} />
              <div>
                <p className="text-xs text-gray-600 mb-1">Development</p>
                <p className="text-sm font-medium text-gray-900">
                  {jobData.developmentName}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Address Row */}
        <div className="hidden md:block">
          <DetailRow 
            label="Street Address" 
            value={jobData.streetAddress || 'Address not available'}
          />
          <DetailRow 
            label="Development" 
            value={jobData.developmentName || 'N/A'}
          />
        </div>
      </div>

      {/* Submission Details */}
      <div className="pt-4 border-t border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Submission Details
        </h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Calendar className="text-gray-400" size={16} />
            <div>
              <p className="text-xs text-gray-600">Created Date</p>
              <p className="text-sm font-medium text-teal-600">
                {formatDate(jobData.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="text-gray-400" size={16} />
            <div>
              <p className="text-xs text-gray-600">Due Date</p>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(jobData.dueDate)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Site Contact Information */}
      <div className="pt-4 border-t border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Site Contact Information
        </h2>
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="inline-block bg-teal-600 text-white text-xs px-3 py-1 rounded-full">
            {jobData.siteContactEmail || 'No email provided'}
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="text-gray-400" size={16} />
              <div>
                <p className="text-xs text-gray-600">Site Contact Name</p>
                <p className="text-sm font-medium text-gray-900">
                  {jobData.siteContactName || 'N/A'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="text-gray-400" size={16} />
              <div>
                <p className="text-xs text-gray-600">Site Contact Phone</p>
                <p className="text-sm font-medium text-gray-900">
                  {jobData.siteContactPhone || 'N/A'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Mail className="text-gray-400" size={16} />
              <div>
                <p className="text-xs text-gray-600">Site Contact Email</p>
                <p className="text-sm font-medium text-gray-900">
                  {jobData.siteContactEmail || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Created By Information */}
      <div className="pt-4 border-t border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Created By
        </h2>
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <DetailRow 
            label="Created By" 
            value={`${jobData.createdBy?.firstName || ''} ${jobData.createdBy?.lastName || ''}`.trim() || 'Unknown'}
          />
          <DetailRow 
            label="Role" 
            value={jobData.createdBy?.role || 'Unknown'}
          />
          <DetailRow 
            label="Email" 
            value={jobData.createdBy?.email || 'N/A'}
          />
        </div>
      </div>
    </div>
  );
}

// Desktop Detail Row
function DetailRow({ label, value }) {
  return (
    <div className="flex items-start gap-2 py-2">
      <span className="text-sm text-gray-600 min-w-[180px]">{label}</span>
      <span className="text-sm text-gray-400">:</span>
      <span className="text-sm text-gray-900 flex-1">{value}</span>
    </div>
  );
}

// Mobile Detail Row
function DetailRowMobile({ label, value, icon }) {
  return (
    <div className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-3">
        <div className="text-gray-400">
          {icon}
        </div>
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <span className="text-sm font-medium text-gray-900 text-right max-w-[60%] truncate">
        {value}
      </span>
    </div>
  );
}