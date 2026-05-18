/**
 * ArrayInput — pozwala użytkownikowi wpisać własną tablicę
 * lub wygenerować losową.
 *
 * Props:
 *   onSubmit(array: number[]) — wywoływane po zatwierdzeniu tablicy
 *   defaultSize — domyślna ilość elementów przy losowaniu (default: 10)
 *   maxSize — maksymalna dozwolona ilość elementów (default: 30)
 *   maxValue — maksymalna wartość elementu (default: 99)
 */

import { useState } from "react";

export default function ArrayInput({
  onSubmit,
  defaultSize = 10,
  maxSize = 75,
  maxValue = 200,
}) {
  const [text, setText] = useState("");
  const [error, setError] = useState(null);

  // Parse comma/space separated numbers
  const handleSubmit = () => {
    setError(null);

    const parts = text
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (parts.length === 0) {
      setError("Wpisz przynajmniej 2 liczby.");
      return;
    }

    const numbers = parts.map(Number);

    if (numbers.some((n) => isNaN(n))) {
      setError("Wszystkie wartości muszą być liczbami.");
      return;
    }

    if (numbers.length < 2) {
      setError("Potrzeba przynajmniej 2 elementów.");
      return;
    }

    if (numbers.length > maxSize) {
      setError(`Maksymalnie ${maxSize} elementów.`);
      return;
    }

    onSubmit(numbers);
  };

  const handleRandom = () => {
    setError(null);
    const arr = Array.from({ length: defaultSize }, () =>
      Math.floor(Math.random() * maxValue) + 1
    );
    setText(arr.join(", "));
    onSubmit(arr);
  };

  return (
    <div className="bg-surface-light border border-slate-700/50 rounded-xl p-4 space-y-3">
      <label className="block text-sm text-slate-300 font-medium">
        Tablica do sortowania
      </label>

      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="np. 38, 12, 45, 7, 23"
          className="flex-1 px-3 py-2 rounded-lg bg-surface text-slate-100 text-sm font-display border border-slate-600 focus:border-primary-500 focus:outline-none placeholder:text-slate-600"
        />
        <button
          onClick={handleSubmit}
          className="px-4 py-2 rounded-lg text-sm bg-primary-600 text-white hover:bg-primary-500"
        >
          Sortuj
        </button>
        <button
          onClick={handleRandom}
          className="px-4 py-2 rounded-lg text-sm bg-surface-lighter text-slate-300 hover:text-white"
        >
          Losuj
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}