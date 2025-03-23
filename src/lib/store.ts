import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Scene } from '@/app/components/classes/scene';
import { Dialogue } from '@/app/components/classes/dialogue';
import { v4 as uuidv4 } from 'uuid';

export interface Character {
  id: string;
  name: string;
  imageUrl?: string;
}

export interface Background {
  id: string;
  name: string;
  imageUrl: string;
}

export interface Audio {
  id: string;
  name: string;
  audioUrl: string;
}

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  scenes: Scene[];
  characters: Character[];
  backgrounds: Background[];
  audios: Audio[];
}

// Helper function to hydrate a Scene object from stored data
const hydrateScene = (sceneData: Scene | null): Scene | null => {
  if (!sceneData) return null;
  
  const scene = new Scene(sceneData.id, sceneData.title);
  
  // Copy existing data
  scene.dialogue = [...sceneData.dialogue];
  scene.speakers = new Set(Array.from(sceneData.speakers || []));
  scene.assets = { ...sceneData.assets };
  
  return scene;
};

// Create default project with a stable ID
const DEFAULT_PROJECT_ID = "default-project-id";

// Create default project 
const createDefaultProject = (): Project => ({
  id: DEFAULT_PROJECT_ID,
  name: "My Visual Novel",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  scenes: [],
  characters: [],
  backgrounds: [],
  audios: []
});

interface ProjectStore {
  projects: Project[];
  currentProjectId: string | null;
  activeSceneId: string | null;
  
  // Project methods
  createProject: (name: string) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getCurrentProject: () => Project | null;
  setCurrentProject: (id: string) => void;
  
  // Scene methods
  addScene: (scene: Scene) => void;
  updateScene: (id: string, updates: Partial<Scene>) => void;
  updateSceneTitle: (id: string, title: string) => void;
  removeScene: (id: string) => void;
  getActiveScene: () => Scene | null;
  setActiveSceneId: (id: string | null) => void;
  getSceneById: (id: string) => Scene | null;
  addDialogueToScene: (sceneId: string, dialogue: Dialogue) => void;
  removeDialogueFromScene: (sceneId: string, index: number) => void;
  
  // Asset methods
  addCharacter: (character: Character) => void;
  updateCharacter: (id: string, updates: Partial<Character>) => void;
  removeCharacter: (id: string) => void;
  
  addBackground: (background: Background) => void;
  updateBackground: (id: string, updates: Partial<Background>) => void;
  removeBackground: (id: string) => void;
  
  addAudio: (audio: Audio) => void;
  updateAudio: (id: string, updates: Partial<Audio>) => void;
  removeAudio: (id: string) => void;
  
  // Scene asset assignment
  setSceneBackground: (sceneId: string, backgroundId: string | undefined) => void;
  setSceneAudio: (sceneId: string, audioId: string | undefined) => void;
  addCharacterToScene: (sceneId: string, characterId: string) => void;
  removeCharacterFromScene: (sceneId: string, characterId: string) => void;
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: [createDefaultProject()],
      currentProjectId: DEFAULT_PROJECT_ID,
      activeSceneId: null,
      
      // Project methods
      createProject: (name: string) => {
        const newProject: Project = {
          id: uuidv4(),
          name,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          scenes: [],
          characters: [],
          backgrounds: [],
          audios: []
        };
        
        set(state => ({ 
          projects: [...state.projects, newProject],
          currentProjectId: newProject.id
        }));
      },
      
      updateProject: (id: string, updates: Partial<Project>) => {
        set(state => ({
          projects: state.projects.map(project => 
            project.id === id 
              ? { ...project, ...updates, updatedAt: new Date().toISOString() }
              : project
          )
        }));
      },
      
      deleteProject: (id: string) => {
        set(state => ({
          projects: state.projects.filter(project => project.id !== id),
          currentProjectId: state.currentProjectId === id ? null : state.currentProjectId
        }));
      },
      
      getCurrentProject: () => {
        const { projects, currentProjectId } = get();
        
        if (!currentProjectId || !projects.length) {
          // If no project is selected or no projects exist, create a default
          const defaultProject = createDefaultProject();
          set({ 
            projects: [defaultProject], 
            currentProjectId: defaultProject.id 
          });
          return defaultProject;
        }
        
        const currentProject = projects.find(p => p.id === currentProjectId);
        
        // If the current project ID doesn't exist in projects, return first project
        if (!currentProject) {
          set({ currentProjectId: projects[0].id });
          return projects[0];
        }
        
        return currentProject;
      },
      
      setCurrentProject: (id: string) => {
        set({ currentProjectId: id, activeSceneId: null });
      },
      
