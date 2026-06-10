/**
 * PriceChart — responsive line chart for historical price data.
 * Uses Recharts AreaChart with gradient fill, custom tooltip,
 * and skeleton placeholders while data loads.
 * The gradient colour adapts: green for uptrend, red for downtrend.
 */

import {
  AreaChart, Area,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatPrice, formatChartData, changeHex } from "../utils/formatters";

/** Skeleton bars while chart data loads */
function ChartSkeleton() {
  return (
    <div className="w-full h-full flex items-end gap-1 px-6 pb-8">
      {Array.from({ length: 24 }).map((_, i) => (
        <div
          key={i}
          className="flex-1 skeleton rounded-t opacity-40"
          style={{ height: `${25 + ((i * 37 + i * i * 3) % 55)}%` }}
        />
      ))}
    </div>
  );
}

/** Custom hover tooltip card */
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { label, price } = payload[0].payload;
  return (
    <div className="bg-surface-800 border border-surface-600 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-gray-400 font-mono mb-1">{label}</p>
      <p className="text-sm font-mono font-semibold text-accent-cyan">
        {formatPrice(price)}
      </p>
    </div>
  );
}

/** Format X-axis tick labels depending on selected timeframe */
function xTickFormatter(timestamp, days) {
  const d = new Date(timestamp);
  if (days <= 1)
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  if (days <= 30)
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

/** Return ~6 evenly-spaced tick timestamps from the data array */
function pickTicks(data) {
  if (data.length < 2) return data.map((d) => d.time);
  const n = Math.min(6, data.length);
  const step = Math.floor(data.length / (n - 1));
  const ticks = [];
  for (let i = 0; i < data.length; i += step) ticks.push(data[i].time);
  const last = data[data.length - 1].time;
  if (ticks[ticks.length - 1] !== last) ticks.push(last);
  return ticks;
}

export default function PriceChart({ chartData, loading, error, days }) {
  const formatted = formatChartData(chartData);

  // Determine trend direction to colour chart accordingly
  const trendUp =
    formatted.length >= 2
      ? formatted[formatted.length - 1].price >= formatted[0].price
      : true;
  const lineColor = trendUp ? "#00ff88" : "#ff4466";
  const gradientId = "priceGrad";

  // Y-axis domain with 8 % padding so the line never hugs the edges
  const prices = formatted.map((d) => d.price);
  const minP = Math.min(...prices);
  const maxP = Math.max(...prices);
  const pad = (maxP - minP) * 0.08 || maxP * 0.05;
  const yDomain = [minP - pad, maxP + pad];

  return (
    <div className="relative w-full h-full">
      {/* ── Loading skeleton ── */}
      {loading && (
        <div className="absolute inset-0">
          <ChartSkeleton />
        </div>
      )}

      {/* ── Error state ── */}
      {error && !loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-rose-400 font-mono text-sm">⚠ Chart data unavailable</p>
            <p className="text-gray-600 text-xs mt-1 font-mono">{error}</p>
          </div>
        </div>
      )}

      {/* ── Chart ── */}
      {!loading && !error && formatted.length > 0 && (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={formatted}
            margin={{ top: 16, right: 24, left: 0, bottom: 0 }}
          >
            {/* SVG gradient definition — written as JSX children */}
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={lineColor} stopOpacity={0.18} />
                <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#21262d" vertical={false} />

            <XAxis
              dataKey="time"
              ticks={pickTicks(formatted)}
              tickFormatter={(t) => xTickFormatter(t, days)}
              tick={{ fill: "#484f58", fontSize: 11, fontFamily: "JetBrains Mono, monospace" }}
              axisLine={false}
              tickLine={false}
              dy={8}
            />

            <YAxis
              domain={yDomain}
              tickFormatter={(v) => formatPrice(v)}
              tick={{ fill: "#484f58", fontSize: 11, fontFamily: "JetBrains Mono, monospace" }}
              axisLine={false}
              tickLine={false}
              width={90}
              tickCount={5}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#30363d", strokeWidth: 1, strokeDasharray: "4 4" }}
            />

            <Area
              type="monotone"
              dataKey="price"
              stroke={lineColor}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{ r: 4, fill: lineColor, stroke: "#080c10", strokeWidth: 2 }}
              isAnimationActive
              animationDuration={600}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
