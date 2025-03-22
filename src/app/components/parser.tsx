import { Dialogue } from "./classes/dialogue";
import { Scene } from "./classes/scene";

// Parse the extracted text into a Scene object with Dialogue objects
export async function parsePdfFile(file: File): Promise<Scene> {
  try {
    // For text files, read the content directly
    const text = await readFileAsText(file);
    
    // Parse the text into a Scene
    return createSceneFromText(text);
  } catch (error: any) {
    console.error('Error in parsePdfFile:', error);
    throw new Error('Failed to create scene: ' + (error.message || 'Unknown error'));
  }
}

// Helper function to read file as text
function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (text) {
          resolve(text);
        } else {
          reject(new Error('Failed to read text from file'));
        }
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
}

// Create a Scene from the extracted text
export function createSceneFromText(text: string): Scene {
  // Extract dialogue lines from the text
  const dialogues = parseDialogueFromText(text);
  
  // Extract unique speakers
  const speakers = extractUniqueSpeakers(dialogues);
  
  // Create and return a Scene
  return new Scene(dialogues, speakers);
}

// Parse dialogue from the extracted text
function parseDialogueFromText(text: string): Dialogue[] {
  console.log("Parsing dialogue from text:", text);
  
  // Split the text by "Speaker" pattern
  // This regex looks for "Speaker" followed by a number and colon
  const speakerPattern = /Speaker\s+\d+:/g;
  
  // Find all positions of speaker patterns
  const speakerPositions: { index: number, match: string }[] = [];
  let match;
  while ((match = speakerPattern.exec(text)) !== null) {
    speakerPositions.push({ index: match.index, match: match[0] });
  }
  
  const dialogues: Dialogue[] = [];
  
  // Process each dialogue segment
  for (let i = 0; i < speakerPositions.length; i++) {
    const currentPos = speakerPositions[i];
    const nextPos = i < speakerPositions.length - 1 ? speakerPositions[i + 1] : { index: text.length, match: "" };
    
    // Extract the dialogue text between this speaker and the next one
    const startIndex = currentPos.index;
    const endIndex = nextPos.index;
    const dialogueText = text.substring(startIndex, endIndex).trim();
    
    // Create a Dialogue object from the text
    // The Dialogue constructor will handle splitting the text at the first colon
    if (dialogueText) {
      dialogues.push(new Dialogue(dialogueText));
    }
  }
  
  // If we couldn't find any dialogue with the Speaker pattern, try a simpler approach
  if (dialogues.length === 0) {
    // Split by newlines and look for lines containing a colon
    const lines = text.split(/\s+/).filter(line => line.includes(':'));
    
    for (const line of lines) {
      if (line.includes(':')) {
        dialogues.push(new Dialogue(line));
      }
    }
  }
  
  console.log("Parsed dialogues:", dialogues);
  return dialogues;
}

// Extract unique speakers from the dialogues
function extractUniqueSpeakers(dialogues: Dialogue[]): string[] {
  const speakerSet = new Set<string>();
  
  dialogues.forEach(dialogue => {
    if (dialogue.speaker && dialogue.speaker !== 'Unknown') {
      speakerSet.add(dialogue.speaker);
    }
  });
  
  return Array.from(speakerSet);
} 