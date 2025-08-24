import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, User } from "lucide-react";

const registrationSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegistrationForm = z.infer<typeof registrationSchema>;

export function SaveProgressBanner() {
  const { isGuest, register, isRegistering } = useAuth();
  const [showRegistrationDialog, setShowRegistrationDialog] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const { toast } = useToast();

  const form = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Don't show banner if user is registered or has dismissed it
  if (!isGuest || bannerDismissed) {
    return null;
  }

  const handleRegistration = async (data: RegistrationForm) => {
    try {
      await register(data);
      setShowRegistrationDialog(false);
      form.reset();
      toast({
        title: "Account created successfully! ✨",
        description: "Your workout progress is now permanently saved to your account.",
      });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {/* Save Progress Banner */}
      <Card className="mb-6 bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-pink-500/10 border-violet-200 dark:border-violet-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-violet-500 to-pink-500 rounded-full">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Love tracking your fitness? 
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Create an account to save your progress across all devices!
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setBannerDismissed(true)}
                className="text-gray-500 hover:text-gray-700"
              >
                Maybe later
              </Button>
              <Button 
                onClick={() => setShowRegistrationDialog(true)}
                className="bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600"
                data-testid="button-save-progress"
              >
                <User className="w-4 h-4 mr-2" />
                Save My Progress
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Registration Dialog */}
      <Dialog open={showRegistrationDialog} onOpenChange={setShowRegistrationDialog}>
        <DialogContent data-testid="dialog-registration">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-violet-500" />
              <span>Create Your Account</span>
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleRegistration)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Choose a username" 
                        {...field} 
                        data-testid="input-username"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Create a secure password" 
                        {...field}
                        data-testid="input-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowRegistrationDialog(false)}
                  disabled={isRegistering}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isRegistering}
                  className="bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600"
                  data-testid="button-register"
                >
                  {isRegistering ? "Creating..." : "Create Account"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}