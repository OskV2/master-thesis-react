/**
 * Quicksort — step-generating implementation for visualization.
 *
 * Uses Lomuto partition scheme for clearer visualization.
 *
 * Step types:
 *   "pivot"    — pivot selected
 *   "compare"  — comparing element against pivot
 *   "swap"     — swapping elements
 *   "partition" — partition complete, pivot placed
 *   "sorted"   — element in final position
 *   "done"     — sorting complete
 */

export function quickSortSteps(inputArray) {
  const arr = [...inputArray];
  const steps = [];
  const n = arr.length;
  const sorted = new Set();

  steps.push({
    type: "start",
    array: [...arr],
    comparing: [],
    pivot: null,
    partitionRange: null,
    sorted: [],
    description: `Tablica wejściowa: [${arr.join(", ")}]`,
  });

  function makeStep(type, extra = {}) {
    steps.push({
      type,
      array: [...arr],
      comparing: extra.comparing ?? [],
      pivot: extra.pivot ?? null,
      partitionRange: extra.partitionRange ?? null,
      sorted: [...sorted],
      description: extra.description ?? "",
    });
  }

  function partition(low, high) {
    const pivotValue = arr[high];
    const pivotIndex = high;

    makeStep("pivot", {
      pivot: pivotIndex,
      partitionRange: [low, high],
      description: `Pivot: ${pivotValue} (indeks ${high}). Partycjonowanie zakresu [${low}..${high}].`,
    });

    let i = low - 1;

    for (let j = low; j < high; j++) {
      makeStep("compare", {
        comparing: [j, pivotIndex],
        pivot: pivotIndex,
        partitionRange: [low, high],
        description: `Porównanie: ${arr[j]} ${arr[j] <= pivotValue ? "≤" : ">"} ${pivotValue} (pivot)`,
      });

      if (arr[j] <= pivotValue) {
        i++;
        if (i !== j) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          makeStep("swap", {
            comparing: [i, j],
            pivot: pivotIndex,
            partitionRange: [low, high],
            description: `Zamiana: ${arr[j]} ↔ ${arr[i]}`,
          });
        }
      }
    }

    // Place pivot in correct position
    const pivotFinal = i + 1;
    if (pivotFinal !== high) {
      [arr[pivotFinal], arr[high]] = [arr[high], arr[pivotFinal]];
    }

    sorted.add(pivotFinal);
    makeStep("partition", {
      pivot: pivotFinal,
      partitionRange: [low, high],
      description: `Pivot ${pivotValue} umieszczony na pozycji ${pivotFinal}.`,
    });

    return pivotFinal;
  }

  function quickSort(low, high) {
    if (low < high) {
      const pi = partition(low, high);
      quickSort(low, pi - 1);
      quickSort(pi + 1, high);
    } else if (low === high) {
      sorted.add(low);
      makeStep("sorted", {
        description: `Element ${arr[low]} (indeks ${low}) — jednoelementowy podzakres, posortowany.`,
      });
    }
  }

  quickSort(0, n - 1);

  makeStep("done", {
    description: "Sortowanie zakończone!",
  });

  return steps;
}
