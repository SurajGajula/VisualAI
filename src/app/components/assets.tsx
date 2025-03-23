'use client';

import { useState, useEffect, useRef } from 'react';
import { useProjectStore } from '@/lib/store';
import { v4 as uuidv4 } from 'uuid';
import { SceneSelector } from './scene-selector';

type ProjectSubTab = 'characters' | 'backgrounds' | 'audio';

export function AssetManager() {
  const { 
    getCurrentProject,
    getActiveScene, 
    addBackground,
    updateCharacter,
    removeBackground,
    setSceneBackground,
    addCharacter
  } = useProjectStore();
  
  const [projectSubTab, setProjectSubTab] = useState<ProjectSubTab>('backgrounds');
  const [uploadingBackground, setUploadingBackground] = useState(false);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backgroundFileInputRef = useRef<HTMLInputElement>(null);
  
  const currentProject = getCurrentProject();
  const activeScene = getActiveScene();
  
  const handleAddBackground = () => {
    if (backgroundFileInputRef.current) {
      backgroundFileInputRef.current.click();
    }
  };
  
  const handleBackgroundImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) {
      return;
    }
    
    setUploadingBackground(true);
    
    // Auto-generate a name based on file name or incremental count
    let backgroundName = file.name.split('.')[0]; // Use filename without extension
    
    // If filename is not suitable (e.g., "image"), use a numbered background name
    if (!backgroundName || backgroundName.length < 3) {
      const backgroundCount = currentProject?.backgrounds.length || 0;
      backgroundName = `Background ${backgroundCount + 1}`;
    }
    
    // Convert the image to base64 for storage
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      
      if (imageUrl) {
        // Create a new background with the image URL
        const newBackground = {
          id: uuidv4(),
          name: backgroundName,
          imageUrl
        };
        
        addBackground(newBackground);
        
        // Automatically assign to active scene if one exists
        if (activeScene) {
          setSceneBackground(activeScene.id, newBackground.id);
        }
      }
      
      setUploadingBackground(false);
      
      // Reset the file input
      if (backgroundFileInputRef.current) {
        backgroundFileInputRef.current.value = '';
      }
    };
    
    reader.readAsDataURL(file);
  };
  
  const handleImageUploadClick = (characterId: string) => {
    setUploadingFor(characterId);
    
    // Trigger the file input click
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file || !uploadingFor) {
      setUploadingFor(null);
      return;
    }
    
    // Convert the image to base64 for storage
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      
      if (imageUrl) {
        // Update the character with the new image URL
        updateCharacter(uploadingFor, {
          imageUrl
        });
      }
      
      setUploadingFor(null);
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    
    reader.readAsDataURL(file);
  };
  
  const handleDeleteBackground = (backgroundId: string) => {
    removeBackground(backgroundId);
  };
  
  const handleAddCharacter = () => {
    const characterCount = currentProject?.characters.length || 0;
    const newCharacter = {
      id: uuidv4(),
      name: `Character ${characterCount + 1}`
    };
    
    addCharacter(newCharacter);
  };
  
  // If no project is loaded
  if (!currentProject) {
    return (
      <div className="p-4 text-center bg-gray-50 rounded border border-gray-200">
        <p className="text-gray-500">Please create or load a project to manage assets.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Hidden file input for character image uploads */}
      <input 
        type="file" 
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
      
      {/* Hidden file input for background image uploads */}
      <input 
        type="file" 
        ref={backgroundFileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleBackgroundImageUpload}
      />
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">Scene Assets</h2>
        <SceneSelector />
      </div>
      
      {!activeScene ? (
        <div className="p-4 text-center bg-gray-50 rounded border border-gray-200">
          <p className="text-gray-500">Please select a scene to manage its assets.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Scene Info & Asset Selection */}
          <div className="md:col-span-1">
            <div className="bg-white border rounded-md p-4 mb-4">
              <h3 className="font-medium mb-3">Scene Info</h3>
              <p className="text-sm mb-1">
                <span className="font-medium">Title:</span> {activeScene.title}
              </p>
              <p className="text-sm mb-1">
                <span className="font-medium">Dialogue Lines:</span> {activeScene.dialogue.length}
              </p>
              <p className="text-sm">
                <span className="font-medium">Speakers:</span> {Array.from(activeScene.speakers).length}
              </p>
            </div>
            
            <div className="bg-white border rounded-md p-4">
              <h3 className="font-medium mb-3">Asset Types</h3>
              <div className="flex flex-col gap-2">
                <button
                  className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-blue-100 
                    ${projectSubTab === 'backgrounds' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-50 text-gray-700'}`}
                  onClick={() => setProjectSubTab('backgrounds')}
                >
                  Backgrounds ({currentProject.backgrounds.length})
                </button>
                <button
                  className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-blue-100 
                    ${projectSubTab === 'characters' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-50 text-gray-700'}`}
                  onClick={() => setProjectSubTab('characters')}
                >
                  Characters ({currentProject.characters.length})
                </button>
                <button
                  className="w-full text-left px-3 py-2 text-sm bg-gray-50 text-gray-400 rounded opacity-50 cursor-not-allowed"
                  disabled
                >
                  Audio (Coming Soon)
                </button>
              </div>
            </div>
          </div>
          
          {/* Middle column - Current Scene Assets */}
          <div className="md:col-span-1">
            <div className="bg-white border rounded-md p-4 h-full">
              <h3 className="font-medium mb-3">Current Scene Assets</h3>
              
              {projectSubTab === 'backgrounds' && (
                <>
                  <h4 className="text-sm font-medium mb-2">Background</h4>
                  
                  {/* Current background preview */}
                  {activeScene.assets.backgroundId ? (
                    <div className="mb-4">
                      <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded overflow-hidden mb-2">
                        {(() => {
                          const background = currentProject.backgrounds.find(
                            bg => bg.id === activeScene.assets.backgroundId
                          );
                          return background ? (
                            <img 
                              src={background.imageUrl} 
                              alt={background.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <p className="text-gray-500">Background not found</p>
                            </div>
                          );
                        })()}
                      </div>
                      <p className="text-sm text-center">
                        {currentProject.backgrounds.find(bg => bg.id === activeScene.assets.backgroundId)?.name}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-32 bg-gray-100 rounded mb-4">
                      <p className="text-gray-500">No background assigned</p>
                    </div>
                  )}
                </>
              )}
              
              {projectSubTab === 'characters' && (
                <>
                  <h4 className="text-sm font-medium mb-2">Characters in Scene</h4>
                  
                  {activeScene.assets.characterIds && activeScene.assets.characterIds.length > 0 ? (
                    <div className="space-y-2">
                      {activeScene.assets.characterIds.map(characterId => {
                        const character = currentProject.characters.find(c => c.id === characterId);
                        return character ? (
                          <div key={character.id} className="p-2 border rounded flex items-center">
                            <div 
                              className="w-10 h-10 bg-gray-100 rounded-full mr-2 overflow-hidden"
                            >
                              {character.imageUrl ? (
                                <img 
                                  src={character.imageUrl} 
                                  alt={character.name} 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full bg-gray-200">
                                  <span className="text-gray-500 text-xs">No img</span>
                                </div>
                              )}
                            </div>
                            <span>{character.name}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-32 bg-gray-100 rounded mb-4">
                      <p className="text-gray-500">No characters in scene</p>
                    </div>
                  )}
                </>
              )}
              
              <div className="mt-4">
                {projectSubTab === 'backgrounds' && (
                  <button
                    className="w-full py-2 px-3 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center"
                    onClick={handleAddBackground}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Background
                  </button>
                )}
                
                {projectSubTab === 'characters' && (
                  <button
                    className="w-full py-2 px-3 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center"
                    onClick={handleAddCharacter}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Character
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Right column - Project Assets */}
          <div className="md:col-span-1">
            <div className="bg-white border rounded-md p-4 h-full">
              {projectSubTab === 'backgrounds' && (
                <>
                  <h3 className="font-medium mb-3">Available Backgrounds</h3>
                  
                  {currentProject.backgrounds.length === 0 ? (
                    <div className="p-4 text-center bg-gray-50 rounded border border-gray-200">
                      <p className="text-gray-500">No backgrounds added yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                      {currentProject.backgrounds.map(background => (
                        <div 
                          key={background.id} 
                          className={`border rounded p-2 bg-white cursor-pointer hover:border-blue-500 transition-all ${
                            activeScene.assets.backgroundId === background.id ? 'ring-2 ring-blue-500' : ''
                          }`}
                          onClick={() => setSceneBackground(activeScene.id, background.id)}
                        >
                          <div className="aspect-w-16 aspect-h-9 bg-gray-100 mb-1 rounded overflow-hidden">
                            <img 
                              src={background.imageUrl} 
                              alt={background.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-sm font-medium">{background.name}</p>
                            <div className="flex items-center">
                              {activeScene.assets.backgroundId === background.id && (
                                <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-full mr-1">
                                  Selected
                                </span>
                              )}
                              <button 
                                className="p-1 text-red-500 hover:bg-red-50 rounded"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteBackground(background.id);
                                }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
              
              {projectSubTab === 'characters' && (
                <>
                  <h3 className="font-medium mb-3">Project Characters</h3>
                  
                  {currentProject.characters.length === 0 ? (
                    <div className="p-4 text-center bg-gray-50 rounded border border-gray-200">
                      <p className="text-gray-500">No characters added yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                      {currentProject.characters.map(character => (
                        <div 
                          key={character.id} 
                          className="border rounded p-3 bg-white"
                        >
                          <div className="flex items-center">
                            <div 
                              className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-3 overflow-hidden"
                              onClick={() => handleImageUploadClick(character.id)}
                            >
                              {character.imageUrl ? (
                                <img 
                                  src={character.imageUrl} 
                                  alt={character.name} 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{character.name}</h4>
                              <div className="flex gap-2 mt-1">
                                <button 
                                  className="text-xs text-blue-600 hover:underline"
                                  onClick={() => handleImageUploadClick(character.id)}
                                >
                                  {character.imageUrl ? 'Change Image' : 'Add Image'}
                                </button>
                                
                                {activeScene.assets.characterIds?.includes(character.id) ? (
                                  <button 
                                    className="text-xs text-red-600 hover:underline"
                                    onClick={() => {
                                      if (activeScene.assets.characterIds) {
                                        const updatedCharIds = activeScene.assets.characterIds.filter(
                                          id => id !== character.id
                                        );
                                        activeScene.removeCharacter(character.id);
                                      }
                                    }}
                                  >
                                    Remove from Scene
                                  </button>
                                ) : (
                                  <button 
                                    className="text-xs text-green-600 hover:underline"
                                    onClick={() => {
                                      activeScene.addCharacter(character.id);
                                    }}
                                  >
                                    Add to Scene
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
