import { useState } from "react";
import { useTheme } from "./theme-provider";
import { Moon, Sun, Menu, X, BarChart3, Activity, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="bg-white/20 dark:bg-gray-900/20 backdrop-blur-xl border-b border-white/20 dark:border-gray-800/20 sticky top-0 z-50 transition-all duration-300 shadow-lg shadow-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3 animate-fade-in">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Activity className="text-white text-lg" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-sky-500 bg-clip-text text-transparent">
                FitTrack
              </h1>
              <p className="text-xs text-muted-foreground">
                Your Fitness Journey
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-1">
            <Button
              variant="ghost"
              className="px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 font-medium transition-all duration-200 hover:bg-blue-100 dark:hover:bg-blue-600/30"
              data-testid="nav-dashboard"
            >
              <BarChart3 className="mr-2" size={16} />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className="px-4 py-2 rounded-lg text-muted-foreground font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
              data-testid="nav-workouts"
            >
              <Activity className="mr-2" size={16} />
              Workouts
            </Button>
            <Button
              variant="ghost"
              className="px-4 py-2 rounded-lg text-muted-foreground font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
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
              className="p-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent/80 transition-all duration-200 transform hover:scale-105 group"
              data-testid="button-theme-toggle"
            >
              <Moon
                className="dark:hidden text-lg group-hover:rotate-12 transition-transform"
                size={18}
              />
              <Sun
                className="hidden dark:inline text-lg group-hover:rotate-12 transition-transform text-yellow-400"
                size={18}
              />
            </Button>
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg bg-white/20 dark:bg-gray-800/20 text-foreground hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all duration-200 transform hover:scale-105"
                data-testid="button-mobile-menu"
              >
                {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-white/20 dark:border-gray-800/20 shadow-xl animate-slide-down">
            <div className="px-4 py-6 space-y-3">
              <Button
                variant="ghost"
                className="w-full justify-start px-4 py-3 rounded-lg bg-blue-50/50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 font-medium transition-all duration-200 hover:bg-blue-100/50 dark:hover:bg-blue-600/30"
                data-testid="mobile-nav-dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BarChart3 className="mr-3" size={18} />
                Dashboard
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start px-4 py-3 rounded-lg text-muted-foreground font-medium transition-all duration-200 hover:bg-white/50 dark:hover:bg-gray-800/50 hover:text-foreground"
                data-testid="mobile-nav-workouts"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Activity className="mr-3" size={18} />
                Workouts
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start px-4 py-3 rounded-lg text-muted-foreground font-medium transition-all duration-200 hover:bg-white/50 dark:hover:bg-gray-800/50 hover:text-foreground"
                data-testid="mobile-nav-progress"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Trophy className="mr-3" size={18} />
                Progress
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
