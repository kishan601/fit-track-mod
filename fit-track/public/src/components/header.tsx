import { useTheme } from "./theme-provider";
import { Sun, Moon, Zap, User } from "lucide-react";
import { Button } from "./ui/button";

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-poppins font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FitTrack
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full border-2 hover:scale-105 transition-all duration-200 hover:shadow-lg"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-blue-600" />
              )}
            </Button>

            <div className="flex items-center space-x-3 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 transition-colors duration-200">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Alex Johnson</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}