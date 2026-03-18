/**
 * SortingBarsSVG — renders an array as animated vertical bars using Motion + SVG.
 *
 * Motion animates:
 *   - bar position (x, y) — smooth movement when elements swap
 *   - bar color (fill) — transition between default/comparing/sorted
 *   - text position — follows bar
 *
 * Props:
 *   array       - number[] — values to display
 *   comparing   - number[] — indices currently being compared (highlighted)
 *   sorted      - number[] — indices in final sorted position (green)
 *   width       - number   — SVG width in px (default 600)
 *   height      - number   — SVG height in px (default 300)
 */

import { motion } from "motion/react";

const COLORS = {
  default: "#3b82f6",   // blue — normal bar
  comparing: "#f59e0b", // amber — being compared
  sorted: "#10b981",    // emerald — in final position
  text: "#f1f5f9",      // slate-100 — number on bar
};

// Transition config shared by all animated properties
const TRANSITION = {
  type: "tween",
  duration: 0.25,
  ease: "easeInOut",
};

export default function SortingBarsSVG({
  array = [],
  comparing = [],
  sorted = [],
  width = 600,
  height = 300,
}) {
  if (array.length === 0) return null;

  const n = array.length;
  const maxVal = Math.max(...array);

  // Layout calculations
  const padding = 20;
  const usableWidth = width - padding * 2;

  console.log(usableWidth)

  const usableHeight = height - padding * 2;
  const gap = 2;
  const barWidth = (usableWidth - gap * (n - 1)) / n;

  console.log(barWidth)

  // Determine bar color based on state
  function getBarColor(index) {
    if (sorted.includes(index)) return COLORS.sorted;
    if (comparing.includes(index)) return COLORS.comparing;
    return COLORS.default;
  }

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="rounded-xl bg-surface-light border border-slate-700/50"
    >
      {array.map((value, index) => {
        const barHeight = (value / maxVal) * usableHeight;
        const x = padding + index * (barWidth + gap);
        const y = height - padding - barHeight;
        const color = getBarColor(index);
        const isComparing = comparing.includes(index);
        const isSorted = sorted.includes(index);
        const textY = barHeight > 24 ? y + 18 : y - 6;

        return (
          <g key={index}>
            {/* Animated bar */}
            <motion.rect
              x={x}
              width={barWidth}
              rx={2}
              animate={{
                y,
                height: barHeight,
                fill: color,
              }}
              transition={TRANSITION}
            />

            {/* Glow effect when comparing */}
            {isComparing && (
              <motion.rect
                x={x - 2}
                width={barWidth + 4}
                rx={4}
                fill="none"
                stroke={COLORS.comparing}
                strokeWidth={2}
                animate={{
                  y: y - 2,
                  height: barHeight + 4,
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  y: TRANSITION,
                  height: TRANSITION,
                  opacity: { duration: 0.6, repeat: Infinity },
                }}
              />
            )}

            {/* Dot indicator when sorted */}
            {isSorted && (
              <motion.circle
                cx={x + barWidth / 2}
                r={4}
                fill={COLORS.sorted}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  cy: height - padding + 12,
                  opacity: 1,
                  scale: 1,
                }}
                transition={TRANSITION}
              />
            )}

            {/* Animated value label */}
            <motion.text
              x={x + barWidth / 2}
              textAnchor="middle"
              fontSize={Math.min(barWidth * 0.5, 14)}
              fontFamily="'JetBrains Mono', monospace"
              fontWeight="600"
              fill={COLORS.text}
              animate={{ y: textY }}
              transition={TRANSITION}
            >
              {value}
            </motion.text>
          </g>
        );
      })}
    </svg>
  );
}