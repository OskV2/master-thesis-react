/**
 * SortingAlgorithmView — shared wrapper for sorting visualizations.
 *
 * Extracted from BubbleSortView. Handles:
 *   - ArrayInput → generates steps via provided function → loads into store
 *   - Reads current step from store → passes to SortingBarsSVG / Canvas
 *   - Auto-play tick (useEffect with setInterval)
 *   - StepList alongside visualization
 *
 * Does NOT include PlaybackControls — those live in AlgorithmPage.
 *
 * Props:
 *   generateSteps(array: number[]) => steps[]
 *   defaultArray? — optional, defaults to [38, 12, 45, 7, 23, 56, 31, 18, 42, 9]
 */

import { useEffect } from "react";
import { useVisualizationStore } from "@/stores/visualizationStore";
import SortingBarsSVG from "@/components/algorithms/SortingBarsSVG";
import SortingBarsCanvas from "@/components/algorithms/SortingBarsCanvas";
import ArrayInput from "@/components/ui/ArrayInput";
import StepList from "@/components/ui/StepList";

const FALLBACK_ARRAY = [38, 12, 45, 7, 23, 56, 31, 18, 42, 9];

export default function SortingAlgorithmView({
  generateSteps,
  defaultArray = FALLBACK_ARRAY,
}) {
  const {
    steps,
    currentStep,
    isPlaying,
    speed,
    loadAlgorithm,
    stepForward,
    goToStep,
    renderMode,
  } = useVisualizationStore();

  // Load default array on mount
  useEffect(() => {
    const generated = generateSteps(defaultArray);
    loadAlgorithm(defaultArray, generated);
  }, []);

  // Auto-play tick
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      stepForward();
    }, speed);

    return () => clearInterval(timer);
  }, [isPlaying, speed, stepForward]);

  const handleNewArray = (arr) => {
    const generated = generateSteps(arr);
    loadAlgorithm(arr, generated);
  };

  const step = steps[currentStep];
  if (!step) return null;

  // Normalize: bubble/quick use "sorted", merge uses "merging"
  const sortedIndices = step.sorted
    ? Array.isArray(step.sorted)
      ? step.sorted
      : [...step.sorted]
    : step.merging ?? [];

  return (
    <div>
      <ArrayInput onSubmit={handleNewArray} />

      <div className="mt-3 flex flex-col lg:flex-row gap-3">
        <div className="w-full lg:w-[30%] shrink-0 order-2 lg:order-1">
          <StepList
            steps={steps}
            currentStep={currentStep}
            onStepClick={goToStep}
            height={450}
          />
        </div>

        <div className="flex-1 min-w-0 order-1 lg:order-2">
          {renderMode === "svg" ? (
            <SortingBarsSVG
              array={step.array}
              comparing={step.comparing ?? []}
              sorted={sortedIndices}
              height={450}
            />
          ) : (
            <SortingBarsCanvas
              array={step.array}
              comparing={step.comparing ?? []}
              sorted={sortedIndices}
              height={450}
            />
          )}
        </div>
      </div>
    </div>
  );
}