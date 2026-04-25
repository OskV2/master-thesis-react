import { Link, Outlet } from "@tanstack/react-router";
import { BookOpen, FlaskConical } from "lucide-react";

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="border-b border-slate-700/50 bg-surface-light/80 backdrop-blur-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center font-display font-bold text-sm text-white group-hover:bg-primary-500 transition-colors">
              AV
            </div>
            <span className="font-display font-semibold text-lg text-slate-100">
              AlgoViz
            </span>
          </Link>

          <div className="flex items-center gap-1">
            <Link
              to="/"
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-surface-lighter/50 transition-colors flex items-center gap-2"
              activeProps={{ className: "!text-white !bg-surface-lighter" }}
            >
              <BookOpen size={16} />
              Algorytmy
            </Link>
            <Link
              to="/quiz"
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-surface-lighter/50 transition-colors flex items-center gap-2"
              activeProps={{ className: "!text-white !bg-surface-lighter" }}
            >
              <FlaskConical size={16} />
              Testy
            </Link>
          </div>
        </nav>
      </header>

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 py-6 text-center text-sm text-slate-500">
        <p>
          Maciej Buszkiewicz, Praca magisterska
        </p>
      </footer>
    </div>
  );
}
