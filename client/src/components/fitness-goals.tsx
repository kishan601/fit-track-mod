import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Target, Flame, Dumbbell, Clock, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import type { Workout } from "@shared/schema";

interface DailyStats {
  calories: { current: number; target: number };
  workouts: { current: number; target: number };
  activeTime: { current: number; target: number };
}

export function FitnessGoals() {
  const [editingTarget, setEditingTarget] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const queryClient = useQueryClient();
  
  const { data: workouts } = useQuery<Workout[]>({
    queryKey: ["/api/workouts"],
  });

  // For demo purposes, we'll use local state for targets
  const [targets, setTargets] = useState({
    calories: 600,
    workouts: 3,
    activeTime: 90
  });

  const startEditTarget = (goalType: string, currentTarget: number) => {
    setEditingTarget(goalType);
    setEditValue(currentTarget.toString());
  };

  const saveTarget = (goalType: string) => {
    const value = parseInt(editValue);
    if (value && value > 0) {
      setTargets(prev => ({ ...prev, [goalType]: value }));
      setEditingTarget(null);
      setEditValue("");
    }
  };

  const cancelEdit = () => {
    setEditingTarget(null);
    setEditValue("");
  };

  const getTodayStats = (): DailyStats => {
    if (!workouts) {
      return {
        calories: { current: 0, target: 600 },
        workouts: { current: 0, target: 3 },
        activeTime: { current: 0, target: 90 },
      };
    }

    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

    const todayWorkouts = workouts.filter(workout => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= todayStart && workoutDate < todayEnd;
    });

    const totalCalories = todayWorkouts.reduce((sum, workout) => sum + workout.calories, 0);
    const totalDuration = todayWorkouts.reduce((sum, workout) => sum + workout.duration, 0);

    return {
      calories: { current: totalCalories, target: targets.calories },
      workouts: { current: todayWorkouts.length, target: targets.workouts },
      activeTime: { current: totalDuration, target: targets.activeTime },
    };
  };

  const stats = getTodayStats();

  const getPercentage = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const getOverallProgress = () => {
    const caloriesPercent = getPercentage(stats.calories.current, stats.calories.target);
    const workoutsPercent = getPercentage(stats.workouts.current, stats.workouts.target);
    const activeTimePercent = getPercentage(stats.activeTime.current, stats.activeTime.target);
    
    return Math.round((caloriesPercent + workoutsPercent + activeTimePercent) / 3);
  };

  const goals = [
    {
      icon: Flame,
      title: "Calories Burned",
      current: stats.calories.current,
      target: stats.calories.target,
      unit: "cal",
      color: "coral",
      percentage: getPercentage(stats.calories.current, stats.calories.target),
      bgColor: "bg-coral-100 dark:bg-coral-900/30",
      textColor: "text-coral-500",
      gradientColor: "from-coral-500 to-coral-600",
    },
    {
      icon: Dumbbell,
      title: "Workouts",
      current: stats.workouts.current,
      target: stats.workouts.target,
      unit: "sessions",
      color: "teal",
      percentage: getPercentage(stats.workouts.current, stats.workouts.target),
      bgColor: "bg-teal-100 dark:bg-teal-900/30",
      textColor: "text-teal-500",
      gradientColor: "from-teal-500 to-teal-600",
    },
    {
      icon: Clock,
      title: "Active Time",
      current: stats.activeTime.current,
      target: stats.activeTime.target,
      unit: "min",
      color: "accent",
      percentage: getPercentage(stats.activeTime.current, stats.activeTime.target),
      bgColor: "bg-accent/20",
      textColor: "text-accent",
      gradientColor: "from-accent to-blue-600",
    },
  ];

  return (
    <div className="bg-white dark:bg-card rounded-2xl p-6 border border-gray-200 dark:border-border shadow-lg animate-slide-up" style={{ animationDelay: "0.2s" }}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-success to-green-600 rounded-xl flex items-center justify-center">
          <Target className="text-white" size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">Today's Goals</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Track your daily targets</p>
        </div>
      </div>

      <div className="space-y-6">
        {goals.map((goal, index) => (
          <div key={goal.title} className="space-y-3 group" data-testid={`goal-${goal.title.toLowerCase().replace(' ', '-')}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 ${goal.bgColor} rounded-lg flex items-center justify-center`}>
                  <goal.icon className={`${goal.textColor} text-sm`} size={16} />
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-50">{goal.title}</p>
                  <div className="flex items-center space-x-1">
                    {editingTarget === goal.title.toLowerCase().replace(' ', '') ? (
                      <div className="flex items-center space-x-1">
                        <span className="text-sm text-slate-600 dark:text-slate-400">{goal.current} / </span>
                        <Input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-16 h-6 text-xs p-1"
                          min="1"
                          data-testid={`input-target-${goal.title.toLowerCase().replace(' ', '-')}`}
                        />
                        <span className="text-xs text-slate-600 dark:text-slate-400">{goal.unit}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 hover:bg-green-100 dark:hover:bg-green-900/30"
                          onClick={() => saveTarget(goal.title.toLowerCase().replace(' ', ''))}
                          data-testid={`button-save-target-${goal.title.toLowerCase().replace(' ', '-')}`}
                        >
                          <Check size={10} className="text-green-600" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900/30"
                          onClick={cancelEdit}
                          data-testid={`button-cancel-target-${goal.title.toLowerCase().replace(' ', '-')}`}
                        >
                          <X size={10} className="text-red-600" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {goal.current} / {goal.target} {goal.unit}
                        </p>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-5 w-5 p-0 hover:bg-slate-100 dark:hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => startEditTarget(goal.title.toLowerCase().replace(' ', ''), goal.target)}
                          data-testid={`button-edit-target-${goal.title.toLowerCase().replace(' ', '-')}`}
                        >
                          <Edit2 size={8} className="text-slate-500" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${goal.textColor}`}>{goal.percentage}%</p>
              </div>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div
                className={`bg-gradient-to-r ${goal.gradientColor} h-2 rounded-full animate-progress transition-all duration-1000`}
                style={{
                  width: `${goal.percentage}%`,
                  transformOrigin: "left",
                  animationDelay: `${index * 0.1}s`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600 dark:text-slate-400">Overall Progress</p>
          <p className="text-sm font-medium text-success">{getOverallProgress()}% Complete</p>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2">
          <div
            className="bg-gradient-to-r from-success to-green-600 h-2 rounded-full animate-progress"
            style={{
              width: `${getOverallProgress()}%`,
              transformOrigin: "left",
              animationDelay: "0.3s",
            }}
            data-testid="overall-progress-bar"
          />
        </div>
      </div>
    </div>
  );
}
