import { useState } from "react";
import { Gift, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface LuckyDrawWheelProps {
  prizes: string[];
}

export const LuckyDrawWheel = ({ prizes }: LuckyDrawWheelProps) => {
  const { toast } = useToast();
  const [isSpinning, setIsSpinning] = useState(false);
  const [prize, setPrize] = useState<string | null>(null);

  const spinWheel = () => {
    setIsSpinning(true);
    setPrize(null);
    
    setTimeout(() => {
      const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
      setPrize(randomPrize);
      setIsSpinning(false);
      
      toast({
        title: "Congratulations! 🎉",
        description: `You won: ${randomPrize}`,
      });
    }, 2000);
  };

  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center mb-6">
        <Gift className="w-16 h-16 text-primary" />
      </div>

      <h1 className="text-2xl font-bold mb-4">Lucky Draw</h1>

      <p className="text-muted-foreground mb-8">
        Spin the wheel to win exciting prizes! Each spin costs 10 coins.
      </p>

      <div className="relative w-64 h-64 mx-auto mb-8">
        <div className={`absolute inset-0 rounded-full border-4 border-primary flex items-center justify-center ${isSpinning ? 'animate-spin' : ''}`}>
          {prize && !isSpinning && (
            <div className="text-center p-4">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="font-bold text-lg">{prize}</p>
            </div>
          )}
        </div>
      </div>

      <Button 
        onClick={spinWheel} 
        disabled={isSpinning}
        className="w-full max-w-xs mx-auto"
      >
        {isSpinning ? "Spinning..." : "Spin (10 coins)"}
      </Button>
    </div>
  );
};