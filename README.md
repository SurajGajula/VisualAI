# VisualAI - Visual Novel Creation Tool

VisualAI is a streamlined web application designed to help writers and creators build visual novels directly in the browser. With an intuitive interface focused on scene management, dialogue creation, and visual playback, VisualAI makes it easy to craft interactive storytelling experiences.

## Features

VisualAI offers a simple yet powerful set of tools organized into three main tabs:

### Create Mode

The Create tab is where you build your story:

- **Scene Management** - Create, edit, and organize multiple scenes
- **Dialogue Editor** - Add dialogue lines with speakers
- **Character Assignment** - Characters are automatically created when dialogue is added

### Assets Mode

The Assets tab lets you manage visual elements and characters:

- **Character Manager** - Create and customize characters
- **Background Images** - Add background images for your scenes
- **Asset Assignment** - Easily assign characters and backgrounds to scenes

### Play Mode

See your visual novel come to life in Play mode:

- **Interactive Playback** - Step through scenes and dialogue
- **Visual Presentation** - View characters and backgrounds
- **Scene Navigation** - Move between scenes in your story

## Key Features

- **Automated Character Creation** - Characters are automatically added when mentioned in dialogue
- **Visual Novel Preview** - See how your story will look to readers
- **Local Storage** - Your projects are saved in your browser
- **No Server Required** - Works entirely client-side

## Technology Stack

VisualAI is built with modern web technologies:

- **Next.js** - React framework for web applications
- **React** - Frontend library for building user interfaces
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - State management with persistence

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/visualai.git
   cd visualai
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to start using VisualAI.

## Usage Guide

### Creating a Project

1. When you first open VisualAI, you'll be prompted to create a new project
2. Enter a name for your project and click "Create"
3. A default scene will be automatically created for you

### Adding Dialogue

1. Select a scene in the scene selector
2. Use the dialogue editor to add character lines
3. Characters are automatically created when you add dialogue with new speakers

### Managing Assets

1. Switch to the Assets tab
2. Add characters and upload images for them
3. Add background images for your scenes
4. Assign characters and backgrounds to specific scenes

### Playing Your Story

1. Switch to the Play tab
2. Use the navigation controls to move through your dialogue
3. See your characters and backgrounds displayed
4. Navigate between scenes using the controls

## Project Structure

- `/src/app` - Next.js app directory with page components
- `/src/app/components` - React components for the application
- `/src/app/components/classes` - Class definitions for Scene, Dialogue, etc.
- `/src/context` - React context providers
- `/src/lib` - Utility functions and store
- `/src/styles` - CSS and Tailwind configuration
- `/src/types` - TypeScript type definitions


