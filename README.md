# AlgoViz — React

Aplikacja webowa wizualizująca algorytmy i struktury danych.  
Część implementacyjna pracy magisterskiej (wariant React).

## Tech Stack

- **Vite** — build tool
- **React 19** — UI
- **TanStack Router** — routing (type-safe)
- **Zustand** — state management
- **Tailwind CSS v4** — styling
- **Lucide React** — ikony

## Uruchomienie

```bash
npm install
npm run dev
```

Aplikacja będzie dostępna pod `http://localhost:5173`.

## Struktura projektu

```
src/
├── components/
│   ├── layout/          # RootLayout, nawigacja
│   ├── algorithms/      # Komponenty wizualizacji (per algorytm)
│   ├── quiz/            # Komponenty modułu testowego
│   └── ui/              # Wspólne UI (PlaybackControls, RenderModeToggle)
├── pages/
│   ├── HomePage.jsx     # Katalog algorytmów
│   ├── AlgorithmPage.jsx# Widok wizualizacji
│   └── QuizPage.jsx     # Moduł testów
├── stores/
│   ├── visualizationStore.js  # Stan wizualizacji (playback, kroki)
│   └── quizStore.js           # Stan quizu
├── hooks/
│   └── usePlaybackTick.js     # Hook do animacji krokowej
├── lib/
│   └── algorithms.js    # Rejestr algorytmów (metadata, złożoności)
├── router.jsx           # Konfiguracja TanStack Router
├── main.jsx             # Entry point
└── index.css            # Tailwind + custom theme
```

## Algorytmy

| Algorytm | Kategoria | Status |
|----------|-----------|--------|
| Sortowanie bąbelkowe | Sortowanie | 🔲 placeholder |
| Quicksort | Sortowanie | 🔲 placeholder |
| Merge Sort | Sortowanie | 🔲 placeholder |
| KMP | Wyszukiwanie | 🔲 placeholder |
| BST | Struktury danych | 🔲 placeholder |

## Porównanie technik renderowania

Każdy algorytm będzie miał implementację w SVG i Canvas.  
Toggle w UI pozwala przełączać między trybami.

## Następne kroki

1. Implementacja wizualizacji sortowania bąbelkowego (SVG + Canvas)
2. Generator kroków algorytmu (step generator)
3. Implementacja pozostałych algorytmów
4. Generator pytań quizowych
5. Benchmarking wydajności (FPS, pamięć, czas renderowania)
