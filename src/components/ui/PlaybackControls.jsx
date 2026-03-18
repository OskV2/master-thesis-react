import { useVisualizationStore } from '@/stores/visualizationStore';
import {
  Play,
  Pause,
  ChevronsLeft,
  ChevronsRight,
  RotateCcw,
  Gauge,
} from 'lucide-react';

const SPEED_OPTIONS = [1000, 500, 200, 50];

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
          <span>
            Krok {currentStep + 1} z {totalSteps}
          </span>
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
        <div className="flex items-center gap-1.5">
          <button
            onClick={reset}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm bg-surface-lighter text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            title="Resetuj"
          >
            <RotateCcw size={18} />
            Reset
          </button>

          <button
            onClick={stepBackward}
            disabled={currentStep === 0 || isPlaying}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm bg-surface-lighter text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            title="Poprzedni krok"
          >
            <ChevronsLeft size={18} />
            Poprzedni
          </button>

          <button
            onClick={isPlaying ? pause : play}
            disabled={currentStep >= totalSteps - 1 && !isPlaying}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm bg-primary-600 text-white hover:bg-primary-500 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            {isPlaying ? 'Pauza' : 'Play'}
          </button>

          <button
            onClick={stepForward}
            disabled={currentStep >= totalSteps - 1 || isPlaying}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm bg-surface-lighter text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Następny
            <ChevronsRight size={18} />
          </button>
        </div>

        {/* Speed selector */}
        <div className="flex items-center gap-1 ml-auto">
          <span className="text-xs text-slate-500">Prędkość:</span>
          {SPEED_OPTIONS.map((ms) => (
            <button
              key={ms}
              onClick={() => setSpeed(ms)}
              className={`px-2 py-1 rounded text-xs font-display ${
                speed === ms
                  ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30'
                  : 'text-slate-500 hover:text-slate-300'
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
