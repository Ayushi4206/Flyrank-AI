# Profile Settings Application

## Overview

This project is a profile settings application developed as part of my Frontend Development Internship at FlyRank AI.

The application allows users to manage profile information and demonstrates frontend interaction, backend API handling, and server-side validation.

---

## Features

- Update profile information
- Handle user input through forms
- Validate submitted data
- Process profile updates through an API
- Store and manage profile data

---

## Tech Stack

### Frontend

- HTML
- CSS
- JavaScript

### Backend

- Node.js
- Express.js

### Validation

- Zod

---

## Project Structure

```text
01-profile-settings/
│
├── public/
│   ├── css/
│   │   └── profile.css
│   ├── js/
│   │   └── profileForm.js
│   └── profile.html
│
├── src/
│   ├── routes/
│   │   └── profileRoutes.js
│   ├── schemas/
│   │   └── profileSchema.js
│   └── store/
│       └── profileStore.js
│
├── index.js
├── package.json
└── README.md