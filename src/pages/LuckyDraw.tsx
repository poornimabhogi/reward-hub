import { ArrowLeft, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { calculateLuckyDrawAmount } from "@/utils/luckyDrawCalculations";
import { LuckyDrawWheel } from "@/components/lucky-draw/LuckyDrawWheel";
import { MonthlyEvent } from "@/components/lucky-draw/MonthlyEvent";

const LuckyDraw = () => {
  const navigate = useNavigate();

  // Simulated monthly earnings (replace with actual data in production)
  const monthlyEarnings = 5000;
  const { totalAccumulation } = calculateLuckyDrawAmount(monthlyEarnings);

  const prizes = [
    "50% Off Coupon",
    "Free Shipping",
    "100 Bonus Coins",
    "Mystery Gift",
    "Buy 1 Get 1 Free",
    "Better Luck Next Time"
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-0"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <div className="bg-neutral/10 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2">
              <Coins className="h-5 w-5 text-yellow-500" />
              <span className="font-medium">Monthly Prize Pool: {totalAccumulation} Coins</span>
            </div>
          </div>

          <LuckyDrawWheel prizes={prizes} />

          <div className="mt-12 pt-6 border-t">
            <h2 className="text-xl font-semibold mb-6">Upcoming Events</h2>
            <div className="grid gap-4">
              <MonthlyEvent totalAccumulation={totalAccumulation} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LuckyDraw;