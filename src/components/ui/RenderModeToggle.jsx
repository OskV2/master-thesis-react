import { useVisualizationStore } from "@/stores/visualizationStore";

export default function RenderModeToggle() {
  const { renderMode, setRenderMode } = useVisualizationStore();

  return (
    <div className="inline-flex items-center bg-surface-light border border-slate-700/50 rounded-lg p-1">
      {["svg", "canvas"].map((mode) => (
        <button
          key={mode}
          onClick={() => setRenderMode(mode)}
          className={`px-3 py-1.5 rounded-md text-xs font-display font-medium uppercase tracking-wide transition-colors ${
            renderMode === mode
              ? "bg-primary-600/20 text-primary-400"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          {mode}
        </button>
      ))}
    </div>
  );
}
