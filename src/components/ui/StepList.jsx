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
  // Quicksort
  pivot: "bg-purple-500",
  partition: "bg-indigo-500",
  // Merge sort
  split: "bg-cyan-500",
  "merge-start": "bg-blue-500",
  merge: "bg-blue-400",
  merged: "bg-teal-500",
  // KMP
  "lps-start": "bg-slate-500",
  "lps-compare": "bg-amber-500",
  "lps-match": "bg-emerald-500",
  "lps-fallback": "bg-orange-500",
  "lps-set": "bg-slate-400",
  "lps-done": "bg-emerald-400",
  "search-start": "bg-slate-500",
  "search-compare": "bg-amber-500",
  "search-match": "bg-emerald-500",
  "search-mismatch": "bg-red-500",
  "search-found": "bg-emerald-400",
  "search-done": "bg-emerald-400",
  // BST
  "insert-compare": "bg-amber-500",
  "insert-place": "bg-emerald-500",
  "search-not-found": "bg-red-400",
  "delete-find": "bg-amber-500",
  "delete-case": "bg-orange-500",
  "delete-done": "bg-emerald-400",
  "traverse-visit": "bg-indigo-500",
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
  // Quicksort
  pivot: "Pivot",
  partition: "Partycja",
  // Merge sort
  split: "Podział",
  "merge-start": "Scalanie",
  merge: "Scalanie",
  merged: "Scalono",
  // KMP
  "lps-start": "Start LPS",
  "lps-compare": "LPS porówn.",
  "lps-match": "LPS zgodność",
  "lps-fallback": "LPS cofnięcie",
  "lps-set": "LPS ustaw",
  "lps-done": "LPS gotowa",
  "search-start": "Start szuk.",
  "search-compare": "Porównanie",
  "search-match": "Zgodność",
  "search-mismatch": "Niezgodność",
  "search-found": "Znaleziono!",
  "search-done": "Koniec szuk.",
  // BST
  "insert-compare": "Porównanie",
  "insert-place": "Wstawiono",
  "search-not-found": "Nie znaleziono",
  "delete-find": "Szukanie",
  "delete-case": "Usuwanie",
  "delete-done": "Usunięto",
  "traverse-visit": "Odwiedzono",
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
        block: "center",
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