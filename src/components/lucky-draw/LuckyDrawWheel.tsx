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
      <div className="relative w-80 h-80 mx-auto mb-8">
        <div 
          className={`absolute inset-0 rounded-full border-4 border-primary flex items-center justify-center ${
            isSpinning ? 'animate-spin' : ''
          }`}
        >
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
        className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg rounded-xl"
      >
        {isSpinning ? "Spinning..." : "Spin (10 coins)"}
      </Button>
    </div>
  );
};