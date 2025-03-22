# VisualAI - Visual Novel Creation Platform

VisualAI is an innovative web application designed to help writers, creators, and developers transform written content into visual novel formats. By leveraging modern web technologies and AI assistance, VisualAI streamlines the process of creating interactive narratives from existing text sources.

![VisualAI Logo](./public/images/logo.png)

## Features

VisualAI offers a comprehensive set of tools to create and manage visual novel content:

### Integrated Workspace

The application provides a unified interface where users can access all tools from a single dashboard. The integrated workspace includes:

- **PDF Parser Tool** - Extract dialogue and text from PDF documents
- **Scene Viewer** - Preview how your visual novel scenes will look and feel
- **Asset Manager** - Organize audio, video, and image files for your projects

### PDF Text Extraction

Upload PDF documents to automatically extract and parse dialogue into structured scene formats that can be used in visual novels.

### Scene Editor

Create, modify, and manage visual novel scenes with an intuitive dialogue editor:
- Add and edit character dialogue
- Organize scenes and dialogue sequences
- Preview scenes in real-time

### Asset Management System

A powerful asset management system allowing users to:
- Upload and manage audio files
- Organize assets by type (audio, video, images)
- Associate assets with specific scenes or characters

### User Authentication

Secure user authentication system with:
- User registration and login
- Profile management
- Secure session handling

## Technology Stack

VisualAI is built with modern web technologies:

- **Next.js** - React framework for server-rendered applications
- **React** - Frontend library for building user interfaces
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **PDF.js** - PDF rendering library
- **Web Audio API** - For audio processing and playback
- **PostgreSQL** - Relational database (hosted on AWS RDS)

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- PostgreSQL database (local or AWS RDS)

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

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Update the database connection and other required settings

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Database Setup

The application requires a PostgreSQL database. You can use a local PostgreSQL instance or AWS RDS:

1. Create a database for the application
2. Update your `.env.local` file with the connection details
3. Run the database migrations:
   ```
   npx prisma migrate dev
   ```

## Usage Guide

### PDF Parsing

1. Navigate to the PDF Tool in the dashboard
2. Upload a PDF document
3. The system will extract dialogue and text
4. Review the extracted content in the Scene Viewer

### Scene Editing

1. Open the Scene Editor
2. Add character dialogue with speaker names
3. Edit or delete dialogue lines as needed
4. Preview your scene in real-time

### Asset Management

1. Access the Asset Manager
2. Upload audio files for your visual novel
3. Organize assets by type (audio, video, images)
4. Future updates will support video and image assets

## Project Structure

- `/src/app` - Next.js app directory with page components
- `/src/components` - Reusable React components
- `/src/context` - React context providers
- `/src/lib` - Utility functions and database operations
- `/src/types` - TypeScript type definitions
- `/public` - Static assets

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For support or inquiries, please contact support@visualai.example.com


