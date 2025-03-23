'use client';

import { useState, useEffect } from 'react';

export interface PDFProcessorState {
  isReady: boolean;
  isLoading: boolean;
  error: string | null;
}

export function usePdfProcessor() {
  const [state, setState] = useState<PDFProcessorState>({
    isReady: false,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    async function loadPdfJs() {
      if (typeof window === 'undefined') return;
      
      try {
        setState(prev => ({ ...prev, isLoading: true }));
        
        if (window.pdfjsLib) {
          setState({
            isReady: true,
            isLoading: false,
            error: null
          });
          return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        script.async = true;
        
        const scriptLoadPromise = new Promise<void>((resolve, reject) => {
          script.onload = () => {
            try {
              if (window.pdfjsLib) {
                window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                resolve();
              } else {
                reject(new Error('PDF.js library loaded but window.pdfjsLib is not available'));
              }
            } catch (error) {
              reject(error);
            }
          };
          
          script.onerror = () => {
            reject(new Error('Failed to load PDF.js library from CDN'));
          };
        });
        
        document.head.appendChild(script);
        
        await scriptLoadPromise;
        
        setState({
          isReady: true,
          isLoading: false,
          error: null
        });
      } catch (error) {
        console.error('Error setting up PDF.js:', error);
        setState({
          isReady: false,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to load PDF.js'
        });
      }
    }

    loadPdfJs();
    
    return () => {
      // Cleanup if needed
    };
  }, []);

  return { state };
}

async function extractTextFromPdfFallback(pdfData: ArrayBuffer): Promise<string> {
  try {
    const uint8Array = new Uint8Array(pdfData);
    let text = '';
    
    for (let i = 0; i < uint8Array.length - 10; i++) {
      if ((uint8Array[i] === 0x54 && uint8Array[i+1] === 0x6A) || // Tj
          (uint8Array[i] === 0x54 && uint8Array[i+1] === 0x4A)) { // TJ
        
        for (let j = Math.max(0, i - 100); j < i; j++) {
          if (uint8Array[j] === 0x28) {
            let str = '';
            for (let k = j + 1; k < i && uint8Array[k] !== 0x29; k++) {
              const charCode = uint8Array[k];
              if (charCode >= 32 && charCode <= 126) {
                str += String.fromCharCode(charCode);
              }
            }
            if (str.length > 2) {
              text += str + ' ';
            }
            break;
          }
        }
      }
    }
    
    return text.length > 50 ? text : 'Limited text could be extracted from this PDF.';
  } catch (error) {
    return 'PDF text extraction using fallback method failed.';
  }
}

export async function extractTextFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }
    
    if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
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
    } 
    else if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      const fileReader = new FileReader();
      
      fileReader.onload = async (event) => {
        try {
          const pdfArrayBuffer = event.target?.result as ArrayBuffer;
          
          if (typeof window !== 'undefined' && window.pdfjsLib) {
            try {
              const pdfData = new Uint8Array(pdfArrayBuffer);
              const pdfjsLib = window.pdfjsLib;
              
              if (!pdfjsLib.getDocument) {
                throw new Error('PDF.js library not properly loaded');
              }
              
              const loadingTask = pdfjsLib.getDocument({ data: pdfData });
              const pdf = await loadingTask.promise;
              
              let fullText = '';
              
              for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                
                const pageText = textContent.items
                  .map((item: any) => item.str || '')
                  .join(' ');
                
                fullText += pageText + '\n\n';
              }
              
              if (!fullText || fullText.trim() === '') {
                throw new Error('No text could be extracted from this PDF');
              }
              
              resolve(fullText);
            } catch (error) {
              // If PDF.js fails, try our fallback method
              const fallbackText = await extractTextFromPdfFallback(pdfArrayBuffer);
              resolve(fallbackText);
            }
          } else {
            // If PDF.js isn't available, use our fallback method
            const fallbackText = await extractTextFromPdfFallback(pdfArrayBuffer);
            resolve(fallbackText);
          }
        } catch (error) {
          reject(new Error(`Error processing PDF: ${error instanceof Error ? error.message : 'Unknown error'}`));
        }
      };
      
      fileReader.onerror = () => {
        reject(new Error('Error reading the file'));
      };
      
      fileReader.readAsArrayBuffer(file);
    } else {
      reject(new Error('Unsupported file type. Please upload a PDF or text file.'));
    }
  });
} 