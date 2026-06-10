/**
 * CoinGecko REST API wrapper
 * Base URL requires no API key for free tier (rate-limited to ~30 req/min).
 * All functions return plain data objects; callers handle loading/error state.
 */

const BASE = "https://api.coingecko.com/api/v3";

/** Shared fetch helper with timeout + error normalisation */
async function cgFetch(path) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);
  try {
    const headers = {};
    if (import.meta.env.VITE_COINGECKO_API_KEY) {
      headers['x-cg-demo-api-key'] = import.meta.env.VITE_COINGECKO_API_KEY;
    }
    const res = await fetch(`${BASE}${path}`, {
      signal: controller.signal,
      headers,
    });
    if (!res.ok) throw new Error(`CoinGecko ${res.status}: ${res.statusText}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Fetch top N coins ranked by market cap.
 * @param {number} perPage  How many coins (default 10)
 * @returns {Promise<Array>}
 */
export async function fetchTopCoins(perPage = 10) {
  return cgFetch(
    `/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=true&price_change_percentage=24h`
  );
}

/**
 * Fetch detailed stats for a single coin (price, market cap, high/low, volume…).
 * @param {string} coinId  e.g. "bitcoin"
 * @returns {Promise<Object>}
 */
export async function fetchCoinDetails(coinId) {
  return cgFetch(
    `/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false`
  );
}

/**
 * Fetch OHLC-style market chart data for a coin.
 * CoinGecko auto-selects granularity:
 *   days=1  → 5-min intervals  |  days≤90 → hourly  |  days>90 → daily
 *
 * @param {string} coinId
 * @param {number} days   1 | 7 | 30 | 90 | 365
 * @returns {Promise<{prices: [timestamp, price][]}>}
 */
export async function fetchMarketChart(coinId, days = 7) {
  return cgFetch(
    `/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
  );
}
