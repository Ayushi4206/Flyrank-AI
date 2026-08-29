# CineScope – React App Development with AI

## Overview

CineScope is a React-based movie discovery application built as part of my Frontend Development Internship at FlyRank AI.

The application allows users to browse popular movies, search for movies by title, and view detailed information about selected movies.

Movie data is fetched from the TMDB API. The project was developed with AI assistance and then manually reviewed, tested, debugged, and refactored.

---

## Live Demo

🚀 **Live Application:** [View CineScope on Vercel](https://movie-explorer-ebon-gamma.vercel.app/)

---

## Assignment Requirements

The assignment was to build a React application independently using AI as a development assistant.

The submission includes:

- A completed React application
- Prompts used during development
- An explanation of how AI assisted during implementation
- Examples of manual improvements, corrections, and refactoring

---

## Features

### Browse Popular Movies

When the application loads, it fetches and displays popular movies from the TMDB API.

### Search Movies

Users can search for movies by entering a movie title.

### Movie Details

Users can select a movie to view additional information.

### Loading States

The application provides feedback while movie data or movie details are loading.

### Error Handling

API errors are caught and displayed to the user instead of allowing the application to fail silently.

### Empty States

When a search does not return any results, the application displays an appropriate message.

### Browser Navigation

The application uses the browser History API to manage navigation between the movie list and selected movie details.

---

## Tech Stack

- React
- Vite
- JavaScript
- CSS
- TMDB API
- Git
- GitHub
- Vercel
- AI-assisted development

---

## Project Structure

```text
03-react-app-with-ai/
│
├── public/
│
├── src/
│   ├── api/
│   │   └── tmdbService.js
│   │
│   ├── assets/
│   │
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── SearchBar.jsx
│   │   ├── MovieGrid.jsx
│   │   ├── MovieCard.jsx
│   │   ├── MovieDetails.jsx
│   │   └── StatusMessage.jsx
│   │
│   ├── utils/
│   │
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .env
├── .env.example
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── vite.config.js
└── README.md