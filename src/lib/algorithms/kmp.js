/**
 * Knuth-Morris-Pratt (KMP) — step-generating implementation for visualization.
 *
 * Two phases:
 *   1. Building the failure/prefix table (LPS array)
 *   2. Searching the text using the prefix table
 *
 * Step types:
 *   Phase 1 (prefix table):
 *     "lps-compare"  — comparing characters during LPS construction
 *     "lps-match"    — characters match, extending prefix
 *     "lps-fallback" — mismatch, falling back using LPS
 *     "lps-set"      — setting LPS value
 *     "lps-done"     — LPS table complete
 *
 *   Phase 2 (search):
 *     "search-compare" — comparing text[i] with pattern[j]
 *     "search-match"   — characters match
 *     "search-mismatch"— mismatch, using LPS to shift
 *     "search-found"   — full pattern match found
 *     "search-done"    — search complete
 */

/**
 * Build the LPS (Longest Proper Prefix which is also Suffix) array.
 * Returns { lps, steps }.
 */
export function buildLPSSteps(pattern) {
  const m = pattern.length;
  const lps = new Array(m).fill(0);
  const steps = [];

  steps.push({
    type: "lps-start",
    pattern,
    lps: [...lps],
    i: null,
    len: null,
    description: `Budowanie tablicy LPS dla wzorca "${pattern}". LPS[0] = 0 (zawsze).`,
  });

  let len = 0; // length of previous longest prefix suffix
  let i = 1;

  while (i < m) {
    steps.push({
      type: "lps-compare",
      pattern,
      lps: [...lps],
      i,
      len,
      comparing: [i, len],
      description: `Porównanie: pattern[${i}]='${pattern[i]}' z pattern[${len}]='${pattern[len]}'`,
    });

    if (pattern[i] === pattern[len]) {
      len++;
      lps[i] = len;

      steps.push({
        type: "lps-match",
        pattern,
        lps: [...lps],
        i,
        len,
        description: `Zgodność! LPS[${i}] = ${len}`,
      });

      i++;
    } else {
      if (len !== 0) {
        const oldLen = len;
        len = lps[len - 1];

        steps.push({
          type: "lps-fallback",
          pattern,
          lps: [...lps],
          i,
          len,
          description: `Niezgodność. Cofnięcie: len = LPS[${oldLen - 1}] = ${len}`,
        });
      } else {
        lps[i] = 0;

        steps.push({
          type: "lps-set",
          pattern,
          lps: [...lps],
          i,
          len,
          description: `Niezgodność i len=0. LPS[${i}] = 0`,
        });

        i++;
      }
    }
  }

  steps.push({
    type: "lps-done",
    pattern,
    lps: [...lps],
    i: null,
    len: null,
    description: `Tablica LPS gotowa: [${lps.join(", ")}]`,
  });

  return { lps, steps };
}

/**
 * KMP search — generates steps for the search phase.
 * Returns full step array (LPS building + search).
 */
export function kmpSearchSteps(text, pattern) {
  const { lps, steps: lpsSteps } = buildLPSSteps(pattern);
  const steps = [...lpsSteps];

  const n = text.length;
  const m = pattern.length;
  const matches = [];

  steps.push({
    type: "search-start",
    text,
    pattern,
    lps,
    textIndex: 0,
    patternIndex: 0,
    matches: [],
    description: `Rozpoczęcie wyszukiwania wzorca "${pattern}" w tekście "${text}".`,
  });

  let i = 0; // index in text
  let j = 0; // index in pattern

  while (i < n) {
    steps.push({
      type: "search-compare",
      text,
      pattern,
      lps,
      textIndex: i,
      patternIndex: j,
      matches: [...matches],
      description: `Porównanie: text[${i}]='${text[i]}' z pattern[${j}]='${pattern[j]}'`,
    });

    if (text[i] === pattern[j]) {
      steps.push({
        type: "search-match",
        text,
        pattern,
        lps,
        textIndex: i,
        patternIndex: j,
        matches: [...matches],
        description: `Zgodność na pozycji text[${i}]='${text[i]}'.`,
      });

      i++;
      j++;

      if (j === m) {
        // Full match found
        const matchStart = i - j;
        matches.push(matchStart);

        steps.push({
          type: "search-found",
          text,
          pattern,
          lps,
          textIndex: i,
          patternIndex: j,
          matchStart,
          matches: [...matches],
          description: `Wzorzec znaleziony na pozycji ${matchStart}!`,
        });

        j = lps[j - 1];
      }
    } else {
      if (j !== 0) {
        const oldJ = j;
        j = lps[j - 1];

        steps.push({
          type: "search-mismatch",
          text,
          pattern,
          lps,
          textIndex: i,
          patternIndex: j,
          matches: [...matches],
          description: `Niezgodność. Przesunięcie wzorca: j = LPS[${oldJ - 1}] = ${j}`,
        });
      } else {
        steps.push({
          type: "search-mismatch",
          text,
          pattern,
          lps,
          textIndex: i,
          patternIndex: j,
          matches: [...matches],
          description: `Niezgodność i j=0. Przesunięcie w tekście: i = ${i + 1}`,
        });

        i++;
      }
    }
  }

  steps.push({
    type: "search-done",
    text,
    pattern,
    lps,
    textIndex: n,
    patternIndex: j,
    matches: [...matches],
    description:
      matches.length > 0
        ? `Wyszukiwanie zakończone. Znaleziono ${matches.length} wystąpień na pozycjach: [${matches.join(", ")}].`
        : `Wyszukiwanie zakończone. Wzorzec nie został znaleziony.`,
  });

  return steps;
}
