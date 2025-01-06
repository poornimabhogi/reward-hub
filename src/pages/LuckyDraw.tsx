import { useState, useEffect } from "react";
import { Gift, Trophy, Calendar, ArrowLeft, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { calculateLuckyDrawAmount } from "@/utils/luckyDrawCalculations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const LuckyDraw = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSpinning, setIsSpinning] = useState(false);
  const [prize, setPrize] = useState<string | null>(null);
  const [countdowns, setCountdowns] = useState<{ [key: number]: string }>({});

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

  const upcomingEvents = [
    {
      id: 1,
      title: "Monthly Lucky Draw",
      date: "2024-04-20T00:00:00",
      description: "Monthly prize pool from accumulated earnings!",
      prize: `${totalAccumulation} Coins Prize Pool`
    },
    {
      id: 2,
      title: "Holiday Special",
      date: "2024-12-25T00:00:00",
      description: "Special holiday draws with exclusive rewards",
      prize: "PS5"
    },
    {
      id: 3,
      title: "New Year Blast",
      date: "2024-12-31T00:00:00",
      description: "Biggest prizes of the year up for grabs",
      prize: "MacBook Pro"
    }
  ];

  useEffect(() => {
    const updateCountdowns = () => {
      const newCountdowns: { [key: number]: string } = {};
      
      upcomingEvents.forEach(event => {
        const targetDate = new Date(event.date);
        const now = new Date();
        const difference = targetDate.getTime() - now.getTime();
        
        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);
          
          newCountdowns[event.id] = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        } else {
          newCountdowns[event.id] = "Event Started!";
        }
      });
      
      setCountdowns(newCountdowns);
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000);

    return () => clearInterval(interval);
  }, []);

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
          <div className="flex justify-center mb-6">
            <Gift className="w-16 h-16 text-primary" />
          </div>

          <h1 className="text-2xl font-bold mb-4">Lucky Draw</h1>
          
          <div className="bg-neutral/10 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2">
              <Coins className="h-5 w-5 text-yellow-500" />
              <span className="font-medium">Monthly Prize Pool: {totalAccumulation} Coins</span>
            </div>
          </div>

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

          <div className="mt-12 pt-6 border-t">
            <h2 className="text-xl font-semibold mb-6">Upcoming Events</h2>
            <div className="grid gap-4">
              {upcomingEvents.map((event) => (
                <Dialog key={event.id}>
                  <DialogTrigger asChild>
                    <div className="bg-neutral p-4 rounded-lg cursor-pointer hover:bg-neutral/80 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{event.title}</h3>
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                          <p className="text-sm font-medium text-primary mt-2">
                            Time Remaining: {countdowns[event.id]}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-primary">
                          <Calendar className="w-4 h-4" />
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{event.title}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p>{event.description}</p>
                      <div className="bg-neutral p-4 rounded-lg">
                        <p className="font-semibold">Grand Prize</p>
                        <p className="text-primary">{event.prize}</p>
                      </div>
                      <div className="bg-neutral p-4 rounded-lg">
                        <p className="font-semibold">Time Remaining</p>
                        <p className="text-primary">{countdowns[event.id]}</p>
                      </div>
                      <Button onClick={() => toast({
                        title: "Reminder Set!",
                        description: "We'll notify you when this event starts.",
                      })}>
                        Set Reminder
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LuckyDraw;
