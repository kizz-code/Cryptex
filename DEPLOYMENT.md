# Cryptex — Vercel Deployment Guide

Complete step-by-step instructions to deploy this Vite + React app to a live Vercel URL.

---

## 1. Prerequisites

Node.js 18+ and npm must be installed.  
Verify with: `node -v && npm -v`

---

## 2. Install the Vercel CLI

```bash
npm install -g vercel
```

Confirm it's available:

```bash
vercel --version
```

---

## 3. Log in to Vercel

```bash
vercel login
```

This opens a browser prompt. Authenticate with GitHub, GitLab, Bitbucket, or email.

---

## 4. vite.config.js — no changes needed

The default Vite config already produces a `dist/` folder that Vercel understands.
The only optional addition is setting a `base` path if you're deploying to a sub-path
(e.g. `/cryptex/`). For a root deployment, leave `vite.config.js` as-is:

```js
// vite.config.js — already correct for Vercel
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // base: '/cryptex/',   ← only add this if deploying to a sub-path
})
```

---

## 5. Environment variables

This project uses the **CoinGecko free API** — no key is required and there are
no secrets to store. If you later upgrade to a paid CoinGecko plan:

### Local development
Create `.env.local` in the project root (already in `.gitignore`):

```
VITE_COINGECKO_API_KEY=your_key_here
```

Access it in code:

```js
const headers = import.meta.env.VITE_COINGECKO_API_KEY
  ? { 'x-cg-pro-api-key': import.meta.env.VITE_COINGECKO_API_KEY }
  : {};
```

### Production (Vercel Dashboard)
1. Open your project on vercel.com → **Settings → Environment Variables**
2. Add `VITE_COINGECKO_API_KEY` with your key value
3. Set scope to **Production** (and optionally Preview)
4. Redeploy — Vercel bakes env vars into the build at deploy time

> **Important:** Vite only exposes variables prefixed with `VITE_` to client code.
> Never put secrets in `VITE_` variables — they are bundled into the public JS.

---

## 6. First deployment (interactive)

From the project root:

```bash
cd crypto-dashboard
vercel
```

The CLI will ask a few questions the first time:

| Prompt | Answer |
|--------|--------|
| Set up and deploy? | `Y` |
| Which scope? | Your personal account or team |
| Link to existing project? | `N` (creates a new one) |
| Project name | `cryptex` (or any name) |
| Directory | `.` |
| Override build settings? | `N` — Vercel auto-detects Vite |

Vercel detects the Vite framework automatically and sets:
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Install command:** `npm install`

---

## 7. Subsequent deployments

### Preview deployment (feature branch / PR)
```bash
vercel
```
This creates a unique preview URL like `cryptex-abc123-yourname.vercel.app`.

### Production deployment
```bash
vercel --prod
```
This pushes to your primary production URL.

---

## 8. CI/CD via GitHub (recommended)

The cleanest workflow — push to deploy automatically:

```bash
# One-time setup: connect your repo
vercel link          # links the local project to Vercel
vercel git connect   # connects to GitHub/GitLab/Bitbucket
```

After this:
- **Push to `main`** → production deployment
- **Push to any other branch** → preview deployment with its own URL
- **Pull request** → Vercel posts a preview URL as a PR comment

---

## 9. Your production URL

After `vercel --prod`, Vercel assigns two permanent URLs:

| URL | Notes |
|-----|-------|
| `https://cryptex.vercel.app` | If the name "cryptex" is available |
| `https://cryptex-yourname.vercel.app` | Always unique fallback |

You can also add a **custom domain** under:
`vercel.com → Project → Settings → Domains`

---

## 10. Useful CLI commands

```bash
vercel ls              # list all deployments
vercel logs            # stream logs from the latest production deploy
vercel env ls          # list environment variables
vercel rollback        # revert to the previous production deployment
vercel domains add example.com   # attach a custom domain
```

---

## 11. SPA routing — no extra config needed

Vite builds a pure SPA with a single `index.html`. Vercel serves SPAs correctly
out of the box — all routes fall back to `index.html`. No `vercel.json` rewrites
are required for this project.

If you later add `react-router-dom` with `createBrowserRouter`, Vercel handles
client-side routing automatically without any extra configuration.

---

## 12. Build locally before deploying (optional sanity check)

```bash
npm run build      # compiles to dist/
npm run preview    # serves dist/ locally at http://localhost:4173
```

If `preview` works, `vercel --prod` will too.
