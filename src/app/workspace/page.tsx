'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Toolbar } from '../components/toolbar';

export default function WorkspacePage() {
  const { user, isAuthenticated } = useAuth();

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
        <h1 className="text-lg font-semibold">Integrated Workspace</h1>
        {isAuthenticated && (
          <span className="text-sm text-gray-600">
            Logged in as <span className="font-medium">{user?.username}</span>
          </span>
        )}
      </header>

      <main className="mt-16 p-4 flex-1">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="md:w-1/3 card p-4">
              <h2 className="text-lg font-semibold mb-2">Workspace Tools</h2>
              <p className="text-gray-600 text-sm mb-4">
                This workspace provides access to all tools in a single integrated environment. 
                Use the toolbar below to switch between different functions.
              </p>
              <div className="space-y-2">
                <div className="text-sm p-2 bg-blue-50 rounded text-blue-800 border border-blue-200">
                  <strong>Tip:</strong> Your work is automatically saved between tool switches.
                </div>
                <div className="text-sm p-2 bg-green-50 rounded text-green-800 border border-green-200">
                  <strong>AI Assistance:</strong> Each tool integrates with our AI for enhanced productivity.
                </div>
              </div>
            </div>
            <div className="md:w-2/3 card p-4">
              <h2 className="text-lg font-semibold mb-2">Getting Started</h2>
              <ol className="space-y-2 list-decimal pl-5">
                <li>Use the <strong>Parser</strong> tool to extract text from PDFs</li>
                <li>Switch to the <strong>View</strong> tool to preview your scene</li>
                <li>Use the <strong>Assets</strong> tool to manage media files</li>
                <li>Export your finished scene for use in your visual novel</li>
              </ol>
              <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200">
                <span className="text-sm text-gray-700">Need help? Check out our <a href="/docs" className="text-blue-600 hover:underline">documentation</a> or <a href="/support" className="text-blue-600 hover:underline">contact support</a>.</span>
              </div>
            </div>
          </div>
          
          <div className="card p-4">
            <Toolbar />
          </div>
        </div>
      </main>
    </div>
  );
} 