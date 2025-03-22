'use client';

import React from 'react';

export interface Asset {
  id: string;
  name: string;
  type: 'character' | 'background' | 'prop';
  url: string;
}

export function AssetManager() {
  return (
    <div className="flex-center p-8">
      <div className="max-w-lg p-6 text-center rounded-lg bg-blue-50 border border-blue-100">
        <h3 className="mb-3 text-lg font-medium text-blue-800">Assets Manager Coming Soon</h3>
        <p className="mb-4 text-blue-600">
          The Assets Manager will allow you to upload and manage characters, backgrounds, and props for your scenes.
        </p>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="p-4 text-center bg-white rounded shadow-sm">
            <div className="flex-center h-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <p className="mt-2 text-sm font-medium text-gray-700">Characters</p>
          </div>
          <div className="p-4 text-center bg-white rounded shadow-sm">
            <div className="flex-center h-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              </svg>
            </div>
            <p className="mt-2 text-sm font-medium text-gray-700">Backgrounds</p>
          </div>
          <div className="p-4 text-center bg-white rounded shadow-sm">
            <div className="flex-center h-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <p className="mt-2 text-sm font-medium text-gray-700">Props</p>
          </div>
        </div>
        <p className="text-sm text-gray-500">
          This feature is currently under development and will be available in a future update.
        </p>
      </div>
    </div>
  );
}
