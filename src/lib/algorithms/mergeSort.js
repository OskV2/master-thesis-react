/**
 * Merge Sort — step-generating implementation for visualization.
 *
 * Top-down recursive merge sort. Steps capture the split/merge phases
 * so the visualizer can show the divide-and-conquer structure.
 *
 * Step types:
 *   "split"    — dividing array into halves
 *   "compare"  — comparing elements during merge
 *   "merge"    — placing element during merge phase
 *   "merged"   — subarray merge complete
 *   "done"     — sorting complete
 */

export function mergeSortSteps(inputArray) {
  // We work on a mutable copy but track the "global" array state
  // by applying merge results back into a shared array.
  const arr = [...inputArray];
  const steps = [];
  const n = arr.length;

  steps.push({
    type: "start",
    array: [...arr],
    range: [0, n - 1],
    comparing: [],
    merging: [],
    description: `Tablica wejściowa: [${arr.join(", ")}]`,
  });

  function makeStep(type, extra = {}) {
    steps.push({
      type,
      array: [...arr],
      range: extra.range ?? null,
      comparing: extra.comparing ?? [],
      merging: extra.merging ?? [],
      description: extra.description ?? "",
    });
  }

  function merge(left, mid, right) {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);

    makeStep("merge-start", {
      range: [left, right],
      description: `Scalanie: [${leftArr.join(", ")}] i [${rightArr.join(", ")}]`,
    });

    let i = 0; // index into leftArr
    let j = 0; // index into rightArr
    let k = left; // index into main arr
    const mergedIndices = [];

    while (i < leftArr.length && j < rightArr.length) {
      const li = left + i;
      const ri = mid + 1 + j;

      makeStep("compare", {
        range: [left, right],
        comparing: [li, ri],
        merging: mergedIndices.slice(),
        description: `Porównanie: ${leftArr[i]} ${leftArr[i] <= rightArr[j] ? "≤" : ">"} ${rightArr[j]}`,
      });

      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        i++;
      } else {
        arr[k] = rightArr[j];
        j++;
      }
      mergedIndices.push(k);

      makeStep("merge", {
        range: [left, right],
        merging: mergedIndices.slice(),
        description: `Umieszczono ${arr[k]} na pozycji ${k}.`,
      });

      k++;
    }

    // Copy remaining elements from left
    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      mergedIndices.push(k);
      makeStep("merge", {
        range: [left, right],
        merging: mergedIndices.slice(),
        description: `Kopiowanie pozostałego elementu ${arr[k]} z lewej połowy.`,
      });
      i++;
      k++;
    }

    // Copy remaining elements from right
    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      mergedIndices.push(k);
      makeStep("merge", {
        range: [left, right],
        merging: mergedIndices.slice(),
        description: `Kopiowanie pozostałego elementu ${arr[k]} z prawej połowy.`,
      });
      j++;
      k++;
    }

    makeStep("merged", {
      range: [left, right],
      merging: mergedIndices,
      description: `Scalono zakres [${left}..${right}]: [${arr.slice(left, right + 1).join(", ")}]`,
    });
  }

  function mergeSort(left, right) {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);

    makeStep("split", {
      range: [left, right],
      description: `Podział: [${left}..${mid}] | [${mid + 1}..${right}]`,
    });

    mergeSort(left, mid);
    mergeSort(mid + 1, right);
    merge(left, mid, right);
  }

  mergeSort(0, n - 1);

  makeStep("done", {
    range: [0, n - 1],
    merging: Array.from({ length: n }, (_, i) => i),
    description: "Sortowanie przez scalanie zakończone!",
  });

  return steps;
}
