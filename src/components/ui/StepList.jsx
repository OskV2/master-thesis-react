/**
 * StepList — scrollable list of algorithm steps displayed alongside visualization.
 *
 * Props:
 *   steps        - array of step objects (each must have .type and .description)
 *   currentStep  - index of the active step
 *   onStepClick  - callback(stepIndex) when user clicks a step
 *   height       - height in px, should match the SVG visualization height
 */

import { useEffect, useRef } from "react";

// Step type → badge color mapping
const TYPE_COLORS = {
  start: "bg-slate-500",
  compare: "bg-amber-500",
  swap: "bg-red-500",
  sorted: "bg-emerald-500",
  done: "bg-emerald-400",
};

function getBadgeColor(type) {
  return TYPE_COLORS[type] ?? "bg-slate-500";
}

// Step type → Polish label
const TYPE_LABELS = {
  start: "Start",
  compare: "Porównanie",
  swap: "Zamiana",
  sorted: "Posortowany",
  done: "Koniec",
};

function getBadgeLabel(type) {
  return TYPE_LABELS[type] ?? type;
}

export default function StepList({
  steps = [],
  currentStep = 0,
  onStepClick,
  height = 300,
}) {
  const listRef = useRef(null);
  const activeRef = useRef(null);

  // Auto-scroll to keep active step visible
  useEffect(() => {
    if (activeRef.current && listRef.current) {
      activeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [currentStep]);

  return (
    <div
      ref={listRef}
      className="overflow-y-auto rounded-xl bg-surface-light border border-slate-700/50 p-2"
      style={{ height }}
    >
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isPast = index < currentStep;

        return (
          <button
            key={index}
            ref={isActive ? activeRef : null}
            onClick={() => onStepClick?.(index)}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-start gap-2 ${
              isActive
                ? "bg-primary-600/20 border border-primary-500/30"
                : isPast
                  ? "opacity-50 hover:opacity-80 hover:bg-surface-lighter/30"
                  : "hover:bg-surface-lighter/30"
            }`}
          >
            {/* Step number */}
            <span className="text-slate-600 font-display w-5 shrink-0 text-right">
              {index + 1}
            </span>

            {/* Type badge */}
            <span
              className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold text-white shrink-0 ${getBadgeColor(step.type)}`}
            >
              {getBadgeLabel(step.type)}
            </span>

            {/* Description */}
            <span
              className={`leading-relaxed ${
                isActive ? "text-slate-200" : "text-slate-400"
              }`}
            >
              {step.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}