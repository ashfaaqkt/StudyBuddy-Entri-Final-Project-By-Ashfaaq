# StudyBuddy — Complete Setup Guide

Follow these steps in order to get the full stack running locally and deployed.

---

## 1. Prerequisites

- **Node.js 18+** — https://nodejs.org
- **Git** — https://git-scm.com
- A free **MongoDB Atlas** account — https://cloud.mongodb.com
- A free **Google AI Studio** account — https://aistudio.google.com

---

## 2. Clone & Install

```bash
git clone https://github.com/ashfaaqkt/StudyBuddy-Entri-Final-Project-By-Ashfaaq.git
cd StudyBuddy-Entri-Final-Project-By-Ashfaaq

# Install root runner + all workspace deps in one command
npm run install:all
```

---

## 3. MongoDB Atlas — Get Your URI

1. Log in at https://cloud.mongodb.com and click **"Build a Database"**.
2. Choose the **Free (M0)** tier, pick a region close to you, name the cluster (e.g. `studybuddy-cluster`).
3. Set a **username** and **password** (save these — you'll need them in the URI).
4. Under **Network Access** → **Add IP Address** → click **"Allow Access from Anywhere"** (0.0.0.0/0) for development.
5. Click **"Connect"** → **"Drivers"** → copy the URI. It looks like:
   ```
   mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Change `/?` to `/studybuddy?` so MongoDB creates a database named `studybuddy`:
   ```
   mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/studybuddy?retryWrites=true&w=majority
   ```

---

## 4. Gemini API Key

1. Go to https://aistudio.google.com/app/apikey
2. Click **"Create API key"** → copy the key (starts with `AIza...`).
3. The free tier is enough for development.

---

## 5. JWT Secret

Generate a cryptographically secure 32-byte secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the printed hex string.

---

## 6. Configure Environment Files

### Server (`server/.env`)

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

```
PORT=5000
MONGO_URI=mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/studybuddy?retryWrites=true&w=majority
JWT_SECRET=<paste the hex string from step 5>
GEMINI_API_KEY=<paste your Gemini key>
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Client (`client/.env`)

```bash
cp client/.env.example client/.env
```

Edit `client/.env`:

```
VITE_API_URL=http://localhost:5000/api
```

---

## 7. Run Locally

```bash
# From the project root:
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api/health (should return `{"status":"ok"}`)

---

## 8. Deploy — Backend on Render

1. Push your code to GitHub.
2. Go to https://render.com → **New** → **Web Service**.
3. Connect your GitHub repo and select the repo.
4. Set the following:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Node version**: 18
5. Under **Environment Variables**, add each key from `server/.env` (never upload the `.env` file itself):
   - `MONGO_URI`
   - `JWT_SECRET`
   - `GEMINI_API_KEY`
   - `NODE_ENV` → `production`
   - `CLIENT_URL` → your Vercel frontend URL (see step 9, fill in after deploy)
6. Click **Create Web Service**. Render will give you a URL like `https://studybuddy-api.onrender.com`.

---

## 9. Deploy — Frontend on Vercel

1. Go to https://vercel.com → **New Project** → Import your GitHub repo.
2. Set the following:
   - **Root Directory**: `client`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Under **Environment Variables**, add:
   - `VITE_API_URL` → `https://studybuddy-api.onrender.com/api` (your Render URL + `/api`)
4. Click **Deploy**. Vercel will give you a URL like `https://studybuddy.vercel.app`.
5. Go back to Render → your web service → **Environment** → update `CLIENT_URL` to your Vercel URL, then **Redeploy**.

---

## 10. Link Local Repo to the New GitHub Remote

If you need to set the remote to the new repository:

```bash
git remote remove origin
git remote add origin https://github.com/ashfaaqkt/StudyBuddy-Entri-Final-Project-By-Ashfaaq.git
git branch -M main
git push -u origin main
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `ECONNREFUSED` on API calls | Make sure `npm run dev` is running and `VITE_API_URL` points to `http://localhost:5000/api` |
| `MongoServerError: bad auth` | Check username/password in `MONGO_URI` (special chars must be URL-encoded) |
| `401 Unauthorized` on all API routes | Token expired or missing — log out and log back in |
| Gemini returns 429 | You've hit the free-tier rate limit; wait 60 seconds and retry |
| Render cold start (30 s delay) | Free Render instances spin down after 15 min of inactivity — this is normal |
