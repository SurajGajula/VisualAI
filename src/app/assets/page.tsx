'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Assets } from '../components/assets';

export default function AssetsPage() {
  const [activeTab, setActiveTab] = useState<'audio' | 'video' | 'images'>('audio');
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header Bar */}
      <header className="w-full bg-white py-3 px-4 fixed top-0 flex-between shadow-sm z-10">
        <Link href="/" className="text-blue-600 hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
        <h1 className="text-lg font-semibold">Asset Manager</h1>
      </header>

      <main className="mt-16 p-4 flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="card">
            <div className="flex border-b mb-4">
              <button 
                className={`px-4 py-2 font-medium ${activeTab === 'audio' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                onClick={() => setActiveTab('audio')}
              >
                Audio
              </button>
              <button 
                className={`px-4 py-2 font-medium ${activeTab === 'video' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                onClick={() => setActiveTab('video')}
              >
                Video
              </button>
              <button 
                className={`px-4 py-2 font-medium ${activeTab === 'images' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                onClick={() => setActiveTab('images')}
              >
                Images
              </button>
            </div>
            
            {/* Tab Content */}
            {activeTab === 'audio' && (
              <div>
                <Assets />
              </div>
            )}
            
            {activeTab === 'video' && (
              <div className="p-4 text-center bg-gray-50 rounded border border-gray-200">
                <p className="text-gray-700">Video assets management coming soon.</p>
              </div>
            )}
            
            {activeTab === 'images' && (
              <div className="p-4 text-center bg-gray-50 rounded border border-gray-200">
                <p className="text-gray-700">Image assets management coming soon.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 