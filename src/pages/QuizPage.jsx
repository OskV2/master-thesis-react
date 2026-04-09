import { useState } from "react";
import { ALGORITHMS } from "@/lib/algorithms";
import { useQuizStore } from "@/stores/quizStore";
import allQuestions from "@/data/quizQuestions.json";
import {
  FlaskConical,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

// ── Setup screen ─────────────────────────────────────────────────────────────

function QuizSetup({ onStart }) {
  const storedSelected = useQuizStore((s) => s.selectedAlgorithms);
  const setSelectedAlgorithms = useQuizStore((s) => s.setSelectedAlgorithms);

  const [selected, setSelected] = useState(
    storedSelected.length > 0 ? storedSelected : ALGORITHMS.map((a) => a.id)
  );

  const toggle = (id) => {
    const next = selected.includes(id)
      ? selected.filter((s) => s !== id)
      : [...selected, id];
    setSelected(next);
    setSelectedAlgorithms(next);
  };

  const questionCount = allQuestions.filter((q) =>
    selected.includes(q.algorithmId)
  ).length;

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
          {ALGORITHMS.map((algo) => {
            const count = allQuestions.filter(
              (q) => q.algorithmId === algo.id
            ).length;
            return (
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
                <div className="flex-1">
                  <span className="text-sm text-slate-200">{algo.name}</span>
                  <span className="text-xs text-slate-500 ml-2">
                    {algo.nameEn}
                  </span>
                </div>
                <span className="text-xs text-slate-500">{count} pyt.</span>
              </label>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => onStart(selected)}
        disabled={selected.length === 0 || questionCount === 0}
        className="w-full py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Rozpocznij test ({questionCount}{" "}
        {questionCount === 1 ? "pytanie" : questionCount < 5 ? "pytania" : "pytań"})
      </button>
    </div>
  );
}

// ── Question screen ───────────────────────────────────────────────────────────

const OPTION_LETTERS = ["A", "B", "C", "D"];

function QuizQuestion() {
  const {
    questions,
    currentQuestionIndex,
    answers,
    answerQuestion,
    nextQuestion,
    prevQuestion,
    finishQuiz,
  } = useQuizStore();

  const question = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];
  const isLast = currentQuestionIndex === questions.length - 1;
  const allAnswered = answers.every((a) => a !== null);

  if (!question) return null;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
          <span>
            Pytanie {currentQuestionIndex + 1} z {questions.length}
          </span>
          <span>
            {answers.filter((a) => a !== null).length} / {questions.length} odpowiedzi
          </span>
        </div>
        <div className="h-1.5 bg-surface-light rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-300"
            style={{
              width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="bg-surface-light border border-slate-700/50 rounded-xl p-6 mb-4">
        <p className="text-slate-100 font-medium text-base leading-relaxed mb-6">
          {question.question}
        </p>

        <div className="grid gap-2">
          {question.options.map((option, i) => {
            const letter = OPTION_LETTERS[i];
            const isSelected = currentAnswer === option;

            return (
              <button
                key={option}
                onClick={() => answerQuestion(currentQuestionIndex, option)}
                className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg border transition-all ${
                  isSelected
                    ? "border-primary-500 bg-primary-600/15 text-slate-100"
                    : "border-slate-700/50 bg-surface-lighter/20 text-slate-300 hover:border-slate-500 hover:bg-surface-lighter/40"
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                    isSelected
                      ? "bg-primary-600 text-white"
                      : "bg-surface-lighter text-slate-400"
                  }`}
                >
                  {letter}
                </span>
                <span className="text-sm">{option}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={prevQuestion}
          disabled={currentQuestionIndex === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-light border border-slate-700/50 text-slate-300 hover:bg-surface-lighter hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
          Wstecz
        </button>

        <div className="flex-1" />

        {isLast ? (
          <button
            onClick={finishQuiz}
            disabled={!allAnswered}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Zakończ test
            <CheckCircle2 size={16} />
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-500 transition-colors"
          >
            Dalej
            <ChevronRight size={16} />
          </button>
        )}
      </div>

      {/* Question dots */}
      <div className="flex flex-wrap gap-1.5 mt-5 justify-center">
        {questions.map((_, i) => (
          <button
            key={i}
            onClick={() => useQuizStore.getState().goToQuestion(i)}
            className={`w-7 h-7 rounded-full text-xs font-display transition-colors ${
              i === currentQuestionIndex
                ? "bg-primary-600 text-white"
                : answers[i] !== null
                  ? "bg-emerald-700/60 text-emerald-300"
                  : "bg-surface-light border border-slate-700/50 text-slate-500 hover:border-slate-500"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Results screen ────────────────────────────────────────────────────────────

function QuizResults({ onReset }) {
  const { score, questions, answers } = useQuizStore();
  const passed = score.percentage >= 60;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Score summary */}
      <div className="text-center mb-8">
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
            passed ? "bg-emerald-500/20" : "bg-red-500/20"
          }`}
        >
          {passed ? (
            <CheckCircle2 size={40} className="text-emerald-400" />
          ) : (
            <XCircle size={40} className="text-red-400" />
          )}
        </div>
        <h2 className="text-3xl font-bold text-white font-display mb-1">
          {score.percentage}%
        </h2>
        <p className="text-slate-400">
          {score.correct} z {score.total} poprawnych odpowiedzi
        </p>
        <p className="text-sm text-slate-500 mt-1">
          {passed
            ? "Dobra robota! Znasz te algorytmy."
            : "Spróbuj jeszcze raz — powtórka czyni mistrza!"}
        </p>
      </div>

      {/* Per-question breakdown */}
      <div className="space-y-3 mb-8">
        {questions.map((q, i) => {
          const userAnswer = answers[i];
          const isCorrect = userAnswer === q.correctAnswer;

          return (
            <div
              key={q.id}
              className={`rounded-xl border p-4 ${
                isCorrect
                  ? "border-emerald-700/50 bg-emerald-900/10"
                  : "border-red-700/50 bg-red-900/10"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="shrink-0 mt-0.5">
                  {isCorrect ? (
                    <CheckCircle2 size={16} className="text-emerald-400" />
                  ) : (
                    <XCircle size={16} className="text-red-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200 mb-2">{q.question}</p>
                  {!isCorrect && (
                    <div className="space-y-1 text-xs">
                      <p className="text-red-400">
                        Twoja odpowiedź: {userAnswer ?? "—"}
                      </p>
                      <p className="text-emerald-400">
                        Poprawna: {q.correctAnswer}
                      </p>
                    </div>
                  )}
                  {isCorrect && (
                    <p className="text-xs text-emerald-400">{q.correctAnswer}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={onReset}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-surface-light border border-slate-700/50 text-slate-200 hover:bg-surface-lighter transition-colors"
      >
        <RotateCcw size={16} />
        Spróbuj ponownie
      </button>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function QuizPage() {
  const { isActive, score, resetQuiz, startQuiz, selectedAlgorithms } =
    useQuizStore();

  const handleStart = (selectedIds) => {
    const pool = allQuestions.filter((q) =>
      selectedIds.includes(q.algorithmId)
    );
    // Shuffle
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    startQuiz(shuffled);
  };

  const handleReset = () => {
    resetQuiz();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {!isActive && !score && <QuizSetup onStart={handleStart} />}
      {isActive && <QuizQuestion />}
      {!isActive && score && <QuizResults onReset={handleReset} />}
    </div>
  );
}
