import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { calculateLuckyDrawAmount } from "@/utils/luckyDrawCalculations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface MonthlyEventProps {
  totalAccumulation: number;
}

export const MonthlyEvent = ({ totalAccumulation: baseAmount }: MonthlyEventProps) => {
  const { toast } = useToast();
  const [countdown, setCountdown] = useState("");
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const eventDate = "2024-04-20T00:00:00";
  const { totalAccumulation } = calculateLuckyDrawAmount(baseAmount);
  const luckyAmount = Math.floor(totalAccumulation * 0.1); // 10% of total accumulation
  
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  useEffect(() => {
    const updateCountdown = () => {
      const targetDate = new Date(eventDate);
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else {
        setCountdown("Event Started!");
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleEnroll = async () => {
    try {
      // Here we'll make an API call to store the user's enrollment
      // For now, we'll simulate the enrollment
      setIsEnrolled(true);
      setIsDialogOpen(false);
      toast({
        title: "Successfully Enrolled!",
        description: "You're now registered for the monthly lucky draw.",
      });
    } catch (error) {
      toast({
        title: "Enrollment Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <div className="bg-neutral rounded-lg cursor-pointer hover:bg-neutral/80 transition-colors p-4 mb-4">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold">Monthly Lucky Draw</h3>
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div className="text-primary font-medium">
              4/20/2024
            </div>
            <p className="text-muted-foreground">
              Monthly prize pool: {formatNumber(totalAccumulation)} Coins
            </p>
            <p className="text-primary font-medium">
              Time Remaining: {countdown}
            </p>
            {isEnrolled && (
              <div className="bg-success/10 text-success px-3 py-1 rounded-full text-sm">
                Enrolled
              </div>
            )}
          </div>
        </div>
      </DialogTrigger>
      {!isEnrolled && (
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Monthly Lucky Draw</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-center">Monthly prize pool from accumulated earnings!</p>
            <div className="bg-neutral p-4 rounded-lg">
              <p className="font-semibold">Grand Prize</p>
              <p className="text-primary">{formatNumber(totalAccumulation)} Coins Prize Pool</p>
            </div>
            <div className="bg-neutral p-4 rounded-lg">
              <p className="font-semibold">Lucky Amount</p>
              <p className="text-primary">{formatNumber(luckyAmount)} Coins per Winner</p>
            </div>
            <div className="bg-neutral p-4 rounded-lg">
              <p className="font-semibold">Time Remaining</p>
              <p className="text-primary">{countdown}</p>
            </div>
            <Button 
              className="w-full" 
              onClick={handleEnroll}
            >
              Enroll Now
            </Button>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};