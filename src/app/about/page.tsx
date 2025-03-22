'use client';

import Link from 'next/link';

export default function AboutPage() {
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
        <h1 className="text-lg font-semibold">About VisualAI</h1>
      </header>

      <main className="mt-16 p-4 flex-1">
        <div className="max-w-3xl mx-auto">
          <div className="card mb-6">
            <h2 className="card-title">Project Overview</h2>
            <p className="mb-4">
              VisualAI is an innovative tool designed to help writers, creators, and developers transform written 
              content into visual novel formats. By leveraging AI technology, VisualAI streamlines the process of 
              creating interactive narratives from existing text sources.
            </p>
            <p className="mb-4">
              Whether you're adapting a novel, creating an original visual novel, or experimenting with interactive storytelling, 
              VisualAI provides the tools you need to bring your vision to life.
            </p>
          </div>
          
          <div className="card mb-6">
            <h2 className="card-title">Key Features</h2>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>
                <strong>PDF Text Extraction</strong> - Automatically extract and parse dialogue from PDF documents
              </li>
              <li>
                <strong>Scene Editor</strong> - Create and modify scenes with an intuitive dialogue editor
              </li>
              <li>
                <strong>Asset Management</strong> - Organize and manage audio, video, and image files for your visual novel
              </li>
              <li>
                <strong>Integrated Workspace</strong> - Access all tools in one convenient environment
              </li>
              <li>
                <strong>AI Assistance</strong> - Get help with content creation and formatting
              </li>
              <li>
                <strong>Preview System</strong> - See how your visual novel will look and feel in real-time
              </li>
            </ul>
          </div>
          
          <div className="card mb-6">
            <h2 className="card-title">Technology Stack</h2>
            <p className="mb-4">
              VisualAI is built with modern web technologies to ensure a smooth, responsive experience:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
              <div className="p-2 bg-gray-50 rounded text-center border border-gray-200">
                <span className="font-medium">Next.js</span>
              </div>
              <div className="p-2 bg-gray-50 rounded text-center border border-gray-200">
                <span className="font-medium">React</span>
              </div>
              <div className="p-2 bg-gray-50 rounded text-center border border-gray-200">
                <span className="font-medium">TypeScript</span>
              </div>
              <div className="p-2 bg-gray-50 rounded text-center border border-gray-200">
                <span className="font-medium">Tailwind CSS</span>
              </div>
              <div className="p-2 bg-gray-50 rounded text-center border border-gray-200">
                <span className="font-medium">PDF.js</span>
              </div>
              <div className="p-2 bg-gray-50 rounded text-center border border-gray-200">
                <span className="font-medium">Web Audio API</span>
              </div>
            </div>
          </div>
          
          <div className="card">
            <h2 className="card-title">Contact & Support</h2>
            <p className="mb-4">
              Have questions, feedback, or need assistance with VisualAI? We're here to help!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href="mailto:support@visualai.example.com" className="btn-primary text-center">
                Email Support
              </a>
              <a href="/docs" className="btn-outline text-center">
                Documentation
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 