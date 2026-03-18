import { useState } from "react";
import { ALGORITHMS } from "@/lib/algorithms";
import { useQuizStore } from "@/stores/quizStore";
import { FlaskConical, CheckCircle2, XCircle, RotateCcw } from "lucide-react";

/**
 * Quiz configuration screen — select algorithms and start a test.
 */
function QuizSetup({ onStart }) {
  const [selected, setSelected] = useState(ALGORITHMS.map((a) => a.id));

  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-primary-600/20 flex items-center justify-center mx-auto mb-4">
          <FlaskConical size={28} className="text-primary-400" />
        </div>
        <h1 className="text-2xl font-bold text-white font-display">
          Test wiedzy
        </h1>
        <p className="text-slate-400 mt-2">
          Sprawdź swoją znajomość algorytmów i struktur danych.
        </p>
      </div>

      <div className="bg-surface-light border border-slate-700/50 rounded-xl p-5 mb-6">
        <h2 className="font-semibold text-slate-200 mb-3">
          Wybierz zakres testu
        </h2>
        <div className="grid gap-2">
          {ALGORITHMS.map((algo) => (
            <label
              key={algo.id}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                selected.includes(algo.id)
                  ? "bg-primary-600/10 border border-primary-500/30"
                  : "bg-surface-lighter/30 border border-transparent hover:border-slate-600"
              }`}
            >
              <input
                type="checkbox"
                checked={selected.includes(algo.id)}
                onChange={() => toggle(algo.id)}
                className="accent-primary-500"
              />
              <div>
                <span className="text-sm text-slate-200">{algo.name}</span>
                <span className="text-xs text-slate-500 ml-2">
                  {algo.nameEn}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={() => onStart(selected)}
        disabled={selected.length === 0}
        className="w-full py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Rozpocznij test ({selected.length}{" "}
        {selected.length === 1 ? "algorytm" : "algorytmów"})
      </button>
    </div>
  );
}

/**
 * Placeholder quiz results screen.
 */
function QuizResults({ score, onReset }) {
  const passed = score.percentage >= 60;

  return (
    <div className="max-w-md mx-auto text-center">
      <div
        className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
          passed ? "bg-emerald-500/20" : "bg-red-500/20"
        }`}
      >
        {passed ? (
          <CheckCircle2 size={40} className="text-emerald-400" />
        ) : (
          <XCircle size={40} className="text-red-400" />
        )}
      </div>
      <h2 className="text-2xl font-bold text-white font-display mb-2">
        {score.percentage}%
      </h2>
      <p className="text-slate-400 mb-2">
        {score.correct} z {score.total} poprawnych odpowiedzi
      </p>
      <p className="text-sm text-slate-500 mb-8">
        {passed ? "Dobra robota! Znasz te algorytmy." : "Spróbuj jeszcze raz — powtórka czyni mistrza!"}
      </p>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-light border border-slate-700/50 text-slate-200 hover:bg-surface-lighter transition-colors"
      >
        <RotateCcw size={16} />
        Spróbuj ponownie
      </button>
    </div>
  );
}

export default function QuizPage() {
  const { score, resetQuiz } = useQuizStore();
  const [started, setStarted] = useState(false);

  const handleStart = (selectedIds) => {
    // TODO: Generate questions from selected algorithms
    // For now, show a placeholder result
    useQuizStore.getState().startQuiz([
      {
        id: "q1",
        question: "Placeholder — generator pytań zostanie zaimplementowany",
        options: ["A", "B", "C", "D"],
        correctAnswer: "A",
        algorithmId: "bubble-sort",
      },
    ]);
    useQuizStore.getState().answerQuestion(0, "A");
    useQuizStore.getState().finishQuiz();
    setStarted(true);
  };

  const handleReset = () => {
    resetQuiz();
    setStarted(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {!started ? (
        <QuizSetup onStart={handleStart} />
      ) : score ? (
        <QuizResults score={score} onReset={handleReset} />
      ) : null}
    </div>
  );
}