      // Scene methods
      addScene: (scene: Scene) => {
        const { getCurrentProject } = get();
        const currentProject = getCurrentProject();
        if (!currentProject) return;
        
        set(state => ({
          projects: state.projects.map(project => 
            project.id === currentProject.id
              ? { 
                  ...project, 
                  scenes: [...project.scenes, scene],
                  updatedAt: new Date().toISOString()
                }
              : project
          ),
          activeSceneId: scene.id
        }));
      },
      
      updateScene: (id: string, updates: Partial<Scene>) => {
        const { getCurrentProject } = get();
        const currentProject = getCurrentProject();
        if (!currentProject) return;
        
        set(state => ({
          projects: state.projects.map(project => 
            project.id === currentProject.id
              ? { 
                  ...project, 
                  scenes: project.scenes.map(scene => 
                    scene.id === id
                      ? { ...scene, ...updates }
                      : scene
                  ),
                  updatedAt: new Date().toISOString()
                }
              : project
          )
        }));
      },
      
      updateSceneTitle: (id: string, title: string) => {
        const { updateScene } = get();
        updateScene(id, { title });
      },
      
      removeScene: (id: string) => {
        const { getCurrentProject, activeSceneId } = get();
        const currentProject = getCurrentProject();
        if (!currentProject) return;
        
        set(state => ({
          projects: state.projects.map(project => 
            project.id === currentProject.id
              ? { 
                  ...project, 
                  scenes: project.scenes.filter(scene => scene.id !== id),
                  updatedAt: new Date().toISOString()
                }
              : project
          ),
          activeSceneId: activeSceneId === id ? null : activeSceneId
        }));
      },
      
      getActiveScene: () => {
        const { getCurrentProject, activeSceneId } = get();
        const currentProject = getCurrentProject();
        if (!currentProject || !activeSceneId) return null;
        
        const sceneData = currentProject.scenes.find(scene => scene.id === activeSceneId) || null;
        return hydrateScene(sceneData);
      },
      
      setActiveSceneId: (id: string | null) => {
        set({ activeSceneId: id });
      },
      
      getSceneById: (id: string) => {
        const { getCurrentProject } = get();
        const currentProject = getCurrentProject();
        if (!currentProject) return null;
        
        const sceneData = currentProject.scenes.find(scene => scene.id === id) || null;
        return hydrateScene(sceneData);
      },
      
