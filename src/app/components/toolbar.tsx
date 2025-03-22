'use client';

import { useState } from 'react';
import { ViewScene } from './view';
import { AssetManager } from './assets';
import { Scene } from './classes/scene';
import { PdfLoader } from './pdf-loader';

type ToolType = 'parser' | 'view' | 'assets' | null;

export function Toolbar() {
  const [activeTool, setActiveTool] = useState<ToolType>(null);
  const [scene, setScene] = useState<Scene | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleToolClick = (tool: ToolType) => {
    setActiveTool(tool === activeTool ? null : tool);
    setError(null);
  };

  const handleSceneLoaded = (newScene: Scene) => {
    setScene(newScene);
    setActiveTool('view');
    setError(null);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex w-full p-2 space-x-4 bg-gray-200 border-b border-gray-300">
        <button
          onClick={() => handleToolClick('parser')}
          className={activeTool === 'parser' ? 'btn-primary' : 'btn-secondary'}
          disabled={isLoading}
        >
          Parser
        </button>
        <button
          onClick={() => handleToolClick('view')}
          className={activeTool === 'view' ? 'btn-primary' : 'btn-secondary'}
          disabled={isLoading || !scene}
        >
          View
        </button>
        <button
          onClick={() => handleToolClick('assets')}
          className={activeTool === 'assets' ? 'btn-primary' : 'btn-secondary'}
          disabled={isLoading}
        >
          Assets
        </button>
      </div>

      {isLoading && (
        <div className="flex-center p-4 bg-white shadow-md">
          <div className="flex flex-col items-center animate-pulse">
            <div className="mb-2 h-10 w-10 bg-primary rounded-full"></div>
            <p>Processing file, please wait...</p>
          </div>
        </div>
      )}

      {error && !isLoading && (
        <div className="alert-error">
          <h3 className="mb-1 font-medium">Error</h3>
          {error}
        </div>
      )}

      {activeTool && !isLoading && (
        <div className="card">
          {activeTool === 'parser' && (
            <div>
              <h2 className="card-title">Script Parser</h2>
              <p className="mb-2">
                Upload a text or PDF file containing dialogue to create a scene.
              </p>
              
              <div className="alert-info">
                <h3 className="mb-1 font-medium">Expected Format:</h3>
                <p className="mb-2 text-sm">Each line should follow this pattern:</p>
                <pre className="p-2 text-sm rounded bg-white border border-blue-100">
                  Character: Dialogue text
                </pre>
                
                <div className="mb-4">
                  <h4 className="mt-3 mb-1 font-medium">Example:</h4>
                  <pre className="p-2 text-sm rounded bg-white border border-blue-100">
                    John: Hey, how are you doing today?<br/>
                    Jane: I'm doing great, thanks for asking!<br/>
                    John: Wonderful weather we're having.
                  </pre>
                </div>
              </div>
              
              <PdfLoader onSceneLoaded={handleSceneLoaded} onError={handleError} />
            </div>
          )}
          {activeTool === 'view' && (
            <div>
              <h2 className="card-title">Scene Viewer</h2>
              {scene ? (
                <ViewScene scene={scene} />
              ) : (
                <div className="p-4 text-center rounded bg-gray-50 border border-gray-200">
                  <p className="text-gray-500">No scene data loaded. Please parse a file first.</p>
                </div>
              )}
            </div>
          )}
          {activeTool === 'assets' && (
            <div>
              <h2 className="card-title">Assets Manager</h2>
              <AssetManager />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
