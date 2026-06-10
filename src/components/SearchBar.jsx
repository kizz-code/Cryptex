/**
 * SearchBar — debounced coin search with a results dropdown.
 *
 * Queries CoinGecko /search after the user pauses typing (300 ms debounce).
 * Each result shows the coin thumbnail, name, symbol, and market-cap rank.
 * Clicking a result fires onSelectCoin so the parent can load that coin's
 * chart + stats even if it's not in the top-10 sidebar list.
 *
 * Closes on: Escape key, click outside, or selecting a result.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { searchCoins } from "../api/coingecko";

/** Small loading spinner shown while the search request is in-flight */
function Spinner() {
  return (
    <svg
      className="w-3.5 h-3.5 text-gray-500 animate-spin"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12" cy="12" r="10"
        stroke="currentColor" strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16 8 8 0 01-8-8z"
      />
    </svg>
  );
}

export default function SearchBar({ onSelectCoin }) {
  const [query,    setQuery]    = useState("");
  const [results,  setResults]  = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [open,     setOpen]     = useState(false);
  const [error,    setError]    = useState(null);

  const containerRef = useRef(null);
  const debounceRef  = useRef(null);

  // ── Debounced search ───────────────────────────────────────────────────────
  useEffect(() => {
    clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      setError(null);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await searchCoins(query);
        setResults(data);
        setOpen(true);
      } catch (err) {
        setError(err.message);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  // ── Close on click outside ─────────────────────────────────────────────────
  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ── Keyboard: Escape closes the dropdown ─────────────────────────────────
  function handleKeyDown(e) {
    if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
    }
  }

  const handleSelect = useCallback(
    (coin) => {
      onSelectCoin(coin);
      setQuery("");
      setResults([]);
      setOpen(false);
    },
    [onSelectCoin]
  );

  return (
    <div ref={containerRef} className="relative px-3 pt-3 pb-2">
      {/* Input field */}
      <div className="relative">
        {/* Search icon */}
        <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {loading ? (
            <Spinner />
          ) : (
            <svg
              className="w-3.5 h-3.5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
              />
            </svg>
          )}
        </span>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search coins…"
          className="
            w-full bg-surface-800 border border-surface-600 rounded-lg
            pl-8 pr-3 py-2 text-xs font-mono text-gray-200
            placeholder-gray-600
            focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/30
            transition-colors duration-150
          "
        />

        {/* Clear button */}
        {query && (
          <button
            onClick={() => { setQuery(""); setResults([]); setOpen(false); }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
            aria-label="Clear search"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown results */}
      {open && (
        <div className="
          absolute left-3 right-3 top-full mt-1 z-50
          bg-surface-800 border border-surface-600 rounded-lg
          shadow-2xl overflow-hidden
        ">
          {error && (
            <p className="px-3 py-2.5 text-xs text-rose-400 font-mono">
              ⚠ Search failed
            </p>
          )}

          {!error && results.length === 0 && !loading && query.trim() && (
            <p className="px-3 py-2.5 text-xs text-gray-600 font-mono">
              No results for "{query}"
            </p>
          )}

          {results.map((coin) => (
            <button
              key={coin.id}
              onClick={() => handleSelect(coin)}
              className="
                w-full flex items-center gap-3 px-3 py-2.5
                hover:bg-surface-700 transition-colors text-left
                border-b border-surface-700 last:border-b-0
              "
            >
              {/* Coin thumbnail */}
              <img
                src={coin.image}
                alt={coin.name}
                className="w-6 h-6 rounded-full flex-shrink-0"
                loading="lazy"
              />

              {/* Name + symbol */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-200 truncate">
                  {coin.name}
                </p>
                <p className="text-[10px] text-gray-500 uppercase font-mono">
                  {coin.symbol}
                </p>
              </div>

              {/* Market cap rank badge */}
              {coin.market_cap_rank && (
                <span className="text-[10px] font-mono text-gray-600 flex-shrink-0">
                  #{coin.market_cap_rank}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
