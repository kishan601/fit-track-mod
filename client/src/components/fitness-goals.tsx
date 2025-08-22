import { useQuery } from "@tanstack/react-query";
import { Target, Flame, Dumbbell, Clock } from "lucide-react";
import type { Workout } from "@shared/schema";

interface DailyStats {
  calories: { current: number; target: number };
  workouts: { current: number; target: number };
  activeTime: { current: number; target: number };
}

export function FitnessGoals() {
  const { data: workouts } = useQuery<Workout[]>({
    queryKey: ["/api/workouts"],
  });

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
      calories: { current: totalCalories, target: 600 },
      workouts: { current: todayWorkouts.length, target: 3 },
      activeTime: { current: totalDuration, target: 90 },
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
    <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl animate-slide-up" style={{ animationDelay: "0.2s" }}>
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
          <div key={goal.title} className="space-y-3" data-testid={`goal-${goal.title.toLowerCase().replace(' ', '-')}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 ${goal.bgColor} rounded-lg flex items-center justify-center`}>
                  <goal.icon className={`${goal.textColor} text-sm`} size={16} />
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-50">{goal.title}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {goal.current} / {goal.target} {goal.unit}
                  </p>
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
