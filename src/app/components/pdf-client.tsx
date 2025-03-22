'use client';

import { useEffect, useState } from 'react';

// This component will handle PDF.js loading in client-side only
export function usePdfJs() {
  const [pdfJs, setPdfJs] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPdfJs() {
      try {
        setIsLoading(true);
        
        // Use a more reliable dynamic import pattern
        const pdfJsLibPromise = import('pdfjs-dist/legacy/build/pdf').catch(err => {
          console.error('Failed to load PDF.js main module:', err);
          throw new Error('Failed to load PDF.js');
        });
        
        const pdfWorkerPromise = import('pdfjs-dist/legacy/build/pdf.worker.entry').catch(err => {
          console.error('Failed to load PDF.js worker:', err);
          throw new Error('Failed to load PDF.js worker');
        });
        
        // Wait for both to load
        const [pdfJsLib, pdfWorker] = await Promise.all([pdfJsLibPromise, pdfWorkerPromise]);
        
        // Configure the worker - this is safe because we're only doing it client-side
        if (typeof window !== 'undefined') {
          pdfJsLib.GlobalWorkerOptions.workerSrc = pdfWorker.default || pdfWorker;
        }
        
        setPdfJs(pdfJsLib);
        setError(null);
        console.log('PDF.js loaded successfully');
      } catch (err) {
        console.error('Failed to load PDF.js:', err);
        setError('Failed to load PDF processing library');
      } finally {
        setIsLoading(false);
      }
    }
    
    // Only load PDF.js in the browser
    if (typeof window !== 'undefined') {
      loadPdfJs();
    } else {
      // If we're server-side rendering, don't try to load PDF.js
      setIsLoading(false);
    }
  }, []);

  return { pdfJs, isLoading, error };
}

// Extract text from a PDF file using PDF.js - simplified for debugging
export async function extractTextFromPdf(file: File, pdfJsLib: any): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    
    fileReader.onload = async (event) => {
      try {
        const typedArray = new Uint8Array(event.target?.result as ArrayBuffer);
        
        // Load the PDF using PDF.js
        const loadingTask = pdfJsLib.getDocument({ data: typedArray });
        const pdf = await loadingTask.promise;
        let allText = [];
        
        // Process each page
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          
          // Extract the text items
          const textItems = textContent.items.map((item: any) => item.str || '');
          const pageText = textItems.join(' ');
          allText.push(pageText);
        }
        
        // Join all pages
        const fullText = allText.join('\n\n');
        console.log("Raw extracted text sample:", fullText.substring(0, 200));
        resolve(fullText);
      } catch (error) {
        console.error('PDF extraction error:', error);
        reject(new Error('Failed to extract text from the PDF'));
      }
    };
    
    fileReader.onerror = () => {
      reject(new Error('Error reading the PDF file'));
    };
    
    fileReader.readAsArrayBuffer(file);
  });
} 