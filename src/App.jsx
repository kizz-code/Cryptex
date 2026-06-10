/**
 * App.jsx — root component and single source of truth for dashboard state.
 *
 * State owned here:
 *   coins        — top-10 list from /coins/markets
 *   selectedCoin — the coin whose chart + stats we're showing
 *   coinDetails  — detailed data from /coins/{id}
 *   chartData    — price history from /coins/{id}/market_chart
 *   timeframe    — active days value (1 | 7 | 30 | 90 | 365)
 *   loading.*    — per-resource boolean flags
 *   error.*      — per-resource error messages
 *
 * Data flows:
 *   1. On mount   → fetchTopCoins()  → populate sidebar
 *   2. On coin select or timeframe change → fetchCoinDetails() + fetchMarketChart()
 *   3. Auto-refresh top coins every 60 seconds (free API rate limit friendly)
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { fetchTopCoins, fetchCoinDetails, fetchMarketChart } from "./api/coingecko";

import Header          from "./components/Header";
import Sidebar         from "./components/Sidebar";
import StatsBar        from "./components/StatsBar";
import PriceChart      from "./components/PriceChart";
import TimeframeFilter from "./components/TimeframeFilter";
import ErrorBoundary   from "./components/ErrorBoundary";
import { formatPercent, changeColor } from "./utils/formatters";

const REFRESH_INTERVAL = 60_000; // 60 s — stays within free-tier rate limits

export default function App() {
  // Sidebar
  const [coins,        setCoins]        = useState([]);
  const [coinsLoading, setCoinsLoading] = useState(true);
  const [coinsError,   setCoinsError]   = useState(null);

  // Selected coin detail / stats
  const [selectedCoin,   setSelectedCoin]   = useState(null);
  const [coinDetails,    setCoinDetails]    = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError,   setDetailsError]   = useState(null);

  // Chart
  const [chartData,    setChartData]    = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartError,   setChartError]   = useState(null);
  const [timeframe,    setTimeframe]    = useState(7);

  // Mobile sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── 1. Top coins ──────────────────────────────────────────────────────────
  const loadTopCoins = useCallback(async () => {
    try {
      setCoinsLoading(true);
      setCoinsError(null);
      const data = await fetchTopCoins(10);
      setCoins(data);
      if (!selectedCoin && data.length > 0) setSelectedCoin(data[0]);
    } catch (err) {
      setCoinsError(err.message);
    } finally {
      setCoinsLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadTopCoins();
    const id = setInterval(loadTopCoins, REFRESH_INTERVAL);
    return () => clearInterval(id);
  }, [loadTopCoins]);

  // ── 2. Coin detail + chart ────────────────────────────────────────────────
  useEffect(() => {
    if (!selectedCoin) return;
    let cancelled = false;

    async function loadCoinData() {
      setDetailsLoading(true);
      setChartLoading(true);
      setDetailsError(null);
      setChartError(null);

      const [detailsResult, chartResult] = await Promise.allSettled([
        fetchCoinDetails(selectedCoin.id),
        fetchMarketChart(selectedCoin.id, timeframe),
      ]);

      if (cancelled) return;

      if (detailsResult.status === "fulfilled") {
        setCoinDetails(detailsResult.value);
      } else {
        setDetailsError(detailsResult.reason.message);
        setCoinDetails(null);
      }
      setDetailsLoading(false);

      if (chartResult.status === "fulfilled") {
        setChartData(chartResult.value.prices ?? []);
      } else {
        setChartError(chartResult.reason.message);
        setChartData([]);
      }
      setChartLoading(false);
    }

    loadCoinData();
    return () => { cancelled = true; };
  }, [selectedCoin, timeframe]);

  const selectTimeoutRef = useRef(null);

  function handleSelectCoin(coin) {
    clearTimeout(selectTimeoutRef.current);
    setCoinDetails(null);
    setChartData([]);
    setSidebarOpen(false);
    selectTimeoutRef.current = setTimeout(() => {
      setSelectedCoin(coin);
    }, 300);
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-surface-950 text-gray-200">
      <Header selectedCoin={selectedCoin} />

      <div className="flex flex-1 min-h-0 relative">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`fixed lg:relative z-30 lg:z-auto h-full transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        >
          <Sidebar
            coins={coins}
            loading={coinsLoading}
            error={coinsError}
            selectedCoin={selectedCoin}
            onSelectCoin={handleSelectCoin}
          />
        </div>

        {/* Main panel */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <StatsBar details={coinDetails} loading={detailsLoading} error={detailsError} />

          {/* Chart toolbar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-surface-700 flex-shrink-0">
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-1.5 rounded hover:bg-surface-700 transition-colors"
                aria-label="Open coin list"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {selectedCoin ? (
                <div className="flex items-center gap-2 flex-wrap">
                  <img src={selectedCoin.image} alt="" className="w-5 h-5 rounded-full" />
                  <h1 className="font-semibold text-gray-100 text-sm">
                    {selectedCoin.name}
                    <span className="text-gray-500 font-mono text-xs ml-2 uppercase">
                      {selectedCoin.symbol}/USD
                    </span>
                  </h1>
                  {!detailsLoading && coinDetails && (
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-full bg-surface-700
                      ${changeColor(coinDetails.market_data?.price_change_percentage_24h)}`}>
                      {formatPercent(coinDetails.market_data?.price_change_percentage_24h)} 24h
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-gray-500 text-sm font-mono">Select a coin →</span>
              )}
            </div>

            <TimeframeFilter selected={timeframe} onChange={setTimeframe} />
          </div>

          {/* Chart area */}
          <ErrorBoundary>
            <div className="flex-1 min-h-0 p-2 sm:p-4">
              {selectedCoin ? (
                <PriceChart
                  chartData={chartData}
                  loading={chartLoading}
                  error={chartError}
                  days={timeframe}
                  coinName={selectedCoin?.name}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-3">
                  <div className="text-4xl opacity-20">◈</div>
                  <p className="text-gray-600 font-mono text-sm">
                    Select a coin from the sidebar to view its chart
                  </p>
                </div>
              )}
            </div>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
