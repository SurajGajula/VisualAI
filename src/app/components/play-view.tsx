'use client';

import { useState, useEffect } from 'react';
import { useProjectStore } from '@/lib/store';

// Explicitly specify export to ensure dynamic imports work correctly
export function PlayView() {
  const { 
    getCurrentProject,
  } = useProjectStore();
  
  const currentProject = getCurrentProject();
  
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Get the current scene from the project
  const currentScene = currentProject?.scenes[currentSceneIndex];
  
  // Get the current dialogue line
  const currentDialogue = currentScene?.dialogue[currentDialogueIndex];
  
  // Get the current speaker's character info
  const currentSpeaker = currentDialogue 
    ? currentProject?.characters.find(c => c.name === currentDialogue.speaker) 
    : null;
  
  // Get the current background
  const currentBackground = currentScene && currentScene.assets.backgroundId
    ? currentProject?.backgrounds.find(bg => bg.id === currentScene.assets.backgroundId)
    : null;
  
  // Handle advancing through dialogue
  const handleNext = () => {
    if (!currentScene || !currentProject) return;
    
    // If not at the end of dialogue for the current scene
    if (currentDialogueIndex < currentScene.dialogue.length - 1) {
      setCurrentDialogueIndex(currentDialogueIndex + 1);
    } 
    // If at the end of dialogue but not the last scene
    else if (currentSceneIndex < currentProject.scenes.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSceneIndex(currentSceneIndex + 1);
        setCurrentDialogueIndex(0);
        setIsTransitioning(false);
      }, 500);
    }
  };
  
  // Handle going back
  const handlePrevious = () => {
    if (!currentScene || !currentProject) return;
    
    // If not at the beginning of dialogue for the current scene
    if (currentDialogueIndex > 0) {
      setCurrentDialogueIndex(currentDialogueIndex - 1);
    } 
    // If at the beginning of dialogue but not the first scene
    else if (currentSceneIndex > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSceneIndex(currentSceneIndex - 1);
        const previousScene = currentProject.scenes[currentSceneIndex - 1];
        setCurrentDialogueIndex(previousScene.dialogue.length - 1);
        setIsTransitioning(false);
      }, 500);
    }
  };
  
  // Reset to beginning if project changes
  useEffect(() => {
    setCurrentSceneIndex(0);
    setCurrentDialogueIndex(0);
  }, [currentProject?.id]);
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSceneIndex, currentDialogueIndex, currentProject]);
  
  if (!currentProject || currentProject.scenes.length === 0) {
    return (
      <div className="p-6 text-center bg-gray-50 rounded border border-gray-200">
        <h3 className="font-medium mb-2">No Content to Play</h3>
        <p className="text-gray-500 mb-4">Your project needs scenes with dialogue to play.</p>
        <div className="flex justify-center">
          <button 
            onClick={() => useProjectStore.getState().setActiveSceneId(null)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Create Mode
          </button>
        </div>
      </div>
    );
  }
  
  if (!currentScene || currentScene.dialogue.length === 0) {
    return (
      <div className="p-6 text-center bg-gray-50 rounded border border-gray-200">
        <h3 className="font-medium mb-2">Scene has no dialogue</h3>
        <p className="text-gray-500 mb-4">
          {!currentScene 
            ? "No scene is available to play." 
            : `The scene "${currentScene.title}" has no dialogue lines.`}
        </p>
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => useProjectStore.getState().setActiveSceneId(currentScene?.id || null)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit Scene
          </button>
          {currentProject.scenes.length > 1 && (
            <button 
              onClick={() => setCurrentSceneIndex((currentSceneIndex + 1) % currentProject.scenes.length)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Try Next Scene
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Scene title bar */}
      <div className="flex justify-between items-center mb-2 pb-2 border-b">
        <h2 className="text-lg font-medium">Scene: {currentScene.title}</h2>
        <div className="text-sm text-gray-500">
          {currentSceneIndex + 1} of {currentProject.scenes.length} scenes
        </div>
      </div>
      
      {/* Progress indicator */}
      <div className="h-1 w-full bg-gray-200 mb-4">
        <div 
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ 
            width: `${((currentSceneIndex * 100) / currentProject.scenes.length) + 
              ((currentDialogueIndex * 100) / (currentScene.dialogue.length * currentProject.scenes.length))}%` 
          }}
        />
      </div>
      
      {/* Visual novel display area */}
      <div className="flex-1 relative bg-black overflow-hidden" 
        style={{ minHeight: '400px' }}>
        {/* Background image */}
        <div className={`absolute inset-0 transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          {currentBackground && currentBackground.imageUrl ? (
            <img 
              src={currentBackground.imageUrl} 
              alt={currentBackground.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-blue-900 via-indigo-800 to-purple-900 flex items-center justify-center">
              <div className="text-white text-opacity-20 text-2xl font-bold">
                {currentScene.title || "Scene"}
              </div>
            </div>
          )}
        </div>
        
        {/* Character display */}
        <div className={`absolute bottom-0 w-full h-3/4 flex justify-center items-end transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          {currentSpeaker && (
            <div className="h-full flex items-end pb-4">
              {currentSpeaker.imageUrl ? (
                <img
                  src={currentSpeaker.imageUrl}
                  alt={currentSpeaker.name}
                  className="max-h-full max-w-xs object-contain"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-48 h-64 bg-gray-600 rounded-t-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="px-2 py-1 bg-gray-700 text-white text-xs rounded-b w-48 text-center">
                    {currentSpeaker.name}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Dialogue box */}
      <div className="bg-gray-800 text-white p-4 rounded-t-md relative">
        {/* Speaker name */}
        {currentDialogue && (
          <div className="mb-2">
            <span className="bg-blue-600 px-3 py-1 rounded-md text-sm font-medium">
              {currentDialogue.speaker}
            </span>
          </div>
        )}
        
        {/* Dialogue text */}
        <div className="min-h-[60px]">
          {currentDialogue ? (
            <p className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
              {currentDialogue.line}
            </p>
          ) : (
            <p className="text-gray-400 italic">No dialogue available</p>
          )}
        </div>
        
        {/* Navigation controls */}
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePrevious}
            disabled={currentSceneIndex === 0 && currentDialogueIndex === 0}
            className="px-4 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          
          <div className="text-xs text-gray-400">
            Line {currentDialogueIndex + 1} / {currentScene.dialogue.length}
          </div>
          
          <button
            onClick={handleNext}
            disabled={currentSceneIndex === currentProject.scenes.length - 1 && currentDialogueIndex === currentScene.dialogue.length - 1}
            className="px-4 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
        
        {/* Auto/Skip controls */}
        <div className="mt-3 flex justify-center gap-4">
          <button className="text-xs px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600">
            Auto Play
          </button>
          <button className="text-xs px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600">
            Skip Scene
          </button>
          <button 
            className="text-xs px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
            onClick={() => {
              setCurrentSceneIndex(0);
              setCurrentDialogueIndex(0);
            }}
          >
            Restart
          </button>
        </div>
      </div>
    </div>
  );
} 