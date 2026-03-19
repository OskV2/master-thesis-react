/**
 * KmpVisualizationSVG — renders KMP pattern search state.
 *
 * Two rows of character boxes:
 *   1. Text row — full text with highlights
 *   2. Pattern row — aligned under text at current offset
 *
 * Plus LPS table below.
 *
 * Props:
 *   step — current KMP step object from kmpSearchSteps()
 *   width/height — SVG dimensions
 */

import { motion } from "motion/react";

const COLORS = {
  default: "#334155",       // slate-700 — normal char bg
  textChar: "#f1f5f9",      // slate-100
  comparing: "#f59e0b",     // amber — current comparison
  match: "#10b981",         // emerald — matched char
  mismatch: "#ef4444",      // red
  found: "#10b981",         // emerald — full pattern match
  patternBg: "#1e3a5f",     // dark blue — pattern char bg
  lpsBg: "#1e293b",         // surface-light
};

const TRANSITION = { type: "tween", duration: 0.2, ease: "easeInOut" };

const CELL_SIZE = 32;
const CELL_GAP = 2;
const FONT_SIZE = 13;

export default function KmpVisualizationSVG({ step, height = 350 }) {
  if (!step) return null;

  // Determine which phase we're in
  const isLpsPhase = step.type.startsWith("lps");
  const isSearchPhase = step.type.startsWith("search");

  const text = step.text ?? "";
  const pattern = step.pattern ?? "";
  const lps = step.lps ?? [];

  const totalChars = Math.max(text.length, pattern.length, 1);
  const width = Math.max(totalChars * (CELL_SIZE + CELL_GAP) + 60, 400);

  // ── LPS Phase rendering ──
  if (isLpsPhase) {
    return (
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="rounded-xl bg-surface-light border border-slate-700/50"
      >
        {/* Title */}
        <text x={20} y={30} fill={COLORS.textChar} fontSize={14} fontFamily="'JetBrains Mono', monospace" fontWeight="600">
          Budowanie tablicy LPS
        </text>

        {/* Pattern characters */}
        {pattern.split("").map((char, i) => {
          const x = 20 + i * (CELL_SIZE + CELL_GAP);
          const isActive = step.i === i;
          const isLen = step.len === i;
          let bg = COLORS.default;
          if (isActive && isLen) bg = COLORS.found;
          else if (isActive) bg = COLORS.comparing;
          else if (isLen) bg = COLORS.patternBg;

          return (
            <g key={`pat-${i}`}>
              <motion.rect
                x={x} y={50} width={CELL_SIZE} height={CELL_SIZE} rx={4}
                animate={{ fill: bg }} transition={TRANSITION}
              />
              <text x={x + CELL_SIZE / 2} y={50 + CELL_SIZE / 2 + 5} textAnchor="middle"
                fontSize={FONT_SIZE} fontFamily="'JetBrains Mono', monospace" fontWeight="600" fill={COLORS.textChar}>
                {char}
              </text>
              {/* Index */}
              <text x={x + CELL_SIZE / 2} y={48} textAnchor="middle"
                fontSize={9} fontFamily="'JetBrains Mono', monospace" fill="#64748b">
                {i}
              </text>
            </g>
          );
        })}

        {/* LPS values */}
        <text x={20} y={115} fill="#64748b" fontSize={11} fontFamily="'JetBrains Mono', monospace">
          LPS:
        </text>
        {lps.map((val, i) => {
          const x = 20 + i * (CELL_SIZE + CELL_GAP);
          return (
            <g key={`lps-${i}`}>
              <rect x={x} y={125} width={CELL_SIZE} height={24} rx={3} fill={COLORS.lpsBg} stroke="#475569" strokeWidth={1} />
              <text x={x + CELL_SIZE / 2} y={141} textAnchor="middle"
                fontSize={11} fontFamily="'JetBrains Mono', monospace" fontWeight="600" fill="#94a3b8">
                {val}
              </text>
            </g>
          );
        })}
      </svg>
    );
  }

  // ── Search Phase rendering ──
  const textIndex = step.textIndex ?? 0;
  const patternIndex = step.patternIndex ?? 0;
  const matches = step.matches ?? [];
  const patternOffset = textIndex - patternIndex;

  // Determine text char colors
  function getTextCharColor(i) {
    // Part of a found match
    for (const mStart of matches) {
      if (i >= mStart && i < mStart + pattern.length) return COLORS.found;
    }
    if (i === textIndex) return COLORS.comparing;
    return COLORS.default;
  }

  function getPatternCharColor(j) {
    if (j === patternIndex && step.type === "search-compare") return COLORS.comparing;
    if (j === patternIndex && step.type === "search-match") return COLORS.match;
    if (j < patternIndex) return "#1a4a2e"; // dark green — already matched portion
    return COLORS.patternBg;
  }

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="rounded-xl bg-surface-light border border-slate-700/50"
    >
      {/* Title */}
      <text x={20} y={30} fill={COLORS.textChar} fontSize={14} fontFamily="'JetBrains Mono', monospace" fontWeight="600">
        Wyszukiwanie wzorca
      </text>

      {/* Text row */}
      <text x={20} y={52} fill="#64748b" fontSize={10} fontFamily="'JetBrains Mono', monospace">
        Tekst:
      </text>
      {text.split("").map((char, i) => {
        const x = 20 + i * (CELL_SIZE + CELL_GAP);
        return (
          <g key={`text-${i}`}>
            <motion.rect
              x={x} y={58} width={CELL_SIZE} height={CELL_SIZE} rx={4}
              animate={{ fill: getTextCharColor(i) }} transition={TRANSITION}
            />
            <text x={x + CELL_SIZE / 2} y={58 + CELL_SIZE / 2 + 5} textAnchor="middle"
              fontSize={FONT_SIZE} fontFamily="'JetBrains Mono', monospace" fontWeight="600" fill={COLORS.textChar}>
              {char}
            </text>
            <text x={x + CELL_SIZE / 2} y={56} textAnchor="middle"
              fontSize={9} fontFamily="'JetBrains Mono', monospace" fill="#64748b">
              {i}
            </text>
          </g>
        );
      })}

      {/* Pattern row — offset under text */}
      <text x={20} y={115} fill="#64748b" fontSize={10} fontFamily="'JetBrains Mono', monospace">
        Wzorzec:
      </text>
      {pattern.split("").map((char, j) => {
        const x = 20 + (patternOffset + j) * (CELL_SIZE + CELL_GAP);
        if (x < 0) return null;
        return (
          <g key={`pat-${j}`}>
            <motion.rect
              x={x} y={120} width={CELL_SIZE} height={CELL_SIZE} rx={4}
              animate={{ fill: getPatternCharColor(j) }} transition={TRANSITION}
            />
            <text x={x + CELL_SIZE / 2} y={120 + CELL_SIZE / 2 + 5} textAnchor="middle"
              fontSize={FONT_SIZE} fontFamily="'JetBrains Mono', monospace" fontWeight="600" fill={COLORS.textChar}>
              {char}
            </text>
          </g>
        );
      })}

      {/* LPS table at bottom */}
      <text x={20} y={185} fill="#64748b" fontSize={11} fontFamily="'JetBrains Mono', monospace">
        LPS: [{lps.join(", ")}]
      </text>

      {/* Matches found */}
      {matches.length > 0 && (
        <text x={20} y={210} fill={COLORS.found} fontSize={12} fontFamily="'JetBrains Mono', monospace" fontWeight="600">
          Znaleziono na pozycjach: [{matches.join(", ")}]
        </text>
      )}
    </svg>
  );
}