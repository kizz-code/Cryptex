/**
 * Header — top navigation bar.
 * Shows the app branding, selected coin name, and a live clock.
 */

import { useState, useEffect } from "react";

function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="text-xs font-mono text-gray-500 tabular-nums">
      {time.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZoneName: "short",
      })}
    </span>
  );
}

export default function Header({ selectedCoin }) {
  return (
    <header className="h-12 flex items-center justify-between px-5 bg-surface-950 border-b border-surface-700 flex-shrink-0 z-10">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <span className="text-accent-cyan font-mono font-bold text-sm tracking-tight">
          ◈ CRYPTEX
        </span>
        <span className="hidden sm:inline text-surface-600 text-xs font-mono">
          /
        </span>
        <span className="hidden sm:inline text-gray-500 text-xs font-mono">
          Market Terminal
        </span>
      </div>

      {/* Selected coin breadcrumb */}
      {selectedCoin && (
        <div className="flex items-center gap-2">
          <img
            src={selectedCoin.image}
            alt={selectedCoin.name}
            className="w-4 h-4 rounded-full"
          />
          <span className="text-sm font-mono text-gray-300">
            {selectedCoin.name}
          </span>
          <span className="text-xs font-mono text-gray-600 uppercase">
            / USD
          </span>
        </div>
      )}

      {/* Live clock */}
      <LiveClock />
    </header>
  );
}
