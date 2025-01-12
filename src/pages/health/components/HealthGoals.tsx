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
        <h3 className="text-lg font-semibold">Pending Goals</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/health')}
          className="flex items-center gap-2 text-primary"
        >
          <Activity className="h-4 w-4" />
          View All
        </Button>
      </div>
      <div className="space-y-3">
        {goals.map((goal) => (
          <Card key={goal.id} className="border border-neutral">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  <h4 className="font-medium">{goal.title}</h4>
                </div>
                <span className="text-sm text-muted-foreground">
                  {goal.current} / {goal.target} {goal.unit}
                </span>
              </div>
              <Progress 
                value={(goal.current / goal.target) * 100} 
                className="h-2"
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};