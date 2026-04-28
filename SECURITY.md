# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x (current) | Yes |

## Reporting a Vulnerability

Please email **ashfaaqktmail@gmail.com** to report security issues. Do not open a public GitHub issue for vulnerabilities. You can expect an initial response within 48 hours.

## Security Practices in This Project

### Authentication & Authorisation
- All passwords are hashed with **bcryptjs** (cost factor 12) before storage — plain-text passwords are never persisted.
- Sessions use stateless **JWT** (HS256) with a 30-day expiry stored only in `localStorage` on the client.
- Every API route that accesses user data is protected by the `protect` middleware which verifies the JWT on every request.
- Notes and quiz scores are always filtered by `user: req.user._id` — cross-user data access is impossible at the query level.

### Input Validation & Injection Prevention
- Mongoose schemas define strict types, `required`, `trim`, and `maxlength` constraints that reject malformed documents before they hit the database.
- Express route handlers validate required fields explicitly and return 400 before touching the database.
- MongoDB queries use parameterised Mongoose methods — no raw string interpolation into queries.
- `$regex` search uses the `i` flag only on user-supplied strings already validated as non-empty after trim.

### Rate Limiting
- A general API limiter (200 req / 15 min) is applied to all `/api` routes.
- A strict AI limiter (10 req / 60 s) is applied to `/api/ai` routes to prevent Gemini API abuse.

### Transport Security
- In production both the client (Vercel) and server (Render) are served over HTTPS.
- The CORS policy on the server explicitly allows only `CLIENT_URL` (set via environment variable).
- `express.json({ limit: '2mb' })` is set to prevent payload-flooding.

### Secrets Management
- **Never** commit `.env` files — they are listed in `.gitignore`.
- All secrets (`MONGO_URI`, `JWT_SECRET`, `GEMINI_API_KEY`) are injected at runtime through environment variables on the host platform (Render / Vercel).
- The `JWT_SECRET` should be at least 32 random characters. Generate one with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.

### Gemini AI Key Exposure
- The Gemini API key is only used server-side. It is **never** sent to the browser.
- The client calls `/api/ai/*` (JWT-protected) and the server forwards the request to Google with the key from `process.env.GEMINI_API_KEY`.

### Frontend Security
- No `dangerouslySetInnerHTML` is used with unsanitised user input in production flows.
- The `api.js` Axios interceptor clears the stored token and redirects to `/` on any 401 response.
