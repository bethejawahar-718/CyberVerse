# CyberVerse Backend

This Express REST API is built around the pages and features in the supplied CyberVerse frontend. The supplied CSS and JavaScript source files are copied into `frontend/` without changing their code; their `.txt` export suffixes are removed and the `CSS`/`JS` folders are normalized to lowercase to match the HTML paths.

## Included API features

- Register, log in, fetch current user, and log out
- Course catalog and lesson content for the nine courses represented by the frontend
- Per-user lesson completion and dashboard progress
- Guided lab catalog and per-user lab completion
- Mentor list and a small built-in educational demo response endpoint
- JSON-file persistence in `backend/data/db.json`

## Run on Windows

1. Install Node.js LTS if it is not installed.
2. Open the `backend` folder in VS Code.
3. Copy `.env.example` to a new file named `.env`.
4. In `.env`, replace `JWT_SECRET` with a random secret of at least 32 characters.
5. Open the VS Code terminal in the `backend` folder and run:

   ```powershell
   npm install
   npm start
   ```

6. Confirm the API works by opening `http://localhost:5000/api/health`.

The first API write creates `data/db.json`. Keep this file private because it contains user account records (passwords are hashed, not stored in plaintext). Back it up before moving the project.

## Important frontend integration note

The frontend JavaScript has intentionally been left unchanged as requested. Its current authentication code uses `localStorage` directly, so it will continue to use browser-only accounts until it is connected to these API routes. The backend is ready, but a working full-stack login requires a small change in the existing `js/auth.js` registration/login handlers to call `/api/auth/register` and `/api/auth/login`, store the returned token, and send `Authorization: Bearer <token>` for protected requests. This can be added without changing CSS or redesigning the frontend.

## API reference

| Method | Route | Auth | Purpose |
|---|---|---:|---|
| GET | `/api/health` | No | Health check |
| POST | `/api/auth/register` | No | `{ fullName, email, password }` |
| POST | `/api/auth/login` | No | `{ email, password }`; returns `token` and `user` |
| GET | `/api/auth/me` | Yes | Current user |
| POST | `/api/auth/logout` | No | Logout acknowledgement; client should discard token |
| GET | `/api/courses` | No | All courses |
| GET | `/api/courses/:courseId` | No | Course and lessons |
| GET | `/api/lessons?courseId=1&level=beginner` | No | Filtered lessons |
| GET | `/api/dashboard` | Yes | User stats and course progress |
| GET | `/api/progress` | Yes | User lesson progress |
| PUT | `/api/progress/:lessonId` | Yes | `{ completed: true }` |
| GET | `/api/labs` | No | Lab catalog |
| GET | `/api/labs/:labId` | No | Lab details |
| GET | `/api/labs/completions` | Yes | User's completed labs |
| POST | `/api/labs/:labId/complete` | Yes | Mark a lab complete |
| GET | `/api/mentors` | No | Mentor list |
| POST | `/api/mentors/:mentorId/chat` | Yes | `{ message }`; returns a built-in demo answer |

## Before public deployment

This JSON-file store is suitable for a local prototype, not a multi-instance production deployment. For production, use a managed database, HTTPS, rate limiting, input validation, secure secrets, logging, backups, and a real AI provider if AI-generated mentor answers are required. Never put an AI provider key in frontend JavaScript.
