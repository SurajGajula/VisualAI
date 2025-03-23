'use client';

import { useState, useEffect } from 'react';
import { Toolbar } from './toolbar';

// This component ensures no hydration mismatches by only rendering on the client side
export default function ClientApplication() {
  // State to track if we're on client side
  const [isMounted, setIsMounted] = useState(false);

  // Set isMounted to true when component mounts on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Only render the application content on the client side
  // This prevents hydration mismatches
  if (!isMounted) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <Toolbar />;
} 