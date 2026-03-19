/**
 * KmpView — KMP pattern matching visualization.
 *
 * Different from sorting views:
 *   - Input: text + pattern (not an array of numbers)
 *   - Visualization: character boxes, not bars
 *   - Uses the same Zustand store for playback
 */

import { useState, useEffect } from "react";
import { kmpSearchSteps } from "@/lib/algorithms/kmp";
import { useVisualizationStore } from "@/stores/visualizationStore";
import KmpVisualizationSVG from "@/components/algorithms/KmpVisualizationSVG";
import StepList from "@/components/ui/StepList";

const DEFAULT_TEXT = "ABABDABACDABABCABAB";
const DEFAULT_PATTERN = "ABABCABAB";

export default function KmpView() {
  const {
    steps,
    currentStep,
    isPlaying,
    speed,
    loadAlgorithm,
    stepForward,
    goToStep,
  } = useVisualizationStore();

  const [text, setText] = useState(DEFAULT_TEXT);
  const [pattern, setPattern] = useState(DEFAULT_PATTERN);
  const [error, setError] = useState(null);

  // Load default on mount
  useEffect(() => {
    const generated = kmpSearchSteps(DEFAULT_TEXT, DEFAULT_PATTERN);
    loadAlgorithm({ text: DEFAULT_TEXT, pattern: DEFAULT_PATTERN }, generated);
  }, []);

  // Auto-play tick
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => stepForward(), speed);
    return () => clearInterval(timer);
  }, [isPlaying, speed, stepForward]);

  const handleSearch = () => {
    setError(null);
    if (text.length === 0) { setError("Wpisz tekst."); return; }
    if (pattern.length === 0) { setError("Wpisz wzorzec."); return; }
    if (pattern.length > text.length) { setError("Wzorzec dłuższy od tekstu."); return; }

    const generated = kmpSearchSteps(text, pattern);
    loadAlgorithm({ text, pattern }, generated);
  };

  const step = steps[currentStep];
  if (!step) return null;

  return (
    <div>
      {/* Input */}
      <div className="bg-surface-light border border-slate-700/50 rounded-xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <label className="block text-xs text-slate-500 mb-1 font-display">Tekst</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 rounded-lg bg-surface text-slate-100 text-sm font-display border border-slate-600 focus:border-primary-500 focus:outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-slate-500 mb-1 font-display">Wzorzec</label>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 rounded-lg bg-surface text-slate-100 text-sm font-display border border-slate-600 focus:border-primary-500 focus:outline-none"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              className="px-4 py-2 rounded-lg text-sm bg-primary-600 text-white hover:bg-primary-500"
            >
              Szukaj
            </button>
          </div>
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
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
          <KmpVisualizationSVG step={step} height={450} />
        </div>
      </div>
    </div>
  );
}