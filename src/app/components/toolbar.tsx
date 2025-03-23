'use client';

import { useState } from 'react';
import { AssetManager } from './assets';
import { useProjectStore } from '@/lib/store';
import { CreateView } from './create-view';
import { PlayView } from './play-view';

export function Toolbar() {
  const { 
    getCurrentProject,
  } = useProjectStore();
  
  const [activeTab, setActiveTab] = useState<'create' | 'assets' | 'play'>('create');
  
  // Get current project safely
  const currentProject = getCurrentProject();
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex border-b">
        <button 
          className={`px-4 py-2 ${activeTab === 'create' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
          onClick={() => setActiveTab('create')}
        >
          Create
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'assets' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
          onClick={() => setActiveTab('assets')}
        >
          Assets
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'play' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
          onClick={() => setActiveTab('play')}
        >
          Play
        </button>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 p-4 overflow-auto">
        {activeTab === 'create' && <CreateView />}
        
        {activeTab === 'assets' && <AssetManager />}
        
        {activeTab === 'play' && <PlayView />}
      </div>
      
      {/* Status bar */}
      <div className="border-t p-2 text-xs text-gray-500">
        {currentProject && (
          <div className="flex justify-between">
            <div>Project: {currentProject.name}</div>
            <div>
              {currentProject.scenes.length} Scenes • 
              {currentProject.characters.length} Characters • 
              {currentProject.backgrounds.length} Backgrounds
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