      addDialogueToScene: (sceneId: string, dialogue: Dialogue) => {
        const { getSceneById, updateScene, addCharacter, addCharacterToScene } = get();
        const sceneData = getSceneById(sceneId);
        const scene = hydrateScene(sceneData);
        if (!scene) return;
        
        // Add the dialogue to the scene
        scene.addDialogue(dialogue);
        
        // Get the current project and check if the speaker exists as a character
        const { getCurrentProject } = get();
        const currentProject = getCurrentProject();
        if (!currentProject) return;
        
        const speakerName = dialogue.speaker;
        
        // Check if the speaker already exists as a character
        let characterId: string | undefined;
        const existingCharacter = currentProject.characters.find(
          char => char.name.toLowerCase() === speakerName.toLowerCase()
        );
        
        if (existingCharacter) {
          // If the character exists, use its ID
          characterId = existingCharacter.id;
        } else {
          // Create a new character for the speaker
          const newCharacter: Character = {
            id: `character-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            name: speakerName
          };
          
          // Add the new character to the project
          addCharacter(newCharacter);
          characterId = newCharacter.id;
        }
        
        // Add the character to the scene if not already present
        if (characterId && (!scene.assets.characterIds || !scene.assets.characterIds.includes(characterId))) {
          addCharacterToScene(scene.id, characterId);
        }
        
        // Update the scene with the modified instance
        updateScene(sceneId, scene);
      },
      
      removeDialogueFromScene: (sceneId: string, index: number) => {
        const { getSceneById, updateScene } = get();
        const sceneData = getSceneById(sceneId);
        const scene = hydrateScene(sceneData);
        if (!scene) return;
        
        // Now we can call the class method
        scene.removeDialogue(index);
        
        // Update the scene with the modified instance
        updateScene(sceneId, scene);
      },
      
      // Asset methods
      addCharacter: (character: Character) => {
        const { getCurrentProject } = get();
        const currentProject = getCurrentProject();
        if (!currentProject) return;
        
        set(state => ({
          projects: state.projects.map(project => 
            project.id === currentProject.id
              ? { 
                  ...project, 
                  characters: [...project.characters, character],
                  updatedAt: new Date().toISOString()
                }
              : project
          )
        }));
      },
      
      updateCharacter: (id: string, updates: Partial<Character>) => {
        const { getCurrentProject } = get();
        const currentProject = getCurrentProject();
        if (!currentProject) return;
        
        set(state => ({
          projects: state.projects.map(project => 
            project.id === currentProject.id
              ? { 
                  ...project, 
                  characters: project.characters.map(character => 
                    character.id === id
                      ? { ...character, ...updates }
                      : character
                  ),
                  updatedAt: new Date().toISOString()
                }
              : project
          )
        }));
      },
      
      removeCharacter: (id: string) => {
        const { getCurrentProject } = get();
        const currentProject = getCurrentProject();
        if (!currentProject) return;
        
        set(state => ({
          projects: state.projects.map(project => 
            project.id === currentProject.id
              ? { 
                  ...project, 
                  characters: project.characters.filter(character => character.id !== id),
                  updatedAt: new Date().toISOString()
                }
              : project
          )
        }));
      },
      
      addBackground: (background: Background) => {
        const { getCurrentProject } = get();
        const currentProject = getCurrentProject();
        if (!currentProject) return;
        
        set(state => ({
          projects: state.projects.map(project => 
            project.id === currentProject.id
              ? { 
                  ...project, 
                  backgrounds: [...project.backgrounds, background],
                  updatedAt: new Date().toISOString()
                }
              : project
          )
        }));
      },
      
      updateBackground: (id: string, updates: Partial<Background>) => {
        const { getCurrentProject } = get();
        const currentProject = getCurrentProject();
        if (!currentProject) return;
        
        set(state => ({
          projects: state.projects.map(project => 
            project.id === currentProject.id
              ? { 
                  ...project, 
                  backgrounds: project.backgrounds.map(background => 
                    background.id === id
                      ? { ...background, ...updates }
                      : background
                  ),
                  updatedAt: new Date().toISOString()
                }
              : project
          )
        }));
      },
      
      removeBackground: (id: string) => {
        const { getCurrentProject } = get();
        const currentProject = getCurrentProject();
        if (!currentProject) return;
        
        set(state => ({
          projects: state.projects.map(project => 
            project.id === currentProject.id
              ? { 
                  ...project, 
                  backgrounds: project.backgrounds.filter(background => background.id !== id),
                  updatedAt: new Date().toISOString()
                }
              : project
          )
        }));
      },
      
      addAudio: (audio: Audio) => {
        const { getCurrentProject } = get();
        const currentProject = getCurrentProject();
        if (!currentProject) return;
        
        set(state => ({
          projects: state.projects.map(project => 
            project.id === currentProject.id
              ? { 
                  ...project, 
                  audios: [...project.audios, audio],
                  updatedAt: new Date().toISOString()
                }
              : project
          )
        }));
      },
      
      updateAudio: (id: string, updates: Partial<Audio>) => {
        const { getCurrentProject } = get();
        const currentProject = getCurrentProject();
        if (!currentProject) return;
        
        set(state => ({
          projects: state.projects.map(project => 
            project.id === currentProject.id
              ? { 
                  ...project, 
                  audios: project.audios.map(audio => 
                    audio.id === id
                      ? { ...audio, ...updates }
                      : audio
                  ),
                  updatedAt: new Date().toISOString()
                }
              : project
          )
        }));
      },
      
      removeAudio: (id: string) => {
        const { getCurrentProject } = get();
        const currentProject = getCurrentProject();
        if (!currentProject) return;
        
        set(state => ({
          projects: state.projects.map(project => 
            project.id === currentProject.id
              ? { 
                  ...project, 
                  audios: project.audios.filter(audio => audio.id !== id),
                  updatedAt: new Date().toISOString()
                }
              : project
          )
        }));
      },
      
      // Scene asset assignment
      setSceneBackground: (sceneId: string, backgroundId: string | undefined) => {
        const { getSceneById, updateScene } = get();
        const sceneData = getSceneById(sceneId);
        const scene = hydrateScene(sceneData);
        if (!scene) return;
        
        scene.setBackground(backgroundId);
        updateScene(sceneId, scene);
      },
      
      setSceneAudio: (sceneId: string, audioId: string | undefined) => {
        const { getSceneById, updateScene } = get();
        const sceneData = getSceneById(sceneId);
        const scene = hydrateScene(sceneData);
        if (!scene) return;
        
        scene.setAudio(audioId);
        updateScene(sceneId, scene);
      },
      
      addCharacterToScene: (sceneId: string, characterId: string) => {
        const { getSceneById, updateScene } = get();
        const sceneData = getSceneById(sceneId);
        const scene = hydrateScene(sceneData);
        if (!scene) return;
        
        scene.addCharacter(characterId);
        updateScene(sceneId, scene);
      },
      
      removeCharacterFromScene: (sceneId: string, characterId: string) => {
        const { getSceneById, updateScene } = get();
        const sceneData = getSceneById(sceneId);
        const scene = hydrateScene(sceneData);
        if (!scene) return;
        
        scene.removeCharacter(characterId);
        updateScene(sceneId, scene);
      }
    }),
    {
      name: 'visual-novel-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Don't persist any state between refreshes
        // Return an empty object to start fresh on each page load
        currentProjectId: undefined
      })
    }
  )
); 