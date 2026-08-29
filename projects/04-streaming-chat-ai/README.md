# DevBrief AI — Streaming Chat Interface

A React-based AI chat interface designed to turn vague product ideas and technical problems into structured, actionable implementation plans.

Built as part of the **FlyRank AI Frontend Track**.

---

## Overview

DevBrief AI is designed around a specific workflow:

> **Messy idea → Problem breakdown → Technical decisions → Actionable next steps**

Instead of creating a generic “Ask me anything” chatbot, this project focuses on helping users structure product ideas, features, and technical problems.

The interface supports progressive response rendering, conversation state, generation controls, and smart scrolling behavior.

---

## Features

- Progressive streaming-style response rendering
- Thinking indicator before response generation
- Stop generation while preserving partial output
- Multi-turn conversation state
- Smart auto-scroll behavior
- Jump-to-latest control
- Responsive interface
- Reusable React component architecture
- Backend structure prepared for server-side Claude API integration

---

## Tech Stack

### Frontend

- React
- Vite
- JavaScript
- CSS

### Backend

- Node.js
- Express
- CORS
- dotenv
- Anthropic SDK

---

## Project Structure

```text
04-streaming-chat-ai/
│
├── public/
│   ├── favicon.svg
│   └── icons.svg
│
├── server/
│   └── index.js
│
├── src/
│   ├── assets/
│   │   └── hero.png
│   │
│   ├── components/
│   │   ├── ChatInput.jsx
│   │   ├── ChatMessage.jsx
│   │   ├── JumpToLatest.jsx
│   │   └── ThinkingIndicator.jsx
│   │
│   ├── hooks/
│   │   └── useSmartScroll.js
│   │
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── package.json
└── vite.config.js