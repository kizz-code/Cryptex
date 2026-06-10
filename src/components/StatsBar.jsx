/**
 * StatsBar — horizontal strip of key metrics for the selected coin.
 * Metrics: current price, market cap, 24 h high/low, total volume.
 * Each stat includes a label and a skeleton variant for loading state.
 */

import {
  formatPrice,
  formatLargeNumber,
  formatPercent,
  changeColor,
} from "../utils/formatters";

/** One metric tile */
function StatTile({ label, value, valueClass = "text-gray-100", loading }) {
  return (
    <div className="flex flex-col gap-1 px-4 py-3 border-r border-surface-700 last:border-r-0">
      <span className="text-xs font-mono text-gray-500 uppercase tracking-wider whitespace-nowrap">
        {label}
      </span>
      {loading ? (
        <div className="h-5 w-28 rounded skeleton" />
      ) : (
        <span className={`text-sm font-mono font-semibold ${valueClass}`}>
          {value}
        </span>
      )}
    </div>
  );
}

export default function StatsBar({ details, loading, error }) {
  // Extract data from the CoinGecko /coins/{id} response shape
  const market = details?.market_data ?? {};

  const stats = [
    {
      label: "Price (USD)",
      value: formatPrice(market.current_price?.usd),
      valueClass: "text-accent-cyan text-glow-cyan",
    },
    {
      label: "Market Cap",
      value: formatLargeNumber(market.market_cap?.usd),
    },
    {
      label: "24h High",
      value: formatPrice(market.high_24h?.usd),
      valueClass: "text-emerald-400",
    },
    {
      label: "24h Low",
      value: formatPrice(market.low_24h?.usd),
      valueClass: "text-rose-400",
    },
    {
      label: "Volume (24h)",
      value: formatLargeNumber(market.total_volume?.usd),
    },
    {
      label: "24h Change",
      value: formatPercent(market.price_change_percentage_24h),
      valueClass: changeColor(market.price_change_percentage_24h),
    },
  ];

  return (
    <div className="bg-surface-900 border-b border-surface-700 flex items-stretch overflow-x-auto">
      {error && !loading ? (
        <p className="px-4 py-3 text-xs text-rose-400 font-mono">
          ⚠ Stats unavailable
        </p>
      ) : (
        stats.map((s) => (
          <StatTile
            key={s.label}
            label={s.label}
            value={s.value}
            valueClass={s.valueClass}
            loading={loading}
          />
        ))
      )}
    </div>
  );
}
