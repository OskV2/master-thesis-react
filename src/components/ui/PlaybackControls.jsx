import { useVisualizationStore } from "@/stores/visualizationStore";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Gauge,
} from "lucide-react";

const SPEED_OPTIONS = [0.5, 1, 2, 4];

export default function PlaybackControls() {
  const {
    isPlaying,
    speed,
    currentStep,
    totalSteps,
    play,
    pause,
    reset,
    setSpeed,
    stepForward,
    stepBackward,
    goToStep,
  } = useVisualizationStore();

  const progress = totalSteps > 0 ? (currentStep / (totalSteps - 1)) * 100 : 0;

  return (
    <div className="bg-surface-light border border-slate-700/50 rounded-xl p-4 space-y-3">
      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-display text-slate-500">
          <span>Krok {currentStep + 1}</span>
          <span>z {totalSteps}</span>
        </div>
        <input
          type="range"
          min={0}
          max={Math.max(totalSteps - 1, 0)}
          value={currentStep}
          onChange={(e) => goToStep(Number(e.target.value))}
          className="w-full h-1.5 bg-surface-lighter rounded-full appearance-none cursor-pointer accent-primary-500"
        />
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={reset}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-surface-lighter transition-colors"
            title="Resetuj"
          >
            <RotateCcw size={18} />
          </button>

          <button
            onClick={stepBackward}
            disabled={currentStep === 0}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-surface-lighter transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Poprzedni krok"
          >
            <SkipBack size={18} />
          </button>

          <button
            onClick={isPlaying ? pause : play}
            className="p-3 rounded-xl bg-primary-600 text-white hover:bg-primary-500 transition-colors"
            title={isPlaying ? "Pauza" : "Odtwarzaj"}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>

          <button
            onClick={stepForward}
            disabled={currentStep >= totalSteps - 1}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-surface-lighter transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Następny krok"
          >
            <SkipForward size={18} />
          </button>
        </div>

        {/* Speed selector */}
        <div className="flex items-center gap-1.5">
          <Gauge size={14} className="text-slate-500" />
          {SPEED_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2 py-1 rounded text-xs font-display transition-colors ${
                speed === s
                  ? "bg-primary-600/20 text-primary-400 border border-primary-500/30"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
