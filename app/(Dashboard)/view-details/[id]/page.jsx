"use client"

import EmailLog from '@/components/Dashboard/EmailLog';
import Photos from '@/components/Dashboard/Photos';
import Summary from '@/components/Dashboard/Summary';
import { useState } from 'react';

export default function ViewDetailsPage() {
  const [activeTab, setActiveTab] = useState('summary');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className=" bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="border-b border-gray-200 px-8 pt-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Inspection Details</h1>
          
          {/* Tabs */}
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('summary')}
              className={`pb-4 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'summary'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Summary
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              className={`pb-4 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'photos'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Photos
            </button>
            <button
              onClick={() => setActiveTab('emailLog')}
              className={`pb-4 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'emailLog'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Email Log
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {activeTab === 'summary' && <Summary />}
          {activeTab === 'photos' && <Photos />}
          {activeTab === 'emailLog' && <EmailLog />}
        </div>
      </div>
    </div>
  );
}