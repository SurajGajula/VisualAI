'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full bg-gray-100 py-3 px-4 fixed top-0 flex justify-between items-center shadow-sm">
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
                className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Profile
              </Link>
              <button 
                onClick={() => logout()}
                className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/auth/login" 
                className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Login
              </Link>
              <Link 
                href="/auth/register" 
                className="text-sm px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md mt-16">
        <h1 className="text-3xl font-bold mb-6 text-center">Welcome to the App</h1>
        
        <p className="text-center text-gray-600 mb-8">
          This application uses PostgreSQL for user authentication.
        </p>

        {isAuthenticated ? (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded">
              <h2 className="font-semibold text-lg mb-3">Your Account Details</h2>
              <p className="mb-1"><span className="font-medium">Username:</span> {user?.username}</p>
              <p className="mb-1"><span className="font-medium">Email:</span> {user?.email}</p>
              <p className="mb-1"><span className="font-medium">User ID:</span> {user?.id}</p>
              <p><span className="font-medium">Account created:</span> {user?.created_at && new Date(user.created_at).toLocaleString()}</p>
            </div>
            
            <Link 
              href="/profile" 
              className="block w-full text-center py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              View Your Profile
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-center text-gray-600">
              Please sign in or create an account to get started.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <Link 
                href="/auth/login" 
                className="block text-center py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Sign In
              </Link>
              
              <Link 
                href="/auth/register" 
                className="block text-center py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
