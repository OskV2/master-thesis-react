/**
 * BstView — BST visualization with interactive operations.
 *
 * Different from sorting views:
 *   - User adds values one by one (insert) or searches/deletes
 *   - Steps accumulate across operations
 *   - Tree state persists between operations
 */

import { useState, useEffect, useRef } from "react";
import { BST } from "@/lib/algorithms/bst";
import { useVisualizationStore } from "@/stores/visualizationStore";
import BstVisualizationSVG from "@/components/algorithms/BstVisualizationSVG";
import StepList from "@/components/ui/StepList";

const DEFAULT_VALUES = [50, 30, 70, 20, 40, 60, 80];

export default function BstView() {
  const {
    steps,
    currentStep,
    isPlaying,
    speed,
    loadAlgorithm,
    stepForward,
    goToStep,
  } = useVisualizationStore();

  const bstRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(null);

  // Build default tree on mount
  useEffect(() => {
    const { bst, steps: buildSteps } = BST.buildFromArray(DEFAULT_VALUES);
    bstRef.current = bst;
    loadAlgorithm(DEFAULT_VALUES, buildSteps);
  }, []);

  // Auto-play tick
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => stepForward(), speed);
    return () => clearInterval(timer);
  }, [isPlaying, speed, stepForward]);

  const runOperation = (operation) => {
    setError(null);
    const val = Number(inputValue);
    if (isNaN(val) || inputValue.trim() === "") {
      setError("Wpisz liczbę.");
      return;
    }

    const bst = bstRef.current;
    if (!bst) return;

    let newSteps;
    switch (operation) {
      case "insert":
        newSteps = bst.insert(val);
        break;
      case "search":
        newSteps = bst.search(val);
        break;
      case "delete":
        newSteps = bst.delete(val);
        break;
      default:
        return;
    }

    // Append new steps to existing ones
    const allSteps = [...steps, ...newSteps];
    loadAlgorithm(null, allSteps);
    // Jump to first new step
    goToStep(steps.length);
    setInputValue("");
  };

  const handleReset = () => {
    const { bst, steps: buildSteps } = BST.buildFromArray(DEFAULT_VALUES);
    bstRef.current = bst;
    loadAlgorithm(DEFAULT_VALUES, buildSteps);
  };

  const step = steps[currentStep];
  if (!step) return null;

  return (
    <div>
      {/* Input */}
      <div className="bg-surface-light border border-slate-700/50 rounded-xl p-4">
        <div className="flex flex-wrap gap-2 items-end">
          <div>
            <label className="block text-xs text-slate-500 mb-1 font-display">
              Wartość
            </label>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runOperation("insert")}
              placeholder="np. 25"
              className="w-28 px-3 py-2 rounded-lg bg-surface text-slate-100 text-sm font-display border border-slate-600 focus:border-primary-500 focus:outline-none"
            />
          </div>
          <button
            onClick={() => runOperation("insert")}
            className="px-4 py-2 rounded-lg text-sm bg-primary-600 text-white hover:bg-primary-500"
          >
            Wstaw
          </button>
          <button
            onClick={() => runOperation("search")}
            className="px-4 py-2 rounded-lg text-sm bg-amber-600 text-white hover:bg-amber-500"
          >
            Szukaj
          </button>
          <button
            onClick={() => runOperation("delete")}
            className="px-4 py-2 rounded-lg text-sm bg-red-600 text-white hover:bg-red-500"
          >
            Usuń
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-lg text-sm bg-surface-lighter text-slate-300 hover:text-white"
          >
            Reset
          </button>
        </div>
        {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
      </div>

      {/* Visualization + step list */}
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
          <BstVisualizationSVG step={step} height={450} />
        </div>
      </div>
    </div>
  );
}