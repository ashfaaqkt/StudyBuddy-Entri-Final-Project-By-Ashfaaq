# StudyBuddy — AI-Powered Study Notes & Quiz Platform

> **Educational Project** — Built as the Final Project for the **Entri Elevate Full Stack MERN** programme.

A full-stack MERN application that lets students capture notes, summarize them with Gemini AI, and auto-generate quizzes — all behind secure JWT authentication.

---

## Live Demo

| | Link |
|---|---|
| **Frontend** (Vercel) | [study-buddy-entri-final-project-by.vercel.app](https://study-buddy-entri-final-project-by.vercel.app/#/) |
| **Backend API** (Render) | [studybuddy-server-qx4w.onrender.com](https://studybuddy-server-qx4w.onrender.com) |

> **Note:** The backend is hosted on Render's free tier — it may take 30–60 seconds to wake up on the first request after a period of inactivity.

---

## About the Developer

**Ashfaaq Feroz Muhammad**
Full Stack MERN Developer — Entri Elevate Graduate

- GitHub: [@ashfaaqkt](https://github.com/ashfaaqkt)
- Email: ashfaaqktmail@gmail.com

This project was designed, built, and deployed independently as the capstone submission for the **Entri Elevate Full Stack MERN** course. It demonstrates end-to-end proficiency across the MongoDB, Express, React, and Node.js stack — including JWT authentication, REST API design, AI integration, and cloud deployment.

---

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

---

## Features

- **Auth** — Register / Login with JWT, protected routes
- **Notes CRUD** — Create, read, update, delete rich-text notes stored in MongoDB
- **Search** — Server-side keyword search across title, subject, and content
- **AI Summarize** — Bullet-point summary via Gemini (backend route)
- **AI Quiz** — 5-question MCQ quiz generated from any note
- **Pomodoro Timer** — 25/5 focus-break cycle
- **Analytics** — Quiz score history with Recharts

---

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
├── SETUP_GUIDE.md
└── SECURITY.md
```

---

## Quick Start

See **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** for full instructions including MongoDB Atlas, Gemini API key, and cloud deployment.

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

---

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

---

## License

MIT License

Copyright (c) 2026 Ashfaaq Feroz Muhammad

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

*This project was built for educational purposes as part of the Entri Elevate Full Stack MERN programme.*
