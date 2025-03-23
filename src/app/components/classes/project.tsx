import { Scene } from "./scene";

export interface Character {
    id: string;
    name: string;
    sprites: { [mood: string]: string }; // Mapping of mood to sprite URL
}

export interface Background {
    id: string;
    name: string;
    url: string;
}

export interface AudioTrack {
    id: string;
    name: string;
    url: string;
    type: 'music' | 'sfx' | 'ambient';
}

export class Project {
    id: string;
    name: string;
    description: string;
    scenes: Scene[];
    characters: Character[];
    backgrounds: Background[];
    audioTracks: AudioTrack[];
    
    constructor(
        name: string = 'New Project',
        description: string = '',
        scenes: Scene[] = [],
        characters: Character[] = [],
        backgrounds: Background[] = [],
        audioTracks: AudioTrack[] = []
    ) {
        this.id = Date.now().toString();
        this.name = name;
        this.description = description;
        this.scenes = scenes;
        this.characters = characters;
        this.backgrounds = backgrounds;
        this.audioTracks = audioTracks;
    }
    
    addScene(scene: Scene): void {
        this.scenes.push(scene);
        this.updateCharactersFromScenes();
    }
    
    removeScene(sceneId: string): void {
        this.scenes = this.scenes.filter(scene => scene.id !== sceneId);
    }
    
    updateCharactersFromScenes(): void {
        // Collect all unique speakers from all scenes
        const speakerSet = new Set<string>();
        this.scenes.forEach(scene => {
            scene.speakers.forEach(speaker => speakerSet.add(speaker));
        });
        
        // Add any new speakers as characters if they don't exist
        speakerSet.forEach(speakerName => {
            const exists = this.characters.some(char => char.name === speakerName);
            if (!exists) {
                this.characters.push({
                    id: `char_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                    name: speakerName,
                    sprites: { 'default': '' } // Empty default sprite
                });
            }
        });
    }
    
    addCharacter(name: string): Character {
        const character: Character = {
            id: `char_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            name,
            sprites: { 'default': '' }
        };
        this.characters.push(character);
        return character;
    }
    
    addBackground(name: string, url: string = ''): Background {
        const background: Background = {
            id: `bg_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            name,
            url
        };
        this.backgrounds.push(background);
        return background;
    }
    
    addAudioTrack(name: string, type: 'music' | 'sfx' | 'ambient', url: string = ''): AudioTrack {
        const audioTrack: AudioTrack = {
            id: `audio_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            name,
            type,
            url
        };
        this.audioTracks.push(audioTrack);
        return audioTrack;
    }
}