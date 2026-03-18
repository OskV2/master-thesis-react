/**
 * BubbleSortView — bubble sort visualization connected to Zustand store.
 *
 * Responsibilities:
 *   - ArrayInput → generates steps via bubbleSortSteps → loads into store
 *   - Reads current step from store → passes to SortingBarsSVG
 *   - Playback controls read/write store (play, pause, step, speed)
 *   - useEffect drives auto-play tick
 */

import { useEffect, useMemo } from "react";
import { bubbleSortSteps } from "@/lib/algorithms/bubbleSort";
import { useVisualizationStore } from "@/stores/visualizationStore";
import SortingBarsSVG from "@/components/algorithms/SortingBarsSVG";
import ArrayInput from "@/components/ui/ArrayInput";

const DEFAULT_ARRAY = [38, 12, 45, 7, 23, 56, 31, 18, 42, 9];

export default function BubbleSortView() {
  // ── Store ──
  const {
    steps,
    currentStep,
    totalSteps,
    isPlaying,
    speed,
    loadAlgorithm,
    stepForward,
    stepBackward,
    togglePlay,
    reset,
    setSpeed,
  } = useVisualizationStore();

  // ── Load default array on mount ──
  useEffect(() => {
    const generated = bubbleSortSteps(DEFAULT_ARRAY);
    loadAlgorithm(DEFAULT_ARRAY, generated);
  }, []);

  // ── Auto-play tick ──
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      stepForward();
    }, speed);

    return () => clearInterval(timer);
  }, [isPlaying, speed, stepForward]);

  // ── Handlers ──
  const handleNewArray = (arr) => {
    const generated = bubbleSortSteps(arr);
    loadAlgorithm(arr, generated);
  };

  // ── Current step data ──
  const step = steps[currentStep];

  // Before steps are loaded, show nothing
  if (!step) return null;

  return (
    <div>
      {/* Input użytkownika */}
      <ArrayInput onSubmit={handleNewArray} />

      {/* Wizualizacja SVG */}
      <div className="mt-4">
        <SortingBarsSVG
          array={step.array}
          comparing={step.comparing}
          sorted={Array.isArray(step.sorted) ? step.sorted : [...step.sorted]}
          width={900}
          height={300}
        />
      </div>

      {/* Opis kroku */}
      <p className="mt-3 text-sm text-slate-400 font-display min-h-[40px]">
        {step.description}
      </p>

      {/* Kontrolki */}
      <div className="mt-3 flex items-center gap-3 flex-wrap">
        <button
          onClick={reset}
          disabled={currentStep === 0}
          className="px-3 py-1.5 rounded-lg text-sm bg-surface-lighter text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Reset
        </button>

        <button
          onClick={stepBackward}
          disabled={currentStep === 0 || isPlaying}
          className="px-3 py-1.5 rounded-lg text-sm bg-surface-lighter text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Poprzedni
        </button>

        <button
          onClick={togglePlay}
          disabled={currentStep >= totalSteps - 1 && !isPlaying}
          className="px-4 py-1.5 rounded-lg text-sm bg-primary-600 text-white hover:bg-primary-500 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {isPlaying ? "⏸ Pauza" : "▶ Play"}
        </button>

        <button
          onClick={stepForward}
          disabled={currentStep >= totalSteps - 1 || isPlaying}
          className="px-3 py-1.5 rounded-lg text-sm bg-surface-lighter text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Następny →
        </button>

        <span className="text-xs text-slate-500 font-display">
          {currentStep + 1} / {totalSteps}
        </span>

        {/* Speed selector */}
        <div className="flex items-center gap-1 ml-auto">
          <span className="text-xs text-slate-500">Prędkość:</span>
          {[1000, 500, 200, 50].map((ms) => (
            <button
              key={ms}
              onClick={() => setSpeed(ms)}
              className={`px-2 py-1 rounded text-xs font-display ${
                speed === ms
                  ? "bg-primary-600/20 text-primary-400 border border-primary-500/30"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {ms >= 1000 ? `${ms / 1000}s` : `${ms}ms`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}