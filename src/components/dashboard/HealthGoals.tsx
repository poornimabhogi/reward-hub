import { Target, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

interface HealthGoal {
  id: number;
  title: string;
  current: number;
  target: number;
  unit: string;
}

interface HealthGoalsProps {
  goals: HealthGoal[];
}

export const HealthGoals = ({ goals }: HealthGoalsProps) => {
  const navigate = useNavigate();

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-semibold text-gray-700">Pending Goals</h3>
        <Button 
          variant="link" 
          onClick={() => navigate('/health')}
          className="flex items-center gap-2 text-primary hover:text-primary/90 p-0 h-auto font-normal text-base"
        >
          <Activity className="h-5 w-5" />
          View All
        </Button>
      </div>
      <div className="space-y-4">
        {goals.map((goal) => (
          <Card key={goal.id} className="border border-neutral shadow-none">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  <h4 className="text-xl text-gray-700">{goal.title}</h4>
                </div>
                <span className="text-gray-500">
                  {goal.current} / {goal.target} {goal.unit}
                </span>
              </div>
              <Progress 
                value={(goal.current / goal.target) * 100} 
                className="h-2 bg-primary/20"
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};