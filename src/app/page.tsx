'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import dynamic from 'next/dynamic';

// Create a completely client-side only application component
// This prevents any hydration issues with the application
const ClientOnlyApplication = dynamic(
  () => import('./components/client-application'),
  { ssr: false }
);

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
          
          <div className="card p-4">
            <ClientOnlyApplication />
          </div>
        </div>
      </main>
    </div>
  );
}
