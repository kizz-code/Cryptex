/**
 * Formatting utilities used across the dashboard.
 * Keeping these pure functions in one file makes them easy to test
 * and import anywhere without introducing component coupling.
 */

/** Format a USD price with appropriate decimal places */
export function formatPrice(value) {
  if (value == null) return "—";
  if (value >= 1)
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  // For sub-dollar coins keep up to 6 significant digits
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumSignificantDigits: 3,
    maximumSignificantDigits: 6,
  }).format(value);
}

/** Compact-format large numbers: 1 234 567 → "$1.23M" */
export function formatLargeNumber(value) {
  if (value == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

/** Format percent change with sign: -2.34 → "−2.34%" */
export function formatPercent(value) {
  if (value == null) return "—";
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

/**
 * Convert a raw [timestamp, price] array from CoinGecko into
 * objects Recharts can consume.
 */
export function formatChartData(prices = []) {
  return prices.map(([ts, price]) => ({
    time: ts,
    price: parseFloat(price.toFixed(6)),
    // Human-readable label for the X-axis tooltip
    label: new Date(ts).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
  }));
}

/** Determine Tailwind colour class based on sign of a number */
export function changeColor(value) {
  if (value == null) return "text-gray-400";
  return value >= 0 ? "text-emerald-400" : "text-rose-400";
}

/** Same but returns a hex string (for Recharts stroke colour) */
export function changeHex(value) {
  return value >= 0 ? "#00ff88" : "#ff4466";
}
