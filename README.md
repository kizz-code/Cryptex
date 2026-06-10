# ◈ Cryptex — Crypto Market Terminal

> A real-time cryptocurrency dashboard built with React, featuring live price charts, coin comparison, watchlist management, and a full-text search across 10,000+ coins.

**🌐 Live Demo → [cryptex-plum.vercel.app](https://cryptex-plum.vercel.app)**

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38BDF8?style=flat&logo=tailwindcss)
![Recharts](https://img.shields.io/badge/Recharts-3-22C55E?style=flat)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=flat&logo=vercel)

---

## Overview

Cryptex is a production-deployed frontend application that replicates the core experience of a professional crypto trading terminal. It pulls live market data from the CoinGecko API and presents it in a clean, dark-themed dashboard with real-time updates, interactive charts, and persistent user preferences.

The project was built in two phases to demonstrate iterative feature development — starting with a solid data-fetching foundation and progressively layering in more complex UI patterns like debounced search, localStorage persistence, and multi-series chart overlays.

---

## Features

### 📊 Live Market Data
- Top 10 coins ranked by market cap, auto-refreshing every 60 seconds
- 6-metric stats strip per coin — price, market cap, 24h high/low, volume, % change
- Price history charts across 1D / 7D / 30D / 90D / 1Y timeframes
- Gradient area chart with trend-adaptive colour (green uptrend / red downtrend)

### 🔍 Search
- Debounced search (300ms) across the full CoinGecko catalogue (10,000+ coins)
- Results dropdown with coin logo, name, symbol, and market-cap rank
- Selecting a search result loads its chart and stats instantly — not limited to the top 10

### ⭐ Watchlist
- Star any coin with a single click to add it to your personal watchlist
- Watchlist appears as a collapsible section at the top of the sidebar
- Persisted to `localStorage` — survives page refresh and browser restarts
- Managed via a custom `useWatchlist` hook keeping state logic fully separated

### 📈 Comparison Mode
- Toggle **Compare** in the chart toolbar to overlay a second coin
- Dual Y-axes (left = primary coin, right = compare coin) with independent scales
- Each coin rendered in its own colour — cyan vs amber — with a labelled legend
- Search-powered second coin picker; compare any two coins from the full catalogue

### 🎨 UI & UX
- Terminal-grade dark palette with cyan/green/amber accent system
- Shimmer skeleton loading states on every data-dependent surface
- Custom `ErrorBoundary` class component with reset capability
- Responsive layout with a mobile slide-in drawer for the sidebar
- Live ticking clock in the header (updates every second)
- Thin custom scrollbar, JetBrains Mono font for all data values

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 8 |
| Styling | Tailwind CSS 3 with custom design tokens |
| Charts | Recharts 3 (AreaChart, dual YAxis) |
| API | CoinGecko REST API (free demo tier) |
| State | React hooks — useState, useEffect, useCallback, useRef |
| Persistence | localStorage via custom useWatchlist hook |
| Deployment | Vercel (CI/CD ready) |

---

## Architecture

```
src/
├── api/
│   └── coingecko.js        — all API calls, shared fetch helper, 10s timeout, API key injection
├── components/
│   ├── Header.jsx           — brand bar + live ticking clock
│   ├── Sidebar.jsx          — search bar + watchlist section + top-10 list
│   ├── SearchBar.jsx        — debounced search input with results dropdown
│   ├── CompareSearch.jsx    — second coin picker for comparison mode
│   ├── CoinCard.jsx         — coin row with price, 24h change, star toggle
│   ├── StatsBar.jsx         — 6-metric horizontal stats strip
│   ├── PriceChart.jsx       — single-coin or dual Y-axis comparison chart
│   ├── TimeframeFilter.jsx  — pill-style 1D/7D/30D/90D/1Y toggle
│   └── ErrorBoundary.jsx    — class component catch-all with reset button
├── hooks/
│   └── useWatchlist.js      — localStorage-backed watchlist, isolated from UI
├── utils/
│   └── formatters.js        — pure functions: price, percent, compact numbers
└── App.jsx                  — central state, parallel API fetches, compare logic
```

**Key design decisions:**
- All API logic is isolated in `src/api/coingecko.js` — components never call `fetch` directly
- `useWatchlist` is a custom hook that owns all watchlist state and localStorage sync
- `Promise.allSettled` is used for parallel fetches so a failed details call never blocks the chart
- Cancellation tokens (`cancelled` flag) prevent stale state updates on rapid coin switching
- The comparison chart merges two independently-fetched time series by nearest-timestamp matching

---

## Running Locally

```bash
# Clone the repo
git clone https://github.com/kizz-code/Cryptex.git
cd Cryptex

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open **http://localhost:5173**

### Optional: CoinGecko API Key

The app works without a key but may hit rate limits (30 req/min) on heavy use. To use a key:

1. Get a free key at [coingecko.com/api](https://www.coingecko.com/en/api)
2. Create a `.env.local` file in the project root:

```
VITE_COINGECKO_API_KEY=your_key_here
```

The app automatically picks it up — no code changes needed.

---

## What I learned / demonstrated

- **API layer design** — centralised fetch helper with timeout, error normalisation, and optional auth header injection via `import.meta.env`
- **Custom hooks** — `useWatchlist` decouples persistence logic from rendering; easy to test independently
- **Recharts customisation** — dual Y-axes with independent domains, custom tooltips, SVG gradient fills, trend-adaptive colours
- **Debouncing** — both the search input (300ms) and coin selection (300ms) use `setTimeout`/`clearTimeout` to prevent request flooding
- **Race condition handling** — `cancelled` flags in `useEffect` cleanups prevent stale data from landing after a faster subsequent fetch
- **Responsive design** — Tailwind breakpoint classes + a mobile drawer pattern without any external UI library
- **Deployment pipeline** — Vercel CLI, environment variable management, and production build optimisation with Vite

---

## Live Demo

**[cryptex-plum.vercel.app](https://cryptex-plum.vercel.app)**
