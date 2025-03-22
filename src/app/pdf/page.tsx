'use client';

import { PdfLoader } from '../components/pdf-loader';
import { useState } from 'react';
import { Scene } from '../components/classes/scene';
import { ViewScene } from '../components/view';
import Link from 'next/link';

export default function PdfPage() {
  const [scene, setScene] = useState<Scene | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showViewer, setShowViewer] = useState(false);

  const handleSceneLoaded = (newScene: Scene) => {
    setScene(newScene);
    setShowViewer(true);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setShowViewer(false);
  };

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
        <h1 className="text-lg font-semibold">PDF Parser</h1>
      </header>

      <main className="mt-16 p-4 flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h2 className="card-title">PDF to Scene Converter</h2>
            <p className="mb-4">Upload a PDF file to convert its dialogue into a visual novel scene.</p>
            
            <PdfLoader 
              onSceneLoaded={handleSceneLoaded} 
              onError={handleError} 
            />
          </div>
          
          {showViewer && scene && (
            <div className="mt-8">
              <h2 className="card-title">Scene Preview</h2>
              <ViewScene scene={scene} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 