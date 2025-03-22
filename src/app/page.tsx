'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Toolbar } from './components/toolbar';

export default function Home() {
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header Bar */}
      <header className="w-full bg-white py-3 px-4 fixed top-0 flex-between shadow-sm z-10">
        <div className="text-sm">
          {authLoading ? (
            <span>Loading...</span>
          ) : isAuthenticated ? (
            <span>Welcome, <span className="font-semibold">{user?.username}</span>!</span>
          ) : (
            <span>Not logged in</span>
          )}
        </div>
        <div className="space-x-2">
          {isAuthenticated ? (
            <>
              <Link 
                href="/profile" 
                className="btn-outline text-sm py-1 px-3"
              >
                Profile
              </Link>
              <button 
                onClick={logout}
                className="btn-primary bg-red-600 hover:bg-red-700 text-sm py-1 px-3"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/auth/login" 
                className="btn-primary text-sm py-1 px-3"
              >
                Login
              </Link>
              <Link 
                href="/auth/register" 
                className="btn-primary bg-green-600 hover:bg-green-700 text-sm py-1 px-3"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="mt-16 p-4 flex-1">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2 text-blue-800">VisualAI</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Create visual novels from PDF documents, manage your scenes, and work with AI to enhance your storytelling.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="md:w-1/3 card p-4">
              <h2 className="text-lg font-semibold mb-2">Integrated Tools</h2>
              <p className="text-gray-600 text-sm mb-4">
                All the tools you need to create and manage your visual novel in one place.
                Use the toolbar below to switch between different functions.
              </p>
              <div className="space-y-2">
                <div className="text-sm p-2 bg-blue-50 rounded text-blue-800 border border-blue-200">
                  <strong>PDF Tool:</strong> Extract dialogue from PDF documents
                </div>
                <div className="text-sm p-2 bg-green-50 rounded text-green-800 border border-green-200">
                  <strong>Scene Viewer:</strong> Preview how your scene will look
                </div>
                <div className="text-sm p-2 bg-purple-50 rounded text-purple-800 border border-purple-200">
                  <strong>Asset Manager:</strong> Organize audio, video and images
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
              <div className="mt-4 flex justify-between">
                <Link href="/about" className="text-blue-600 hover:underline">
                  About VisualAI
                </Link>
                <Link href="/components-test" className="text-blue-600 hover:underline">
                  View Component Library
                </Link>
              </div>
            </div>
          </div>
          
          <div className="card p-4">
            <h2 className="card-title mb-4">All-In-One Workspace</h2>
            <Toolbar />
          </div>
        </div>
      </main>
    </div>
  );
}
