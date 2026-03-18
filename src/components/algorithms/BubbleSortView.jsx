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
import SortingBarsCanvas from "@/components/algorithms/SortingBarsCanvas";
import ArrayInput from "@/components/ui/ArrayInput";
import StepList from "@/components/ui/StepList";

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
    goToStep,
    renderMode,
    setRenderMode,
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

      {/* Wizualizacja + lista kroków */}
      <div className="mt-3 flex flex-col lg:flex-row gap-3">
        {/* Lista kroków — full width on mobile, 30% on desktop */}
        <div className="w-full lg:w-[30%] shrink-0 order-2 lg:order-1">
          <StepList
            steps={steps}
            currentStep={currentStep}
            onStepClick={goToStep}
            height={450}
          />
        </div>

        {/* Visualization — full width on mobile, 70% on desktop */}
        <div className="flex-1 min-w-0 order-1 lg:order-2">
          {renderMode === "svg" ? (
            <SortingBarsSVG
              array={step.array}
              comparing={step.comparing}
              sorted={Array.isArray(step.sorted) ? step.sorted : [...step.sorted]}
              height={450}
            />
          ) : (
            <SortingBarsCanvas
              array={step.array}
              comparing={step.comparing}
              sorted={Array.isArray(step.sorted) ? step.sorted : [...step.sorted]}
              height={450}
            />
          )}
        </div>
      </div>
    </div>
  );
}