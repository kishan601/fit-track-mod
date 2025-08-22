import { useTheme } from "./theme-provider";
import { Moon, Sun, Menu, BarChart3, Activity, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3 animate-fade-in">
            <div className="w-10 h-10 bg-gradient-to-br from-coral-500 to-coral-600 rounded-xl flex items-center justify-center shadow-lg">
              <Activity className="text-white text-lg" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-coral-500 to-teal-500 bg-clip-text text-transparent">
                FitTrack
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Your Fitness Journey
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-1">
            <Button
              variant="ghost"
              className="px-4 py-2 rounded-lg bg-coral-50 dark:bg-coral-900/20 text-coral-600 dark:text-coral-400 font-medium transition-all duration-200 hover:bg-coral-100 dark:hover:bg-coral-900/30"
              data-testid="nav-dashboard"
            >
              <BarChart3 className="mr-2" size={16} />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 font-medium transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              data-testid="nav-workouts"
            >
              <Activity className="mr-2" size={16} />
              Workouts
            </Button>
            <Button
              variant="ghost"
              className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 font-medium transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              data-testid="nav-progress"
            >
              <Trophy className="mr-2" size={16} />
              Progress
            </Button>
          </nav>

          {/* Theme Toggle */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 transform hover:scale-105 group"
              data-testid="button-theme-toggle"
            >
              <Moon className="dark:hidden text-lg group-hover:rotate-12 transition-transform" size={18} />
              <Sun className="hidden dark:inline text-lg group-hover:rotate-12 transition-transform text-yellow-400" size={18} />
            </Button>
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                data-testid="button-mobile-menu"
              >
                <Menu size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
