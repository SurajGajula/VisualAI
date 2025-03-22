'use client';

import { useState } from 'react';
import { Scene } from './classes/scene';
import { usePdfJs, extractTextFromPdf } from './pdf-client';
import { createSceneFromText } from './parser';

interface PdfLoaderProps {
  onSceneLoaded?: (scene: Scene) => void;
  onError: (error: string) => void;
}

export function PdfLoader({ onSceneLoaded, onError }: PdfLoaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<string | null>(null);
  const [fileDetails, setFileDetails] = useState<{name: string, type: string} | null>(null);
  const [scene, setScene] = useState<Scene | null>(null);
  
  const { pdfJs, isLoading: isPdfJsLoading, error: pdfJsError } = usePdfJs();

  const extractTextFromTextFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;
          if (text) {
            resolve(text);
          } else {
            reject(new Error('Failed to read text from file'));
          }
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error reading text file'));
      };
      
      reader.readAsText(file);
    });
  };

  const processExtractedText = (text: string) => {
    try {
      console.log("================================");
      console.log("FULL EXTRACTED PDF TEXT:");
      console.log(text);
      console.log("================================ from here create the scene and dialogue objects");
      
      const newScene = createSceneFromText(text);
      
      setScene(newScene);
      
      if (onSceneLoaded) {
        onSceneLoaded(newScene);
      }
      
      console.log("Created scene:", newScene);
      console.log("Dialogue count:", newScene.dialogue.length);
      console.log("Speakers:", newScene.speakers);
      
      setProcessingStatus(`Successfully created scene with ${newScene.dialogue.length} dialogue lines and ${newScene.speakers.length} speakers`);
      setIsLoading(false);
      
      return newScene;
    } catch (error: any) {
      console.error("Error creating scene:", error);
      setError(`Error creating scene: ${error.message || 'Unknown error'}`);
      setIsLoading(false);
      throw error;
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setScene(null);
    setProcessingStatus('Processing file...');
    setFileDetails({ name: file.name, type: file.type });
    
    try {
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        if (pdfJs) {
          try {
            setProcessingStatus('Extracting text from PDF...');
            
            const extractedText = await extractTextFromPdf(file, pdfJs);
            
            processExtractedText(extractedText);
          } catch (pdfError: any) {
            console.error('PDF.js extraction error:', pdfError);
            setError(`PDF extraction failed: ${pdfError.message || 'Unknown error'}`);
            setIsLoading(false);
          }
        } else {
          setError("PDF processing couldn't be initialized. Please try again later.");
          setIsLoading(false);
        }
      } else {
        try {
          const fileText = await extractTextFromTextFile(file);
          
          processExtractedText(fileText);
        } catch (txtError: any) {
          console.error('File processing error:', txtError);
          setError(`File processing failed: ${txtError.message || 'Unknown error'}`);
          setIsLoading(false);
        }
      }
    } catch (error: any) {
      console.error('General processing error:', error);
      setError(`File processing error: ${error.message || 'Unknown error'}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="pdf-loader">
      {error && (
        <div className="alert-error">
          <h4 className="mb-2 font-medium">Error Processing File</h4>
          <p className="whitespace-pre-line">{error}</p>
        </div>
      )}
      
      {isLoading && (
        <div className="alert-info">
          <div className="flex-between mb-2">
            <h4 className="font-medium text-blue-700">Processing {fileDetails?.name}</h4>
          </div>
          
          <p className="mt-2 text-blue-700">
            {processingStatus || 'Processing file...'}
          </p>
        </div>
      )}
      
      {processingStatus && !isLoading && !error && (
        <div className="alert-success">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p>{processingStatus}</p>
          </div>
        </div>
      )}
      
      {scene && (
        <div className="card">
          <h3 className="mb-3 font-medium">Scene Preview</h3>
          
          <div className="mb-2">
            <h4 className="text-sm font-semibold text-gray-700">Speakers:</h4>
            <div className="flex flex-wrap gap-2 mt-1">
              {scene.speakers.map((speaker, index) => (
                <span key={index} className="px-2 py-1 text-xs rounded-full text-blue-800 bg-blue-100">
                  {speaker}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="mb-2 text-sm font-semibold text-gray-700">Dialogue:</h4>
            <div className="p-2 max-h-60 overflow-y-auto rounded bg-gray-50 border border-gray-200">
              {scene.dialogue.map((dialogue, index) => (
                <div key={index} className="mb-2 last:mb-0">
                  <span className="font-medium text-blue-700">{dialogue.speaker}:</span> {dialogue.line}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <div className="alert-info">
        <h3 className="mb-2 font-medium">Upload PDF for Text Extraction</h3>
        <p className="mb-3 text-sm">
          Upload a PDF file to extract and analyze its text content.
        </p>
        
        <input 
          type="file" 
          accept=".pdf,.txt" 
          onChange={handleFileSelect}
          className="form-file-input"
          disabled={isLoading || isPdfJsLoading}
        />
        
        {isPdfJsLoading && !isLoading && (
          <div className="flex items-center mt-3 text-blue-700">
            <svg className="w-5 h-5 mr-2 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading PDF support...
          </div>
        )}
        
        <div className="pt-3 mt-3 text-sm text-gray-600 border-t border-blue-100">
          <p className="mb-1 font-medium text-blue-700">Features:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Extract text from PDF files</li>
            <li>Process dialogue automatically</li>
            <li>Create scene data for visualization</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 