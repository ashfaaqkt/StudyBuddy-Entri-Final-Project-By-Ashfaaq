# StudyBuddy — AI-Powered Study Notes & Quiz Platform

A full-stack MERN application that lets students capture notes, summarize them with Gemini AI, and auto-generate quizzes — all behind secure JWT authentication.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 |
| Backend | Node.js, Express 4, MongoDB (Mongoose) |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| AI | Google Gemini 2.0 Flash (`@google/generative-ai`) |
| HTTP Client | Axios |
| Editor | React Quill (rich text) |
| Charts | Recharts |
| PDF | jsPDF |

## Features

- **Auth** — Register / Login with JWT, protected routes
- **Notes CRUD** — Create, read, update, delete rich-text notes stored in MongoDB
- **Search** — Server-side keyword search across title, subject, and content
- **AI Summarize** — Bullet-point summary via Gemini (backend route)
- **AI Quiz** — 5-question MCQ quiz generated from any note
- **Pomodoro Timer** — 25/5 focus-break cycle
- **Analytics** — Quiz score history with Recharts

## Project Structure

```
studybuddy/
├── client/          # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── context/     # AuthContext, AppContext
│   │   ├── pages/
│   │   └── services/    # api.js (Axios), gemini.js
│   └── .env.example
├── server/          # Express + MongoDB backend
│   ├── config/      # db.js
│   ├── controllers/ # authController, noteController, aiController
│   ├── middleware/  # authMiddleware (JWT)
│   ├── models/      # User, Note, QuizScore
│   ├── routes/      # authRoutes, noteRoutes, aiRoutes
│   ├── index.js
│   └── .env.example
├── package.json     # Root runner (concurrently)
└── SETUP_GUIDE.md
```

## Quick Start

See **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** for full instructions including MongoDB Atlas, Gemini API key, and deployment.

```bash
# 1. Install all dependencies
npm run install:all

# 2. Copy env files and fill in your values
cp server/.env.example server/.env
cp client/.env.example client/.env

# 3. Run both apps in parallel
npm run dev
```

Frontend: http://localhost:5173  
Backend API: http://localhost:5000/api

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET | `/api/auth/me` | JWT | Get current user |
| GET | `/api/notes?search=` | JWT | List notes (optional keyword search) |
| POST | `/api/notes` | JWT | Create note |
| PUT | `/api/notes/:id` | JWT | Update note |
| DELETE | `/api/notes/:id` | JWT | Delete note |
| POST | `/api/ai/summarize` | JWT | Summarize note content |
| POST | `/api/ai/quiz` | JWT | Generate 5-question MCQ quiz |
| GET | `/api/ai/scores` | JWT | Get quiz score history |
| POST | `/api/ai/scores` | JWT | Save quiz result |

## License

MIT — Built as the Entri MERN Final Project by Ashfaaq KT.
