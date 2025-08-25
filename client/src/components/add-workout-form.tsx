import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const workoutSchema = z.object({
  exerciseType: z.string().min(1, "Please select an exercise type"),
  duration: z.coerce.number().min(1, "Duration must be at least 1 minute"),
  calories: z.coerce.number().min(1, "Calories must be at least 1"),
  intensity: z.enum(["low", "medium", "high"]),
  date: z.string().min(1, "Please select a date"),
  notes: z.string().optional(),
});

type WorkoutFormData = z.infer<typeof workoutSchema>;

const exerciseOptions = [
  { value: "Running", label: "🏃‍♂️ Running", emoji: "🏃‍♂️" },
  { value: "Weight Training", label: "💪 Weight Training", emoji: "💪" },
  { value: "Yoga", label: "🧘‍♀️ Yoga", emoji: "🧘‍♀️" },
  { value: "Cycling", label: "🚴‍♂️ Cycling", emoji: "🚴‍♂️" },
  { value: "Swimming", label: "🏊‍♂️ Swimming", emoji: "🏊‍♂️" },
  { value: "HIIT", label: "⚡ HIIT", emoji: "⚡" },
  { value: "Push-ups", label: "💪 Push-ups", emoji: "💪" },
  { value: "Pilates", label: "🤸‍♀️ Pilates", emoji: "🤸‍♀️" },
];

export function AddWorkoutForm() {
  const [selectedIntensity, setSelectedIntensity] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<WorkoutFormData>({
    resolver: zodResolver(workoutSchema),
    defaultValues: {
      exerciseType: "",
      duration: 0,
      calories: 0,
      intensity: "medium",
      date: new Date().toISOString().split("T")[0], // Today's date
      notes: "",
    },
  });

  const addWorkoutMutation = useMutation({
    mutationFn: async (data: WorkoutFormData) => {
      // FIXED: Proper date handling that preserves the user's selected date
      const selectedDate = new Date(data.date);
      selectedDate.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
      
      const workoutData = {
        ...data,
        date: selectedDate, // This will now correctly use the user's selected date
      };
      
      console.log('Submitting workout with date:', selectedDate.toISOString());
      console.log('Original form date:', data.date);
      
      const response = await apiRequest("POST", "/api/workouts", workoutData);
      return response.json();
    },
    onSuccess: () => {
      // Force invalidate specific queries with refetch
      queryClient.invalidateQueries({ queryKey: ['/api/workouts'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['/api/workouts/weekly'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['/api/goals'], refetchType: 'all' });
      toast({
        title: "Workout Added!",
        description: "Your workout has been successfully logged.",
      });
      form.reset({
        exerciseType: "",
        duration: 0,
        calories: 0,
        intensity: "medium",
        date: new Date().toISOString().split("T")[0],
        notes: "",
      });
      setSelectedIntensity("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add workout. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: WorkoutFormData) => {
    addWorkoutMutation.mutate(data);
  };

  const handleIntensitySelect = (intensity: string) => {
    setSelectedIntensity(intensity);
    form.setValue("intensity", intensity as "low" | "medium" | "high");
  };

  return (
    <div
      className="bg-white dark:bg-card rounded-2xl p-6 border border-gray-200 dark:border-border shadow-lg animate-slide-up"
      data-testid="add-workout-form"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-coral-500 to-coral-600 rounded-xl flex items-center justify-center">
          <Plus className="text-white" size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">
            Add Workout
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Log your latest session
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="exerciseType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Exercise Type
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent transition-all duration-200"
                      data-testid="select-exercise-type"
                    >
                      <SelectValue placeholder="Select exercise" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {exerciseOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Duration
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="45"
                        {...field}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent transition-all duration-200 pr-12"
                        data-testid="input-duration"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-slate-500 dark:text-slate-400">
                        min
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="calories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Calories
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="320"
                        {...field}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent transition-all duration-200 pr-12"
                        data-testid="input-calories"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-slate-500 dark:text-slate-400">
                        cal
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Date
                </FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent transition-all duration-200"
                    data-testid="input-date"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="intensity"
            render={() => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Intensity
                </FormLabel>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleIntensitySelect("low")}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedIntensity === "low"
                        ? "bg-yellow-50 text-yellow-600" // ← This should be YELLOW instead
                        : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-accent/20 hover:text-accent"
                    }`}
                    data-testid="button-intensity-low"
                  >
                    Low
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleIntensitySelect("medium")}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedIntensity === "medium"
                        ? "bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-teal-100 dark:hover:bg-teal-900/30"
                    }`}
                    data-testid="button-intensity-medium"
                  >
                    Medium
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleIntensitySelect("high")}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedIntensity === "high"
                        ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-coral-50 hover:text-coral-600"
                    }`}
                    data-testid="button-intensity-high"
                  >
                    High
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Notes (Optional)
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="How did it feel? Any observations..."
                    {...field}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent transition-all duration-200 resize-none"
                    data-testid="textarea-notes"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={addWorkoutMutation.isPending}
            className="w-full bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-coral-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
            data-testid="button-submit-workout"
          >
            {addWorkoutMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="mr-2" size={16} />
                Log Workout
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
