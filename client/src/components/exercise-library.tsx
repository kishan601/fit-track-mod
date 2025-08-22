import { useQuery } from "@tanstack/react-query";
import { Book, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Exercise } from "@shared/schema";

export function ExerciseLibrary() {
  const { data: exercises, isLoading } = useQuery<Exercise[]>({
    queryKey: ["/api/exercises"],
  });

  if (isLoading) {
    return (
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl animate-slide-up">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-2" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-6" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-slate-200 dark:bg-slate-700 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const popularExercises = exercises?.slice(0, 4) || [];

  return (
    <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl animate-slide-up" style={{ animationDelay: "0.3s" }}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-accent to-blue-600 rounded-xl flex items-center justify-center">
          <Book className="text-white" size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">Quick Start</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Popular exercises</p>
        </div>
      </div>

      <div className="space-y-3">
        {popularExercises.length === 0 ? (
          <div className="text-center py-4 text-slate-500 dark:text-slate-400">
            <p className="text-sm">Loading exercises...</p>
          </div>
        ) : (
          popularExercises.map((exercise) => (
            <div
              key={exercise.id}
              className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all duration-200 cursor-pointer group"
              data-testid={`exercise-item-${exercise.name.toLowerCase().replace(' ', '-')}`}
            >
              <div className="flex items-center space-x-3">
                <div className="text-lg">{exercise.emoji}</div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-50 text-sm">
                    {exercise.name}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    ~{exercise.caloriesPerMinute} cal/min
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="p-2 text-slate-400 hover:text-coral-500 transition-colors group-hover:scale-110 transform duration-200"
                data-testid={`button-add-exercise-${exercise.name.toLowerCase().replace(' ', '-')}`}
              >
                <Plus size={14} />
              </Button>
            </div>
          ))
        )}
      </div>

      <Button
        variant="ghost"
        className="w-full mt-4 py-2 text-accent hover:text-accent/80 font-medium text-sm transition-colors"
        data-testid="button-browse-all-exercises"
      >
        Browse All Exercises <ArrowRight className="ml-1" size={14} />
      </Button>
    </div>
  );
}
