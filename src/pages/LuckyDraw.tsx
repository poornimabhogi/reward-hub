import { useState } from "react";
import { Gift, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const LuckyDraw = () => {
  const { toast } = useToast();
  const [isSpinning, setIsSpinning] = useState(false);
  const [prize, setPrize] = useState<string | null>(null);

  const prizes = [
    "50% Off Coupon",
    "Free Shipping",
    "100 Bonus Coins",
    "Mystery Gift",
    "Buy 1 Get 1 Free",
    "Better Luck Next Time"
  ];

  const spinWheel = () => {
    setIsSpinning(true);
    setPrize(null);
    
    // Simulate wheel spinning
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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
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

          <div className="mt-8 pt-6 border-t">
            <h2 className="font-semibold mb-4">Previous Wins</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>50% Off Coupon - 2 days ago</p>
              <p>100 Bonus Coins - 5 days ago</p>
              <p>Mystery Gift - 1 week ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LuckyDraw;