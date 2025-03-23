'use client';

import { useState } from 'react';
import { useProjectStore } from '@/lib/store';
import { Scene } from './classes/scene';

export function SceneSelector() {
  const { getCurrentProject, setActiveSceneId, addScene } = useProjectStore();
  const [isAddingScene, setIsAddingScene] = useState(false);
  const [newSceneTitle, setNewSceneTitle] = useState('');
  
  const currentProject = getCurrentProject();
  const activeSceneId = useProjectStore(state => state.activeSceneId);
  
  if (!currentProject) {
    return (
      <div className="mb-4 p-4 bg-gray-50 rounded border border-gray-200 text-center">
        <p className="text-gray-500">No project selected</p>
      </div>
    );
  }
  
  const handleAddScene = () => {
    if (isAddingScene) {
      // Create a stable scene ID to avoid hydration issues
      const sceneId = `scene-${Date.now()}`;
      // Create the scene with a stable ID
      const newScene = new Scene(sceneId);
      
      if (newSceneTitle.trim()) {
        newScene.title = newSceneTitle.trim();
      }
      
      addScene(newScene);
      setActiveSceneId(newScene.id);
      
      // Reset form
      setNewSceneTitle('');
      setIsAddingScene(false);
    } else {
      setIsAddingScene(true);
    }
  };
  
  const handleCancelAdd = () => {
    setNewSceneTitle('');
    setIsAddingScene(false);
  };
  
  const handleSelectScene = (sceneId: string) => {
    setActiveSceneId(sceneId);
  };
  
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">Scenes</h3>
        <button 
          onClick={handleAddScene}
          className="text-sm px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
        >
          {isAddingScene ? 'Save Scene' : 'Add Scene'}
        </button>
      </div>
      
      {isAddingScene && (
        <div className="mb-2 flex gap-2">
          <input
            type="text"
            value={newSceneTitle}
            onChange={(e) => setNewSceneTitle(e.target.value)}
            placeholder="Scene Title"
            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
            autoFocus
          />
          <button
            onClick={handleCancelAdd}
            className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
          >
            Cancel
          </button>
        </div>
      )}
      
      <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
        {currentProject.scenes.length === 0 ? (
          <div className="p-4 bg-gray-50 rounded border border-gray-200 text-center">
            <p className="text-gray-500 mb-2">No scenes yet</p>
            <p className="text-xs text-gray-400 mb-3">Click the "Add Scene" button to create your first scene</p>
            <button 
              onClick={() => setIsAddingScene(true)}
              className="text-sm px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
            >
              Start Creating
            </button>
          </div>
        ) : (
          currentProject.scenes.map((scene) => (
            <div 
              key={scene.id}
              onClick={() => handleSelectScene(scene.id)}
              className={`p-2 rounded cursor-pointer flex justify-between items-center ${
                scene.id === activeSceneId 
                  ? 'bg-blue-100 border-blue-300 border' 
                  : 'hover:bg-gray-100 border border-transparent'
              }`}
            >
              <div className="truncate flex-1">
                <span className="font-medium">{scene.title}</span>
                <span className="text-xs text-gray-500 ml-2">
                  {Array.from(scene.speakers).length} speakers, {scene.dialogue.length} lines
                  {scene.assets.characterIds && scene.assets.characterIds.length > 0 && (
                    <>, {scene.assets.characterIds.length} characters</>
                  )}
                </span>
              </div>
              {scene.assets.backgroundId && (
                <div className="w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center">
                  <span className="text-blue-500 text-xs">BG</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
} 