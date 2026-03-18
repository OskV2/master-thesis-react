/**
 * SortingBarsCanvas — renders an array as vertical bars using react-konva (Canvas).
 *
 * Uses ResizeObserver to fill 100% of parent width (same as SVG version).
 *
 * Props:
 *   array       - number[] — values to display
 *   comparing   - number[] — indices currently being compared (highlighted)
 *   sorted      - number[] — indices in final sorted position (green)
 *   height      - number   — canvas height in px (default 300)
 */

import React, { useRef, useEffect } from "react";
import { Stage, Layer, Rect, Text, Circle } from "react-konva";
import { useContainerWidth } from "@/hooks/useContainerWidth";

const COLORS = {
  default: "#3b82f6",
  comparing: "#f59e0b",
  sorted: "#10b981",
  text: "#f1f5f9",
  background: "#1e293b",
};

const ANIM_DURATION = 0.25;

export default function SortingBarsCanvas({
  array = [],
  comparing = [],
  sorted = [],
  height = 300,
}) {
  const [containerRef, width] = useContainerWidth();

  const barRefs = useRef({});
  const textRefs = useRef({});
  const glowRefs = useRef({});
  const dotRefs = useRef({});

  const n = array.length;
  const maxVal = n > 0 ? Math.max(...array) : 1;

  const padding = 20;
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;
  const gap = 2;
  const barWidth = n > 0 ? (usableWidth - gap * (n - 1)) / n : 0;

  function getBarColor(index) {
    if (sorted.includes(index)) return COLORS.sorted;
    if (comparing.includes(index)) return COLORS.comparing;
    return COLORS.default;
  }

  // Animate bars when props change
  useEffect(() => {
    if (n === 0 || width === 0) return;

    array.forEach((value, index) => {
      const barHeight = (value / maxVal) * usableHeight;
      const x = padding + index * (barWidth + gap);
      const y = height - padding - barHeight;
      const color = getBarColor(index);
      const textY = barHeight > 24 ? y + 5 : y - 18;

      const bar = barRefs.current[index];
      if (bar) {
        bar.to({ x, y, height: barHeight, fill: color, duration: ANIM_DURATION });
      }

      const text = textRefs.current[index];
      if (text) {
        text.to({ x: x + barWidth / 2, y: textY, duration: ANIM_DURATION });
        text.text(String(value));
      }

      const glow = glowRefs.current[index];
      if (glow) {
        glow.to({
          x: x - 2,
          y: y - 2,
          height: barHeight + 4,
          opacity: comparing.includes(index) ? 0.8 : 0,
          duration: ANIM_DURATION,
        });
      }

      const dot = dotRefs.current[index];
      if (dot) {
        const isSorted = sorted.includes(index);
        dot.to({
          x: x + barWidth / 2,
          y: height - padding + 12,
          scaleX: isSorted ? 1 : 0,
          scaleY: isSorted ? 1 : 0,
          opacity: isSorted ? 1 : 0,
          duration: ANIM_DURATION,
        });
      }
    });
  }, [array, comparing, sorted, width]);

  // Early return AFTER all hooks
  if (n === 0 || width === 0) {
    return <div ref={containerRef} style={{ height }} />;
  }

  return (
    <div ref={containerRef} className="rounded-xl overflow-hidden border border-slate-700/50">
      <Stage width={width} height={height}>
        <Layer>
          <Rect x={0} y={0} width={width} height={height} fill={COLORS.background} />

          {array.map((value, index) => {
            const barHeight = (value / maxVal) * usableHeight;
            const x = padding + index * (barWidth + gap);
            const y = height - padding - barHeight;
            const color = getBarColor(index);
            const isComparing = comparing.includes(index);
            const isSorted = sorted.includes(index);
            const textY = barHeight > 24 ? y + 5 : y - 18;
            const fontSize = Math.min(barWidth * 0.5, 14);

            return (
              <React.Fragment key={index}>
                <Rect
                  ref={(node) => { glowRefs.current[index] = node; }}
                  x={x - 2}
                  y={y - 2}
                  width={barWidth + 4}
                  height={barHeight + 4}
                  cornerRadius={4}
                  stroke={COLORS.comparing}
                  strokeWidth={2}
                  opacity={isComparing ? 0.8 : 0}
                />
                <Rect
                  ref={(node) => { barRefs.current[index] = node; }}
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  cornerRadius={2}
                  fill={color}
                />
                <Circle
                  ref={(node) => { dotRefs.current[index] = node; }}
                  x={x + barWidth / 2}
                  y={height - padding + 12}
                  radius={4}
                  fill={COLORS.sorted}
                  scaleX={isSorted ? 1 : 0}
                  scaleY={isSorted ? 1 : 0}
                  opacity={isSorted ? 1 : 0}
                />
                <Text
                  ref={(node) => { textRefs.current[index] = node; }}
                  x={x + barWidth / 2}
                  y={textY}
                  text={String(value)}
                  fontSize={fontSize}
                  fontFamily="'JetBrains Mono', monospace"
                  fontStyle="600"
                  fill={COLORS.text}
                  align="center"
                  offsetX={barWidth * 0.25}
                />
              </React.Fragment>
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
}