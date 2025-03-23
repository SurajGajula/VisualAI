'use client';

import { useState, useEffect } from 'react';
import { SceneSelector } from './scene-selector';
import { SceneActions } from './scene-actions';
import { useProjectStore } from '@/lib/store';

export function CreateView() {
  const { getCurrentProject } = useProjectStore();
  const currentProject = getCurrentProject();
  
  // State for formatted date - to avoid hydration mismatch
  const [formattedDate, setFormattedDate] = useState<string>('');
  
  // Format the date on the client side only
  useEffect(() => {
    if (currentProject?.updatedAt) {
      setFormattedDate(new Date(currentProject.updatedAt).toLocaleString());
    }
  }, [currentProject?.updatedAt]);
  
  // Function to clear all scenes
  const handleClearAllScenes = () => {
    if (currentProject && window.confirm('Are you sure you want to remove all scenes?')) {
      // Get all scene IDs
      const sceneIds = currentProject.scenes.map(scene => scene.id);
      
      // Remove each scene
      const { removeScene } = useProjectStore.getState();
      sceneIds.forEach(id => removeScene(id));
    }
  };
  
  // Function to completely clear localStorage
  const handleResetApp = () => {
    if (window.confirm('This will completely reset the application. Are you sure?')) {
      localStorage.clear();
      window.location.reload();
    }
  };
  
  if (!currentProject) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Create Project</h2>
        <p className="text-gray-600 mb-4">
          No project is currently selected. Create a new project or select an existing one.
        </p>
        <ProjectCreator />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">{currentProject.name}</h2>
            <p className="text-gray-500 text-sm">
              {currentProject.scenes.length} scenes 
              {formattedDate && (
                <> • Last updated: {formattedDate}</>
              )}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Note: Scenes are not saved between refreshes. Use "Reset App" to clear all data.
            </p>
          </div>
          <div className="flex gap-2">
            {currentProject.scenes.length > 0 && (
              <button 
                onClick={handleClearAllScenes}
                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                Clear All Scenes
              </button>
            )}
            <button 
              onClick={handleResetApp}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              title="Reset the application to default state"
            >
              Reset App
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex flex-1 gap-4 overflow-hidden">
        <div className="w-1/3 overflow-y-auto p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <SceneSelector />
        </div>
        
        <div className="w-2/3 overflow-y-auto p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <SceneActions />
        </div>
      </div>
    </div>
  );
}

function ProjectCreator() {
  const { createProject } = useProjectStore();
  const [projectName, setProjectName] = useState('');
  
  const handleCreateProject = () => {
    if (projectName.trim()) {
      createProject(projectName.trim());
      setProjectName('');
    }
  };
  
  return (
    <div className="flex flex-col">
      <input
        type="text"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        placeholder="Project Name"
        className="px-4 py-2 border border-gray-300 rounded-md mb-3"
      />
      <button
        onClick={handleCreateProject}
        disabled={!projectName.trim()}
        className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
      >
        Create New Project
      </button>
    </div>
  );
} 