/**
 * CompareSearch — coin picker for comparison mode.
 *
 * Appears in the chart toolbar when the user clicks "Compare".
 * Uses the same debounced CoinGecko /search endpoint as SearchBar
 * but renders as an inline input rather than a sidebar widget.
 *
 * Props:
 *   compareCoin     currently selected comparison coin (or null)
 *   onSelect        fn(coin) — called when user picks a result
 *   onClear         fn() — called when user removes the compare coin
 */

import { useState, useEffect, useRef } from "react";
import { searchCoins } from "../api/coingecko";

export default function CompareSearch({ compareCoin, onSelect, onClear }) {
  const [query,   setQuery]   = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open,    setOpen]    = useState(false);

  const debounceRef  = useRef(null);
  const containerRef = useRef(null);

  // ── Debounced search (same pattern as SearchBar) ──────────────────────────
  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!query.trim()) { setResults([]); setOpen(false); return; }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchCoins(query);
        setResults(data);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  // ── Close on click outside ────────────────────────────────────────────────
  useEffect(() => {
    function onOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target))
        setOpen(false);
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  // If a coin is already chosen, show its name with a remove button
  if (compareCoin) {
    return (
      <div className="flex items-center gap-2 bg-surface-800 border border-accent-amber/40 rounded-lg px-3 py-1.5">
        <img
          src={compareCoin.image}
          alt={compareCoin.name}
          className="w-4 h-4 rounded-full flex-shrink-0"
        />
        <span className="text-xs font-mono text-accent-amber truncate max-w-[80px]">
          {compareCoin.name}
        </span>
        <button
          onClick={onClear}
          aria-label="Remove comparison coin"
          className="text-gray-600 hover:text-gray-300 transition-colors ml-1"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Input */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          placeholder="Add coin to compare…"
          className="
            bg-surface-800 border border-accent-amber/40 rounded-lg
            pl-3 pr-7 py-1.5 text-xs font-mono text-gray-200 w-44
            placeholder-gray-600
            focus:outline-none focus:border-accent-amber focus:ring-1 focus:ring-accent-amber/30
            transition-colors duration-150
          "
        />
        {/* Loading spinner */}
        {loading && (
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2">
            <svg className="w-3 h-3 text-gray-500 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16 8 8 0 01-8-8z" />
            </svg>
          </span>
        )}
      </div>

      {/* Dropdown */}
      {open && results.length > 0 && (
        <div className="
          absolute left-0 top-full mt-1 z-50 w-56
          bg-surface-800 border border-surface-600 rounded-lg
          shadow-2xl overflow-hidden
        ">
          {results.map((coin) => (
            <button
              key={coin.id}
              onClick={() => { onSelect(coin); setQuery(""); setResults([]); setOpen(false); }}
              className="
                w-full flex items-center gap-3 px-3 py-2.5
                hover:bg-surface-700 transition-colors text-left
                border-b border-surface-700 last:border-b-0
              "
            >
              <img src={coin.image} alt={coin.name} className="w-5 h-5 rounded-full flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-200 truncate">{coin.name}</p>
                <p className="text-[10px] text-gray-500 uppercase font-mono">{coin.symbol}</p>
              </div>
              {coin.market_cap_rank && (
                <span className="text-[10px] font-mono text-gray-600">#{coin.market_cap_rank}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
