'use client';

import React, { useState } from 'react';
import { Scene } from './classes/scene';

export function ViewScene({ scene }: { scene?: Scene }) {
  const [selectedSpeaker, setSelectedSpeaker] = useState<string | 'all'>('all');

  if (!scene) {
    return (
      <div className="p-4 bg-gray-50 rounded border border-gray-200">
        <p className="text-gray-500">No scene data available. Parse a file first.</p>
      </div>
    );
  }

  const filteredDialogues = selectedSpeaker === 'all' 
    ? scene.dialogue 
    : scene.dialogue.filter(d => d.speaker === selectedSpeaker);

  const validDialogues = filteredDialogues.filter(d => d.line && d.line.trim() !== '');

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Scene Overview</h3>
      <div className="mb-4">
        <p>
          <span className="font-medium">Speakers:</span> {scene.speakers.length ? scene.speakers.join(', ') : 'None detected'}
        </p>
        <p>
          <span className="font-medium">Dialogue count:</span> {validDialogues.length}
        </p>
      </div>

      {scene.speakers.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Filter by Speaker</h3>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setSelectedSpeaker('all')}
              className={`px-3 py-1 text-sm rounded ${
                selectedSpeaker === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}
            >
              All Speakers
            </button>
            {scene.speakers.map(speaker => (
              <button 
                key={speaker}
                onClick={() => setSelectedSpeaker(speaker)}
                className={`px-3 py-1 text-sm rounded ${
                  selectedSpeaker === speaker ? 'bg-blue-500 text-white' : 'bg-gray-100'
                }`}
              >
                {speaker}
              </button>
            ))}
          </div>
        </div>
      )}

      <h3 className="text-lg font-medium mb-2">Dialogue</h3>
      {validDialogues.length > 0 ? (
        <div className="space-y-2 max-h-96 overflow-y-auto p-2 border border-gray-200 rounded">
          {validDialogues.map((d, index) => (
            <div key={index} className="p-2 bg-gray-50 rounded">
              <span className="font-semibold text-blue-700">{d.speaker}:</span> {d.line}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 bg-gray-50 rounded border border-gray-200">
          <p className="text-gray-500">No valid dialogue lines found. Try a different file or parser settings.</p>
        </div>
      )}
    </div>
  );
}
