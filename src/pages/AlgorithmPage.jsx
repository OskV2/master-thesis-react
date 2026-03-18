import { useParams } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { getAlgorithmBySlug } from "@/lib/algorithms";
import PlaybackControls from "@/components/ui/PlaybackControls";
import RenderModeToggle from "@/components/ui/RenderModeToggle";
import { ArrowLeft, Info } from "lucide-react";
import BubbleSortView from "@/components/algorithms/BubbleSortView";

/**
 * Placeholder visualization component.
 * Will be replaced by actual algorithm-specific visualizers.
 */
function VisualizationPlaceholder({ algorithm }) {
  return (
    <div className="aspect-video bg-surface-light border border-slate-700/50 rounded-xl flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-surface-lighter flex items-center justify-center">
        <span className="font-display text-2xl text-primary-500">
          {algorithm.nameEn.charAt(0)}
        </span>
      </div>
      <div className="text-center">
        <p className="text-slate-300 font-medium">{algorithm.name}</p>
        <p className="text-sm text-slate-500 mt-1">
          Wizualizacja zostanie zaimplementowana w następnym kroku
        </p>
      </div>
    </div>
  );
}

export default function AlgorithmPage() {
  const { slug } = useParams({ from: "/algorithm/$slug" });
  const algorithm = getAlgorithmBySlug(slug);

  if (!algorithm) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-slate-400">Nie znaleziono algorytmu.</p>
        <Link to="/" className="text-primary-400 hover:underline mt-2 inline-block">
          Wróć do listy
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb / Back */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-primary-400 transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Wszystkie algorytmy
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">
            {algorithm.name}
          </h1>
          <p className="text-sm text-slate-500 font-display mt-1">
            {algorithm.nameEn}
          </p>
        </div>
        <RenderModeToggle />
      </div>

      {/* Complexity info */}
      <div className="flex flex-wrap gap-3 mb-6">
        {Object.entries(algorithm.complexity.time).map(([key, val]) => (
          <div
            key={key}
            className="px-3 py-1.5 rounded-lg bg-surface-light border border-slate-700/50 text-xs font-display"
          >
            <span className="text-slate-500 capitalize">{key}: </span>
            <span className="text-primary-400">{val}</span>
          </div>
        ))}
        <div className="px-3 py-1.5 rounded-lg bg-surface-light border border-slate-700/50 text-xs font-display">
          <span className="text-slate-500">Pamięć: </span>
          <span className="text-primary-400">{algorithm.complexity.space}</span>
        </div>
      </div>

      {/* Visualization area */}
      {algorithm.slug === "bubble-sort" ? (
        <BubbleSortView />
      ) : (
        <VisualizationPlaceholder algorithm={algorithm} />
      )}

      {/* Playback controls */}
      <div className="mt-4">
        <PlaybackControls />
      </div>

      {/* Description */}
      <div className="mt-8 p-5 rounded-xl bg-surface-light border border-slate-700/50">
        <div className="flex items-center gap-2 mb-3">
          <Info size={16} className="text-primary-400" />
          <h2 className="font-semibold text-slate-200">Opis algorytmu</h2>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed">
          {algorithm.description}
        </p>
      </div>
    </div>
  );
}
