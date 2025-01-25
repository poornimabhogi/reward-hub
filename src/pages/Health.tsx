import { useState, useEffect } from "react";
import { Activity, Dumbbell, Heart, Thermometer, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { updateUserEarnings } from "@/utils/earningsTracker";

interface FitnessData {
  steps: number;
  calories: number;
  heartRate: number;
  waterIntake: number;
  dailyRewardClaimed: boolean;
}

const Health = () => {
  const { toast } = useToast();
  const [fitnessData, setFitnessData] = useState<FitnessData>({
    steps: 0,
    calories: 0,
    heartRate: 72,
    waterIntake: 0,
    dailyRewardClaimed: false,
  });

  // Check and reward steps achievement
  useEffect(() => {
    if (fitnessData.steps >= 10000 && !fitnessData.dailyRewardClaimed) {
      const userId = localStorage.getItem('userId') || 'anonymous';
      updateUserEarnings(userId, 50); // Award 50 coins for completing daily steps
      
      toast({
        title: "Congratulations! 🎉",
        description: "You've reached 10,000 steps! Earned 50 coins!",
      });
      
      setFitnessData(prev => ({
        ...prev,
        dailyRewardClaimed: true
      }));
    }
  }, [fitnessData.steps, toast]);

  // Simulate pedometer functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setFitnessData(prev => ({
        ...prev,
        steps: prev.steps + Math.floor(Math.random() * 10),
        calories: Math.floor(prev.steps * 0.04),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const addWaterIntake = () => {
    setFitnessData(prev => ({
      ...prev,
      waterIntake: prev.waterIntake + 250,
    }));
    toast({
      title: "Water intake logged",
      description: "Added 250ml of water to your daily intake",
    });
  };

  return (
    <div className="container mx-auto px-4 pb-24 space-y-6">
      <h1 className="text-2xl font-bold mt-4">Health Dashboard</h1>

      {/* Steps Progress with Reward Status */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Activity className="text-primary h-5 w-5" />
            <h3 className="font-semibold">Steps</h3>
          </div>
          {fitnessData.dailyRewardClaimed && (
            <div className="flex items-center gap-1 text-green-500">
              <Trophy className="h-4 w-4" />
              <span className="text-sm">Reward Claimed</span>
            </div>
          )}
        </div>
        <p className="text-2xl font-bold">{fitnessData.steps}</p>
        <Progress value={(fitnessData.steps / 10000) * 100} className="mt-2" />
        <p className="text-sm text-muted-foreground mt-1">
          Goal: 10,000 steps {fitnessData.steps >= 10000 ? '(Completed!)' : ''}
        </p>
      </div>

      {/* Water Intake */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Thermometer className="text-blue-500 h-5 w-5" />
            <h3 className="font-semibold">Water Intake</h3>
          </div>
          <Button onClick={addWaterIntake} size="sm">Add Water</Button>
        </div>
        <p className="text-2xl font-bold">{fitnessData.waterIntake}ml</p>
        <Progress value={(fitnessData.waterIntake / 2000) * 100} className="mt-2" />
        <p className="text-sm text-muted-foreground mt-1">Daily Goal: 2000ml</p>
      </div>

      {/* Workout Section */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-2 mb-4">
          <Dumbbell className="text-primary h-5 w-5" />
          <h3 className="font-semibold">Personal Trainer</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
            <span className="text-lg font-semibold">Daily Workout</span>
            <span className="text-sm text-muted-foreground">20 min routine</span>
          </Button>
          <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
            <span className="text-lg font-semibold">Meal Plan</span>
            <span className="text-sm text-muted-foreground">View today's meals</span>
          </Button>
        </div>
      </div>

      {/* Calories */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="text-green-500 h-5 w-5" />
          <h3 className="font-semibold">Calories Burned</h3>
        </div>
        <p className="text-2xl font-bold">{fitnessData.calories} kcal</p>
        <Progress value={(fitnessData.calories / 500) * 100} className="mt-2" />
        <p className="text-sm text-muted-foreground mt-1">Daily Goal: 500 kcal</p>
      </div>
    </div>
  );
};

export default Health;