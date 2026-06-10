/**
 * Sidebar — lists top 10 coins fetched from CoinGecko.
 * Renders loading skeletons while data is in-flight,
 * and surfaces a lightweight error state if the fetch fails.
 */

import CoinCard from "./CoinCard";

/** Skeleton placeholder for a single coin row */
function CoinSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="w-8 h-8 rounded-full skeleton flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-24 rounded skeleton" />
        <div className="h-2 w-12 rounded skeleton" />
      </div>
      <div className="text-right space-y-2">
        <div className="h-3 w-16 rounded skeleton" />
        <div className="h-2 w-10 rounded skeleton" />
      </div>
    </div>
  );
}

export default function Sidebar({ coins, loading, error, selectedCoin, onSelectCoin }) {
  return (
    <aside className="flex flex-col bg-surface-900 border-r border-surface-700 w-72 flex-shrink-0">
      {/* Header */}
      <div className="px-4 py-4 border-b border-surface-700">
        <div className="flex items-center gap-2 mb-1">
          {/* Live pulse indicator */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-green" />
          </span>
          <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">
            Markets
          </span>
        </div>
        <h2 className="text-sm font-semibold text-gray-200">Top 10 by Market Cap</h2>
      </div>

      {/* Coin list */}
      <div className="flex-1 overflow-y-auto py-2 space-y-0.5 px-1">
        {loading &&
          Array.from({ length: 10 }).map((_, i) => <CoinSkeleton key={i} />)}

        {error && !loading && (
          <div className="px-4 py-6 text-center">
            <p className="text-xs text-rose-400 font-mono">⚠ Failed to load coins</p>
            <p className="text-xs text-gray-600 mt-1">{error}</p>
          </div>
        )}

        {!loading &&
          !error &&
          coins.map((coin, idx) => (
            <div key={coin.id} className="flex items-center gap-1">
              {/* Rank badge */}
              <span className="text-xs font-mono text-surface-500 w-5 text-right flex-shrink-0">
                {idx + 1}
              </span>
              <div className="flex-1">
                <CoinCard
                  coin={coin}
                  isSelected={selectedCoin?.id === coin.id}
                  onClick={() => onSelectCoin(coin)}
                />
              </div>
            </div>
          ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-surface-700">
        <p className="text-xs text-gray-600 font-mono">
          Data · CoinGecko API
        </p>
      </div>
    </aside>
  );
}
