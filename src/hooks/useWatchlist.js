/**
 * useWatchlist — manages the user's starred coin list.
 *
 * Persists a Set of coin IDs to localStorage under the key "cryptex:watchlist"
 * so selections survive page refreshes. Exposes helpers that keep the internal
 * representation in sync with both React state and the stored string.
 */

import { useState, useCallback } from "react";

const STORAGE_KEY = "cryptex:watchlist";

/** Load the saved set from localStorage (returns an empty Set if nothing stored) */
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw));
  } catch {
    return new Set();
  }
}

/** Flush the current Set back to localStorage */
function saveToStorage(set) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch {
    // Storage quota exceeded or private browsing — silently ignore
  }
}

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState(() => loadFromStorage());

  /** Toggle a coin in/out of the watchlist */
  const toggleWatch = useCallback((coinId) => {
    setWatchlist((prev) => {
      const next = new Set(prev);
      if (next.has(coinId)) {
        next.delete(coinId);
      } else {
        next.add(coinId);
      }
      saveToStorage(next);
      return next;
    });
  }, []);

  /** Returns true if the coin is currently starred */
  const isWatched = useCallback(
    (coinId) => watchlist.has(coinId),
    [watchlist]
  );

  /** Clear every entry (useful for a "clear all" button) */
  const clearWatchlist = useCallback(() => {
    setWatchlist(new Set());
    saveToStorage(new Set());
  }, []);

  return { watchlist, toggleWatch, isWatched, clearWatchlist };
}
