/**
 * Central registry of algorithms available in the app.
 * Each algorithm has metadata used for routing, display, and categorization.
 */

export const ALGORITHM_CATEGORIES = {
  sorting: {
    id: "sorting",
    label: "Algorytmy sortowania",
    description: "Porównanie metod porządkowania danych",
  },
  searching: {
    id: "searching",
    label: "Wyszukiwanie",
    description: "Algorytmy przeszukiwania i dopasowywania wzorców",
  },
  "data-structures": {
    id: "data-structures",
    label: "Struktury danych",
    description: "Drzewa, grafy i inne struktury",
  },
};

export const ALGORITHMS = [
  {
    id: "bubble-sort",
    slug: "bubble-sort",
    name: "Sortowanie bąbelkowe",
    nameEn: "Bubble Sort",
    category: "sorting",
    complexity: {
      time: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
      space: "O(1)",
    },
    description:
      "Prosty algorytm sortowania polegający na wielokrotnym porównywaniu sąsiednich elementów i zamianie ich miejscami, jeśli są w złej kolejności.",
    stable: true,
    inPlace: true,
  },
  {
    id: "quicksort",
    slug: "quicksort",
    name: "Sortowanie szybkie",
    nameEn: "Quicksort",
    category: "sorting",
    complexity: {
      time: { best: "O(n log n)", average: "O(n log n)", worst: "O(n²)" },
      space: "O(log n)",
    },
    description:
      "Wydajny algorytm sortowania typu dziel i zwyciężaj, wybierający element osiowy (pivot) i partycjonujący tablicę względem niego.",
    stable: false,
    inPlace: true,
  },
  {
    id: "merge-sort",
    slug: "merge-sort",
    name: "Sortowanie przez scalanie",
    nameEn: "Merge Sort",
    category: "sorting",
    complexity: {
      time: {
        best: "O(n log n)",
        average: "O(n log n)",
        worst: "O(n log n)",
      },
      space: "O(n)",
    },
    description:
      "Stabilny algorytm sortowania typu dziel i zwyciężaj, który rekurencyjnie dzieli tablicę na połowy, sortuje je i scala.",
    stable: true,
    inPlace: false,
  },
  {
    id: "kmp",
    slug: "kmp",
    name: "Wyszukiwanie wzorca KMP",
    nameEn: "Knuth-Morris-Pratt",
    category: "searching",
    complexity: {
      time: { best: "O(n+m)", average: "O(n+m)", worst: "O(n+m)" },
      space: "O(m)",
    },
    description:
      "Algorytm wyszukiwania wzorca w tekście wykorzystujący tablicę prefiksów do unikania niepotrzebnych porównań.",
    stable: null,
    inPlace: null,
  },
  {
    id: "bst",
    slug: "bst",
    name: "Drzewo BST",
    nameEn: "Binary Search Tree",
    category: "data-structures",
    complexity: {
      time: {
        best: "O(log n)",
        average: "O(log n)",
        worst: "O(n)",
      },
      space: "O(n)",
    },
    description:
      "Binarne drzewo poszukiwań — struktura danych umożliwiająca efektywne wstawianie, usuwanie i wyszukiwanie elementów.",
    stable: null,
    inPlace: null,
  },
];

/**
 * Get algorithm by slug (used in routing)
 */
export function getAlgorithmBySlug(slug) {
  return ALGORITHMS.find((a) => a.slug === slug) ?? null;
}

/**
 * Get algorithms grouped by category
 */
export function getAlgorithmsByCategory() {
  const grouped = {};
  for (const algo of ALGORITHMS) {
    if (!grouped[algo.category]) {
      grouped[algo.category] = {
        ...ALGORITHM_CATEGORIES[algo.category],
        algorithms: [],
      };
    }
    grouped[algo.category].algorithms.push(algo);
  }
  return Object.values(grouped);
}
