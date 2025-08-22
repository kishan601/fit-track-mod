import { useState, useEffect } from "react";
import { Calendar, TrendingUp, Award, Target, Flame, Star } from "lucide-react";

interface DayData {
  day: string;
  workouts: number;
  calories: number;
  duration: number;
  achievement: 'exceeded' | 'met' | 'partial' | 'missed';
  percentage: number;
}

interface Workout {
  id: string;
  exerciseType: string;
  duration: number;
  intensity: string;
  workoutDate: string;
}

export function WeeklyProgress() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    const loadWorkouts = () => {
      try {
        const workoutData = localStorage.getItem('fittrack_workouts');
        if (workoutData) {
          const parsedWorkouts = JSON.parse(workoutData);
          setWorkouts(parsedWorkouts || []);
        } else {
          setWorkouts([]);
        }
      } catch (error) {
        console.error('Error loading workouts from localStorage:', error);
        setWorkouts([]);
      }
    };

    loadWorkouts();
    const interval = setInterval(loadWorkouts, 2000);
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'fittrack_workouts') {
        loadWorkouts();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const getLast7Days = (): DayData[] => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      const dayWorkouts = workouts.filter(workout => {
        const workoutDate = new Date(workout.workoutDate);
        return workoutDate.toDateString() === date.toDateString();
      });
      
      const workoutCount = dayWorkouts.length;
      const totalDuration = dayWorkouts.reduce((sum, w) => sum + w.duration, 0);
      const totalCalories = dayWorkouts.reduce((sum, w) => sum + getCaloriesPerMinute(w.exerciseType) * w.duration, 0);
      
      const dailyCalorieGoal = 300;
      const dailyWorkoutGoal = 1;

      let achievement: 'exceeded' | 'met' | 'partial' | 'missed';
      let percentage: number;

      if (totalCalories >= dailyCalorieGoal * 1.5 || workoutCount >= 2) {
        achievement = 'exceeded';
        percentage = Math.min(150, (totalCalories / dailyCalorieGoal) * 100);
      } else if (totalCalories >= dailyCalorieGoal || workoutCount >= dailyWorkoutGoal) {
        achievement = 'met';
        percentage = 100;
      } else if (totalCalories > 0 || workoutCount > 0) {
        achievement = 'partial';
        percentage = Math.max(25, (totalCalories / dailyCalorieGoal) * 100);
      } else {
        achievement = 'missed';
        percentage = 0;
      }

      days.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        workouts: workoutCount,
        calories: Math.round(totalCalories),
        duration: totalDuration,
        achievement,
        percentage: Math.min(percentage, 100)
      });
    }
    
    return days;
  };

  const getCaloriesPerMinute = (exerciseType: string): number => {
    const calorieMap: Record<string, number> = {
      'Running': 12,
      'Cycling': 8,
      'Swimming': 10,
      'Weight Training': 6,
      'Yoga': 3,
      'Walking': 4,
      'HIIT': 15,
      'Dancing': 7,
      'Hiking': 9,
      'Basketball': 11,
      'Boxing': 11,
      'Cardio': 10,
      'Strength': 6,
      'Gym': 8
    };
    return calorieMap[exerciseType] || 8;
  };

  const weekData = getLast7Days();

  const getAchievementStyles = (achievement: string) => {
    switch (achievement) {
      case 'exceeded':
        return {
          gradient: 'bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500',
          glow: 'shadow-xl shadow-yellow-400/50',
          icon: Flame,
          iconColor: 'text-yellow-100',
          bgColor: 'bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30',
          textColor: 'text-yellow-800 dark:text-yellow-200',
          borderColor: 'border-yellow-300 dark:border-yellow-700'
        };
      case 'met':
        return {
          gradient: 'bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500',
          glow: 'shadow-lg shadow-green-400/40',
          icon: Star,
          iconColor: 'text-green-100',
          bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30',
          textColor: 'text-green-800 dark:text-green-200',
          borderColor: 'border-green-300 dark:border-green-700'
        };
      case 'partial':
        return {
          gradient: 'bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-500',
          glow: 'shadow-lg shadow-blue-400/40',
          icon: TrendingUp,
          iconColor: 'text-blue-100',
          bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30',
          textColor: 'text-blue-800 dark:text-blue-200',
          borderColor: 'border-blue-300 dark:border-blue-700'
        };
      default:
        return {
          gradient: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500',
          glow: '',
          icon: Calendar,
          iconColor: 'text-gray-100',
          bgColor: 'bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50',
          textColor: 'text-gray-600 dark:text-gray-400',
          borderColor: 'border-gray-300 dark:border-gray-700'
        };
    }
  };

  const weeklyStats = {
    totalWorkouts: weekData.reduce((sum, day) => sum + day.workouts, 0),
    totalCalories: weekData.reduce((sum, day) => sum + day.calories, 0),
    totalDuration: weekData.reduce((sum, day) => sum + day.duration, 0),
    achievedDays: weekData.filter(day => day.achievement === 'met' || day.achievement === 'exceeded').length
  };

  return (
    <div className="space-y-6">
      {/* Beautiful Week Overview */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Weekly Journey
            </h3>
            <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Your progress story ✨</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 px-4 py-2 rounded-2xl text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700">
          <Calendar className="w-4 h-4" />
          Last 7 days
        </div>
      </div>

      {/* Gorgeous Stats Overview */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="group bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30 p-5 rounded-2xl text-center hover:scale-105 transition-all duration-300 shadow-lg border border-blue-200/50 dark:border-blue-700/50">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-lg">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {weeklyStats.totalWorkouts}
          </div>
          <div className="text-sm text-blue-600/80 dark:text-blue-400/80 font-medium">
            Workouts
          </div>
        </div>
        
        <div className="group bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/30 dark:via-emerald-900/30 dark:to-teal-900/30 p-5 rounded-2xl text-center hover:scale-105 transition-all duration-300 shadow-lg border border-green-200/50 dark:border-green-700/50">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-lg">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {Math.round(weeklyStats.totalCalories)}
          </div>
          <div className="text-sm text-green-600/80 dark:text-green-400/80 font-medium">
            Calories
          </div>
        </div>
        
        <div className="group bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-rose-900/30 p-5 rounded-2xl text-center hover:scale-105 transition-all duration-300 shadow-lg border border-purple-200/50 dark:border-purple-700/50">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-lg">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {Math.round(weeklyStats.totalDuration)}m
          </div>
          <div className="text-sm text-purple-600/80 dark:text-purple-400/80 font-medium">
            Minutes
          </div>
        </div>
      </div>

      {/* Stunning Daily Progress Chart */}
      <div className="space-y-4">
        <h4 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-500" />
          Daily Progress
        </h4>
        
        <div className="grid grid-cols-7 gap-2">
          {weekData.map((day, index) => {
            const styles = getAchievementStyles(day.achievement);
            const IconComponent = styles.icon;
            
            return (
              <div key={index} className="text-center group">
                <div className={`relative ${styles.bgColor} p-3 rounded-2xl transition-all duration-300 hover:scale-105 ${styles.glow} border ${styles.borderColor}`}>
                  {/* Beautiful Progress Bar */}
                  <div className="relative h-20 w-full bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden mb-3">
                    <div 
                      className={`absolute bottom-0 w-full ${styles.gradient} transition-all duration-700 ease-out ${styles.glow}`}
                      style={{ height: `${day.percentage}%` }}
                    />
                    {day.achievement !== 'missed' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <IconComponent className={`w-4 h-4 ${styles.iconColor}`} />
                      </div>
                    )}
                  </div>
                  
                  {/* Day Stats */}
                  <div className="space-y-1">
                    <div className={`text-xs font-bold ${styles.textColor}`}>
                      {day.day}
                    </div>
                    <div className={`text-xs ${styles.textColor}`}>
                      {day.workouts}w • {day.calories}cal
                    </div>
                    {day.duration > 0 && (
                      <div className={`text-xs ${styles.textColor}`}>
                        {day.duration}min
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievement Summary */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-4 rounded-2xl border border-indigo-200/50 dark:border-indigo-700/50">
        <div className="text-center">
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {weeklyStats.achievedDays}/7
          </div>
          <div className="text-sm text-indigo-600/80 dark:text-indigo-400/80 font-medium">
            Days with goals achieved
          </div>
        </div>
      </div>
    </div>
  );
}