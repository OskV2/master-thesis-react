import { create } from "zustand";

/**
 * Quiz store — manages test sessions, questions, answers, and results.
 */
export const useQuizStore = create((set, get) => ({
  // Current quiz state
  isActive: false,
  currentQuestionIndex: 0,
  questions: [],
  answers: [], // user's answers indexed by question
  score: null,

  // Settings
  selectedAlgorithms: [], // which algorithms to test
  questionCount: 10,

  // Actions
  setSelectedAlgorithms: (algorithms) =>
    set({ selectedAlgorithms: algorithms }),
  setQuestionCount: (count) => set({ questionCount: count }),

  startQuiz: (questions) =>
    set({
      isActive: true,
      questions,
      answers: new Array(questions.length).fill(null),
      currentQuestionIndex: 0,
      score: null,
    }),

  answerQuestion: (questionIndex, answer) => {
    const answers = [...get().answers];
    answers[questionIndex] = answer;
    set({ answers });
  },

  nextQuestion: () => {
    const { currentQuestionIndex, questions } = get();
    if (currentQuestionIndex < questions.length - 1) {
      set({ currentQuestionIndex: currentQuestionIndex + 1 });
    }
  },

  prevQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      set({ currentQuestionIndex: currentQuestionIndex - 1 });
    }
  },

  goToQuestion: (index) => set({ currentQuestionIndex: index }),

  finishQuiz: () => {
    const { questions, answers } = get();
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) correct++;
    });
    set({
      isActive: false,
      score: {
        correct,
        total: questions.length,
        percentage: Math.round((correct / questions.length) * 100),
      },
    });
  },

  resetQuiz: () =>
    set({
      isActive: false,
      currentQuestionIndex: 0,
      questions: [],
      answers: [],
      score: null,
    }),
}));
