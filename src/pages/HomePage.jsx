import { Link } from "@tanstack/react-router";
import { getAlgorithmsByCategory } from "@/lib/algorithms";
import { ArrowRight, Clock, MemoryStick } from "lucide-react";

function ComplexityBadge({ label, value }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-display text-slate-400">
      <span className="text-slate-500">{label}</span>
      <span className="text-primary-400">{value}</span>
    </span>
  );
}

function AlgorithmCard({ algorithm }) {
  return (
    <Link
      to="/algorithm/$slug"
      params={{ slug: algorithm.slug }}
      className="group block p-5 rounded-xl bg-surface-light border border-slate-700/50 hover:border-primary-500/50 hover:bg-surface-lighter/50 transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-slate-100 group-hover:text-primary-400 transition-colors">
            {algorithm.name}
          </h3>
          <p className="text-xs font-display text-slate-500 mt-0.5">
            {algorithm.nameEn}
          </p>
        </div>
        <ArrowRight
          size={18}
          className="text-slate-600 group-hover:text-primary-400 group-hover:translate-x-1 transition-all mt-1"
        />
      </div>

      <p className="text-sm text-slate-400 mb-4 leading-relaxed line-clamp-2">
        {algorithm.description}
      </p>

      <div className="flex flex-wrap gap-x-4 gap-y-1">
        <ComplexityBadge label="Avg" value={algorithm.complexity.time.average} />
        <ComplexityBadge label="Worst" value={algorithm.complexity.time.worst} />
        <ComplexityBadge label="Mem" value={algorithm.complexity.space} />
      </div>
    </Link>
  );
}

export default function HomePage() {
  const categories = getAlgorithmsByCategory();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 font-display">
          Algorytmy i Struktury Danych
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl">
          Interaktywne wizualizacje algorytmów sortowania, wyszukiwania wzorców
          i struktur danych. Wybierz algorytm, aby zobaczyć jak działa krok po
          kroku.
        </p>
      </div>

      {/* Algorithm grid by category */}
      <div className="space-y-10">
        {categories.map((category) => (
          <section key={category.id}>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-slate-200">
                {category.label}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {category.description}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {category.algorithms.map((algo) => (
                <AlgorithmCard key={algo.id} algorithm={algo} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
