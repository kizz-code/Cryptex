/**
 * CoinCard — one row in the sidebar coin list.
 * Shows logo, name/ticker, current price, and 24 h % change.
 * Highlighted when it matches the currently selected coin.
 */

import { formatPrice, formatPercent, changeColor } from "../utils/formatters";

export default function CoinCard({ coin, isSelected, onClick }) {
  const pctChange = coin.price_change_percentage_24h;

  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-4 py-3 rounded-lg
        transition-all duration-150 text-left group
        ${isSelected
          ? "bg-surface-700 border border-[#00d4ff33] glow-cyan"
          : "hover:bg-surface-800 border border-transparent"
        }
      `}
    >
      {/* Coin logo */}
      <img
        src={coin.image}
        alt={coin.name}
        className="w-8 h-8 rounded-full flex-shrink-0"
        loading="lazy"
      />

      {/* Name + symbol */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isSelected ? "text-white" : "text-gray-200"}`}>
          {coin.name}
        </p>
        <p className="text-xs text-gray-500 uppercase font-mono">
          {coin.symbol}
        </p>
      </div>

      {/* Price + 24 h change */}
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-mono font-medium text-gray-100">
          {formatPrice(coin.current_price)}
        </p>
        <p className={`text-xs font-mono ${changeColor(pctChange)}`}>
          {formatPercent(pctChange)}
        </p>
      </div>
    </button>
  );
}
