# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack (runs on http://localhost:3000)
- `npm run build` - Build production version
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code linting

## Project Architecture

This is a **Next.js 15 App Router** language learning application called "Infinite Language" built with TypeScript and Tailwind CSS. The app helps users practice English sentence construction through interactive exercises.

### Core Application Flow

1. **Home Page** (`/`) - User selects difficulty (쉬움/중간/어려움) and environment (일상/회사/쇼핑/여행/레스토랑/병원/학교/공항) 
2. **Quiz Page** (`/quiz`) - Receives URL params for difficulty and environment, generates sentences via OpenAI API, presents word-selection exercises
3. **Results** - Shows quiz completion results with correct/incorrect answers

### Key Components

- **Dropdown** (`src/components/Dropdown.tsx`) - Reusable dropdown selector with dark mode support
- **WordSelector** (`src/components/WordSelector.tsx`) - Interactive word selection interface with audio feedback, replaces previous drag-and-drop functionality

### API Routes

- **`/api/generate-sentences`** - Uses OpenAI GPT-3.5-turbo to generate 10 practice sentences based on difficulty and environment parameters. Returns shuffled word arrays for sentence reconstruction
- **`/api/tts`** - Text-to-speech endpoint using google-tts-api, provides audio URLs for pronunciation

### Technical Stack

- **Framework**: Next.js 15 with App Router and Turbopack
- **Styling**: Tailwind CSS v4 with dark mode support
- **Language**: TypeScript with strict typing
- **APIs**: OpenAI API for sentence generation, Google TTS API for audio
- **Audio**: Web Speech API fallback + Google TTS for pronunciation features

### Architecture Notes

- Uses `'use client'` directive for interactive components requiring browser APIs
- Implements Suspense boundaries for loading states in quiz page
- Korean language interface with English learning content
- Audio feedback system with Web Audio API beep sounds and TTS pronunciation
- Fisher-Yates shuffle algorithm for word randomization
- Error handling with user-friendly Korean error messages

### Environment Variables Required

- `OPENAI_API_KEY` - Required for sentence generation via OpenAI API

### MCP Configuration

This project uses MCP (Model Context Protocol) servers. To configure:

1. Copy `.mcp.json.example` to `.mcp.json`
2. Replace `YOUR_PROJECT_REF_HERE` with your Supabase project reference
3. Replace `YOUR_PERSONAL_ACCESS_TOKEN_HERE` with your Supabase Personal Access Token
4. The `.mcp.json` file is gitignored for security (contains sensitive tokens)