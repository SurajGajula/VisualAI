'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Scene } from '../components/classes/scene';
import { Dialogue } from '../components/classes/dialogue';
import { ViewScene } from '../components/view';

export default function EditPage() {
  const [scene, setScene] = useState<Scene>(new Scene('New Scene', []));
  const [speakerInput, setSpeakerInput] = useState('');
  const [dialogueInput, setDialogueInput] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAddDialogue = () => {
    if (!speakerInput.trim() || !dialogueInput.trim()) return;
    
    const newDialogue = new Dialogue(speakerInput.trim(), dialogueInput.trim());
    
    if (editingIndex !== null) {
      const updatedDialogue = [...scene.dialogue];
      updatedDialogue[editingIndex] = newDialogue;
      
      setScene(new Scene(scene.title, updatedDialogue));
      setEditingIndex(null);
    } else {
      setScene(new Scene(scene.title, [...scene.dialogue, newDialogue]));
    }
    
    setSpeakerInput('');
    setDialogueInput('');
  };

  const handleEditDialogue = (index: number) => {
    const dialogue = scene.dialogue[index];
    setSpeakerInput(dialogue.speaker);
    setDialogueInput(dialogue.line);
    setEditingIndex(index);
  };

  const handleDeleteDialogue = (index: number) => {
    const updatedDialogue = scene.dialogue.filter((_, i) => i !== index);
    setScene(new Scene(scene.title, updatedDialogue));
    
    if (editingIndex === index) {
      setEditingIndex(null);
      setSpeakerInput('');
      setDialogueInput('');
    }
  };

  const handleClearForm = () => {
    setSpeakerInput('');
    setDialogueInput('');
    setEditingIndex(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header Bar */}
      <header className="w-full bg-white py-3 px-4 fixed top-0 flex-between shadow-sm z-10">
        <Link href="/" className="text-blue-600 hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
        <h1 className="text-lg font-semibold">Scene Editor</h1>
      </header>

      <main className="mt-16 p-4 flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="card-title">
                {editingIndex !== null ? 'Edit Dialogue' : 'Add Dialogue'}
              </h2>
              
              <div className="mb-4">
                <label htmlFor="speaker" className="form-label">Speaker</label>
                <input
                  id="speaker"
                  type="text"
                  value={speakerInput}
                  onChange={(e) => setSpeakerInput(e.target.value)}
                  className="form-input"
                  placeholder="Character name"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="dialogue" className="form-label">Dialogue</label>
                <textarea
                  id="dialogue"
                  value={dialogueInput}
                  onChange={(e) => setDialogueInput(e.target.value)}
                  className="form-input h-24"
                  placeholder="Character's dialogue line"
                />
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={handleAddDialogue}
                  className="btn-primary"
                >
                  {editingIndex !== null ? 'Update' : 'Add'} Dialogue
                </button>
                
                <button 
                  onClick={handleClearForm}
                  className="btn-outline"
                >
                  Clear
                </button>
              </div>
            </div>
            
            <div className="card">
              <h2 className="card-title">Dialogue List</h2>
              
              {scene.dialogue.length === 0 ? (
                <div className="p-4 text-center rounded bg-gray-50 border border-gray-200">
                  <p className="text-gray-500">No dialogue added yet. Add some dialogue to get started.</p>
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  {scene.dialogue.map((dialogue, index) => (
                    <div key={index} className="p-2 mb-2 rounded hover:bg-gray-50 border border-gray-200">
                      <div className="flex-between mb-1">
                        <span className="font-semibold text-blue-700">{dialogue.speaker}</span>
                        <div className="flex space-x-1">
                          <button 
                            onClick={() => handleEditDialogue(index)}
                            className="p-1 text-blue-600 hover:text-blue-800"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleDeleteDialogue(index)}
                            className="p-1 text-red-600 hover:text-red-800"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-700">{dialogue.line}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {scene.dialogue.length > 0 && (
            <div className="mt-8">
              <h2 className="card-title">Scene Preview</h2>
              <ViewScene scene={scene} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 