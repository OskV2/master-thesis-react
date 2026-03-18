/**
 * Bubble Sort — step-generating implementation for visualization.
 *
 * Each step captures the full array state plus metadata about what's
 * happening (comparison, swap, sorted region) so the renderer can
 * highlight the appropriate elements.
 *
 * Step types:
 *   "compare"  — comparing two adjacent elements
 *   "swap"     — swapping two elements
 *   "sorted"   — element placed in final position
 *   "done"     — sorting complete
 */

export function bubbleSortSteps(inputArray) {
  const arr = [...inputArray];
  const steps = [];
  const n = arr.length;
  const sorted = new Set(); // indices known to be in final position

  // Initial state
  steps.push({
    type: "start",
    array: [...arr],
    comparing: [],
    sorted: [],
    description: `Tablica wejściowa: [${arr.join(", ")}]`,
  });

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;

    for (let j = 0; j < n - 1 - i; j++) {
      // Compare step
      steps.push({
        type: "compare",
        array: [...arr],
        comparing: [j, j + 1],
        sorted: [...sorted],
        description: `Porównanie: ${arr[j]} ${arr[j] > arr[j + 1] ? ">" : "≤"} ${arr[j + 1]}`,
      });

      if (arr[j] > arr[j + 1]) {
        // Swap
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;

        steps.push({
          type: "swap",
          array: [...arr],
          comparing: [j, j + 1],
          sorted: [...sorted],
          description: `Zamiana: ${arr[j + 1]} ↔ ${arr[j]}`,
        });
      }
    }

    // Mark last element of this pass as sorted
    sorted.add(n - 1 - i);
    steps.push({
      type: "sorted",
      array: [...arr],
      comparing: [],
      sorted: [...sorted],
      description: `Element ${arr[n - 1 - i]} jest na właściwej pozycji.`,
    });

    // Early termination if no swaps occurred
    if (!swapped) {
      // Mark all remaining as sorted
      for (let k = 0; k < n - 1 - i; k++) sorted.add(k);
      steps.push({
        type: "done",
        array: [...arr],
        comparing: [],
        sorted: [...sorted],
        description: "Brak zamian w tym przebiegu — tablica jest posortowana!",
      });
      return steps;
    }
  }

  // Last element is also sorted
  sorted.add(0);
  steps.push({
    type: "done",
    array: [...arr],
    comparing: [],
    sorted: [...sorted],
    description: "Sortowanie zakończone!",
  });

  return steps;
}
