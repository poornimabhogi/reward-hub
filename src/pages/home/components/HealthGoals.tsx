import { Progress } from "@/components/ui/progress";

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
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-sm font-medium mb-3">Health Goals</h3>
      <div className="space-y-4">
        {goals.map((goal) => (
          <div key={goal.id}>
            <div className="flex justify-between text-sm mb-1">
              <span>{goal.title}</span>
              <span>
                {goal.current} / {goal.target} {goal.unit}
              </span>
            </div>
            <Progress value={(goal.current / goal.target) * 100} />
          </div>
        ))}
      </div>
    </div>
  );
};