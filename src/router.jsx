import {
  createRouter,
  createRoute,
  createRootRoute,
} from "@tanstack/react-router";

import RootLayout from "@/components/layout/RootLayout";
import HomePage from "@/pages/HomePage";
import AlgorithmPage from "@/pages/AlgorithmPage";
import QuizPage from "@/pages/QuizPage";

// Root route with layout
const rootRoute = createRootRoute({
  component: RootLayout,
});

// Home — algorithm catalog
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

// Algorithm visualization
const algorithmRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/algorithm/$slug",
  component: AlgorithmPage,
});

// Quiz module
const quizRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/quiz",
  component: QuizPage,
});

// Build route tree
const routeTree = rootRoute.addChildren([homeRoute, algorithmRoute, quizRoute]);

// Create router instance
export const router = createRouter({ routeTree });
