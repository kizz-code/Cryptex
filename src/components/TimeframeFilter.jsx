/**
 * TimeframeFilter — pill-style toggle buttons for chart time range.
 * Emits the selected `days` value (1 | 7 | 30 | 90 | 365) upward
 * so the parent can re-fetch market chart data.
 */

const FRAMES = [
  { label: "1D",  days: 1   },
  { label: "7D",  days: 7   },
  { label: "30D", days: 30  },
  { label: "90D", days: 90  },
  { label: "1Y",  days: 365 },
];

export default function TimeframeFilter({ selected, onChange }) {
  return (
    <div
      className="flex items-center gap-1 bg-surface-800 border border-surface-600 rounded-lg p-1"
      role="group"
      aria-label="Chart timeframe"
    >
      {FRAMES.map(({ label, days }) => {
        const isActive = selected === days;
        return (
          <button
            key={days}
            onClick={() => onChange(days)}
            aria-pressed={isActive}
            className={`
              px-3 py-1.5 rounded-md text-xs font-mono font-medium
              transition-all duration-150 focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-accent-cyan
              ${isActive
                ? "bg-accent-cyan text-surface-950 shadow-sm"
                : "text-gray-500 hover:text-gray-200 hover:bg-surface-700"
              }
            `}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
