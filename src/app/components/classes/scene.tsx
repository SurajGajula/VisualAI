import { Dialogue } from "./dialogue";
import { v4 as uuidv4 } from 'uuid';

export interface SceneAssets {
    backgroundId?: string;
    characterIds?: string[];
    audioId?: string;
}

export class Scene {
    id: string;
    title: string;
    dialogue: Dialogue[];
    speakers: Set<string>;
    assets: SceneAssets;
    
    constructor(id: string = uuidv4(), title?: string) {
        this.id = id;
        this.title = title || `Scene ${Math.floor(Date.now() / 1000 % 10000)}`;
        this.dialogue = [];
        this.speakers = new Set<string>();
        this.assets = {
            backgroundId: undefined,
            characterIds: [],
            audioId: undefined
        };
    }
    
    setBackground(backgroundId: string | undefined) {
        this.assets.backgroundId = backgroundId;
    }
    
    setAudio(audioId: string | undefined) {
        this.assets.audioId = audioId;
    }
    
    addCharacter(characterId: string) {
        if (!this.assets.characterIds) {
            this.assets.characterIds = [];
        }
        
        if (!this.assets.characterIds.includes(characterId)) {
            this.assets.characterIds.push(characterId);
        }
    }
    
    removeCharacter(characterId: string) {
        if (this.assets.characterIds) {
            this.assets.characterIds = this.assets.characterIds.filter(id => id !== characterId);
        }
    }
    
    addDialogue(dialogue: Dialogue) {
        this.dialogue.push(dialogue);
        this.speakers.add(dialogue.speaker);
        
        // Initialize characterIds array if it doesn't exist
        if (!this.assets.characterIds) {
            this.assets.characterIds = [];
        }
    }
    
    removeDialogue(index: number) {
        if (index >= 0 && index < this.dialogue.length) {
            const removedDialogue = this.dialogue.splice(index, 1)[0];
            
            // Recalculate speakers
            this.recalculateSpeakers();
            
            return removedDialogue;
        }
        return null;
    }
    
    private recalculateSpeakers() {
        this.speakers.clear();
        this.dialogue.forEach(dialogue => {
            this.speakers.add(dialogue.speaker);
        });
    }
}
