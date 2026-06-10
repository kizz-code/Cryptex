# ◈ Cryptex — Crypto Market Terminal

A real-time crypto dashboard built with React + Vite + Tailwind CSS + Recharts,
powered by the CoinGecko public API.

## Features

### Phase 1
- Top-10 coins by market cap in a live sidebar (auto-refreshes every 60 s)
- Price history chart with gradient fill and custom tooltip
- 1D / 7D / 30D / 90D / 1Y timeframe toggles
- 6-metric stats bar (price, market cap, 24h high/low, volume, Δ24h)
- Shimmer skeleton loading states
- Responsive layout with mobile drawer

### Phase 2
- **Search** — debounced coin search above the sidebar; select any coin from CoinGecko, not just the top 10
- **Watchlist** — star any coin; starred coins appear in a collapsible Watchlist section; persisted to localStorage via `useWatchlist` hook
- **Comparison mode** — overlay two coins on a dual Y-axis chart (cyan vs amber); toggled from the chart toolbar
- **Vercel deployment** — see `DEPLOYMENT.md` for step-by-step instructions

## Project structure

```
src/
├── api/coingecko.js          ← all API calls + shared fetch helper (10s timeout)
├── components/
│   ├── Header.jsx            ← brand bar + live ticking clock
│   ├── Sidebar.jsx           ← search bar + watchlist + top-10 list
│   ├── SearchBar.jsx         ← debounced search with dropdown results
│   ├── CompareSearch.jsx     ← second coin picker for comparison mode
│   ├── CoinCard.jsx          ← logo + name + price + 24h change + star toggle
│   ├── StatsBar.jsx          ← 6-metric strip for primary coin
│   ├── PriceChart.jsx        ← single-coin or dual-axis comparison chart
│   ├── TimeframeFilter.jsx   ← 1D / 7D / 30D / 90D / 1Y pill toggles
│   └── ErrorBoundary.jsx     ← class component catch-all with reset button
├── hooks/
│   └── useWatchlist.js       ← localStorage-backed starred coin list
├── utils/formatters.js       ← pure helpers: price, percent, compact numbers
└── App.jsx                   ← all state, parallel fetches, compare logic
```

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for Vercel CLI instructions.
