import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronRight, Clock, Flame, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import type { Workout } from "@shared/schema";

const exerciseIcons: Record<string, string> = {
  running: "🏃‍♂️",
  strength: "💪",
  yoga: "🧘‍♀️",
  cycling: "🚴‍♂️",
  swimming: "🏊‍♂️",
  hiit: "⚡",
};

const exerciseColors: Record<string, string> = {
  running: "from-coral-500 to-coral-600",
  strength: "from-teal-500 to-teal-600",
  yoga: "from-accent to-blue-600",
  cycling: "from-teal-500 to-teal-600",
  swimming: "from-accent to-blue-600",
  hiit: "from-success to-green-600",
};

const intensityColors: Record<string, string> = {
  low: "bg-accent/20 text-accent",
  medium: "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400",
  high: "bg-coral-100 dark:bg-coral-900/30 text-coral-600 dark:text-coral-400",
};

export function RecentActivities() {
  const [editingCalories, setEditingCalories] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const queryClient = useQueryClient();
  
  const { data: workouts, isLoading } = useQuery<Workout[]>({
    queryKey: ["/api/workouts"],
  });

  const updateCaloriesMutation = useMutation({
    mutationFn: async ({ workoutId, calories }: { workoutId: string; calories: number }) => {
      return apiRequest("PATCH", `/api/workouts/${workoutId}`, { calories });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/workouts/weekly"] });
      setEditingCalories(null);
      setEditValue("");
    },
  });

  const startEditCalories = (workoutId: string, currentCalories: number) => {
    setEditingCalories(workoutId);
    setEditValue(currentCalories.toString());
  };

  const saveCalories = (workoutId: string) => {
    const calories = parseInt(editValue);
    if (calories && calories > 0) {
      updateCaloriesMutation.mutate({ workoutId, calories });
    }
  };

  const cancelEdit = () => {
    setEditingCalories(null);
    setEditValue("");
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return "Yesterday";
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-card rounded-2xl p-6 border border-gray-200 dark:border-border shadow-lg animate-slide-up">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-2" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-slate-200 dark:bg-slate-700 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const recentWorkouts = workouts || [];

  return (
    <div className="bg-white dark:bg-card rounded-2xl p-6 border border-gray-200 dark:border-border shadow-lg animate-slide-up" style={{ animationDelay: "0.2s" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-1">Recent Activities</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Your latest workouts</p>
        </div>
        <Button
          variant="ghost"
          className="px-4 py-2 bg-coral-50 dark:bg-coral-900/20 text-coral-600 dark:text-coral-400 rounded-lg hover:bg-coral-100 dark:hover:bg-coral-900/30 transition-colors text-sm font-medium"
          data-testid="button-view-all-activities"
        >
          View All
        </Button>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto pr-2 beautiful-scrollbar">
        {recentWorkouts.length === 0 ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <p>No workouts yet. Add your first workout to get started!</p>
          </div>
        ) : (
          recentWorkouts.map((workout) => (
            <div
              key={workout.id}
              className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all duration-200 group cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
              data-testid={`activity-item-${workout.id}`}
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${exerciseColors[workout.exerciseType] || exerciseColors.running} rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200`}>
                <span className="text-lg">{exerciseIcons[workout.exerciseType] || "💪"}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-50 truncate capitalize">
                    {workout.exerciseType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </h4>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {formatTimeAgo(new Date(workout.date))}
                  </span>
                </div>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    <Clock className="inline mr-1" size={12} />
                    {workout.duration} min
                  </span>
                  <div className="flex items-center space-x-1">
                    {editingCalories === workout.id ? (
                      <div className="flex items-center space-x-1">
                        <Flame className="text-slate-600 dark:text-slate-400" size={12} />
                        <Input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-16 h-6 text-xs p-1"
                          min="1"
                          data-testid={`input-calories-${workout.id}`}
                        />
                        <span className="text-xs text-slate-600 dark:text-slate-400">cal</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 hover:bg-green-100 dark:hover:bg-green-900/30"
                          onClick={() => saveCalories(workout.id)}
                          disabled={updateCaloriesMutation.isPending}
                          data-testid={`button-save-calories-${workout.id}`}
                        >
                          <Check size={12} className="text-green-600" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900/30"
                          onClick={cancelEdit}
                          data-testid={`button-cancel-calories-${workout.id}`}
                        >
                          <X size={12} className="text-red-600" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          <Flame className="inline mr-1" size={12} />
                          {workout.calories} cal
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 hover:bg-slate-100 dark:hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => startEditCalories(workout.id, workout.calories)}
                          data-testid={`button-edit-calories-${workout.id}`}
                        >
                          <Edit2 size={10} className="text-slate-500" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${intensityColors[workout.intensity]}`}>
                    {workout.intensity.charAt(0).toUpperCase() + workout.intensity.slice(1)}
                  </span>
                </div>
              </div>
              <ChevronRight
                className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors"
                size={16}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
