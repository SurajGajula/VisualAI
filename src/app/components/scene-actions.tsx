'use client';

import { useState, useEffect } from 'react';
import { useProjectStore } from '@/lib/store';
import { Dialogue } from './classes/dialogue';

export function SceneActions() {
  const { 
    getCurrentProject, 
    getActiveScene, 
    removeScene,
    updateSceneTitle,
    addDialogueToScene,
  } = useProjectStore();
  
  const [editingTitle, setEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDialogue, setNewDialogue] = useState('');
  const [newSpeakerName, setNewSpeakerName] = useState('');
  
  const currentProject = getCurrentProject();
  const activeScene = getActiveScene();
  
  useEffect(() => {
    if (activeScene) {
      setNewTitle(activeScene.title);
    }
  }, [activeScene?.id]);
  
  if (!currentProject || !activeScene) {
    return (
      <div className="p-6 bg-gray-50 rounded border border-gray-200 text-center">
        <p className="text-gray-500 mb-2">No scene selected</p>
        <p className="text-xs text-gray-400 mb-3">
          {currentProject?.scenes.length === 0 
            ? "Start by creating your first scene from the panel on the left"
            : "Select a scene from the panel on the left to edit its contents"}
        </p>
      </div>
    );
  }
  
  const handleUpdateTitle = () => {
    if (editingTitle && newTitle.trim()) {
      updateSceneTitle(activeScene.id, newTitle.trim());
      setEditingTitle(false);
    } else {
      setEditingTitle(true);
    }
  };
  
  const handleCancelEdit = () => {
    setNewTitle(activeScene.title);
    setEditingTitle(false);
  };
  
  const handleRemoveScene = () => {
    if (window.confirm(`Are you sure you want to delete "${activeScene.title}"?`)) {
      removeScene(activeScene.id);
    }
  };
  
  const handleAddDialogue = () => {
    if (newDialogue.trim()) {
      const dialogue = new Dialogue(`${newSpeakerName || 'Unknown'}: ${newDialogue.trim()}`);
      addDialogueToScene(activeScene.id, dialogue);
      setNewDialogue('');
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="p-4 bg-white rounded-md border shadow-sm">
        <div className="flex justify-between items-center mb-4">
          {editingTitle ? (
            <div className="flex gap-2 flex-1">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                autoFocus
              />
              <button
                onClick={handleUpdateTitle}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          ) : (
            <h2 className="text-xl font-medium flex-1">{activeScene.title}</h2>
          )}
          
          <div className="flex gap-2">
            {!editingTitle && (
              <button
                onClick={handleUpdateTitle}
                className="p-1 text-gray-500 hover:text-blue-600"
                title="Edit Title"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            <button
              onClick={handleRemoveScene}
              className="p-1 text-gray-500 hover:text-red-600"
              title="Delete Scene"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex gap-4 text-sm">
            <div className="bg-gray-100 px-3 py-1 rounded">
              <span className="font-medium">{activeScene.dialogue.length}</span> dialogue lines
            </div>
            <div className="bg-gray-100 px-3 py-1 rounded">
              <span className="font-medium">{Array.from(activeScene.speakers).length}</span> speakers
            </div>
            <div className="bg-gray-100 px-3 py-1 rounded">
              <span className="font-medium">{activeScene.assets.characterIds ? activeScene.assets.characterIds.length : 0}</span> characters
            </div>
          </div>
          
          {activeScene.assets.characterIds && activeScene.assets.characterIds.length > 0 && (
            <div className="mt-2">
              <h4 className="text-sm font-medium text-gray-700 mb-1">Characters in scene:</h4>
              <div className="flex flex-wrap gap-2">
                {activeScene.assets.characterIds.map(charId => {
                  const character = getCurrentProject()?.characters.find(c => c.id === charId);
                  return (
                    <div key={charId} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                      {character?.name || "Unknown"}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 bg-white rounded-md border shadow-sm">
        <h3 className="font-medium mb-3">Add Dialogue</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Speaker</label>
            <input
              type="text"
              value={newSpeakerName}
              onChange={(e) => setNewSpeakerName(e.target.value)}
              placeholder="Speaker Name"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dialogue</label>
            <textarea
              value={newDialogue}
              onChange={(e) => setNewDialogue(e.target.value)}
              placeholder="Enter dialogue text"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm min-h-[80px]"
            />
          </div>
          <button
            onClick={handleAddDialogue}
            disabled={!newDialogue.trim()}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Dialogue Line
          </button>
        </div>
      </div>
      
      <div className="p-4 bg-white rounded-md border shadow-sm">
        <h3 className="font-medium mb-3">Dialogue Lines</h3>
        {activeScene.dialogue.length === 0 ? (
          <div className="text-center p-4 bg-gray-50 rounded">
            <p className="text-gray-500">No dialogue lines yet</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {activeScene.dialogue.map((dialogue, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded">
                <div className="text-sm font-medium text-gray-700">{dialogue.speaker}</div>
                <p className="text-sm">{dialogue.line}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 