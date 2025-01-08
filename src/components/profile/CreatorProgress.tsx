import { Progress } from "@/components/ui/progress";
import { User } from "lucide-react";

interface CreatorProgressProps {
  totalViews: number;
  creatorLevel: 'beginner' | 'bronze' | 'silver' | 'gold';
  reelsCount: number;
}

export const CreatorProgress = ({ totalViews, creatorLevel, reelsCount }: CreatorProgressProps) => {
  const getNextLevelThreshold = () => {
    switch (creatorLevel) {
      case 'beginner':
        return 1000;
      case 'bronze':
        return 5000;
      case 'silver':
        return 20000;
      case 'gold':
        return Infinity;
    }
  };

  const getProgress = () => {
    const nextThreshold = getNextLevelThreshold();
    const prevThreshold = creatorLevel === 'beginner' ? 0 :
      creatorLevel === 'bronze' ? 1000 :
      creatorLevel === 'silver' ? 5000 : 20000;

    if (nextThreshold === Infinity) return 100;
    
    const progress = ((totalViews - prevThreshold) / (nextThreshold - prevThreshold)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const getNextLevel = () => {
    switch (creatorLevel) {
      case 'beginner':
        return 'Bronze';
      case 'bronze':
        return 'Silver';
      case 'silver':
        return 'Gold';
      case 'gold':
        return 'Max Level';
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white shadow-sm">
      <div className="flex items-center gap-2">
        <User className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Creator Progress</h3>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="capitalize">{creatorLevel} Creator</span>
          <span>{getNextLevel()}</span>
        </div>
        <Progress value={getProgress()} className="h-2" />
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Total Views</p>
          <p className="font-semibold">{totalViews.toLocaleString()}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Reels Created</p>
          <p className="font-semibold">{reelsCount}</p>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        {creatorLevel !== 'gold' ? (
          <p>Need {(getNextLevelThreshold() - totalViews).toLocaleString()} more views to reach {getNextLevel()}</p>
        ) : (
          <p>You've reached the highest creator level!</p>
        )}
      </div>
    </div>
  );
};