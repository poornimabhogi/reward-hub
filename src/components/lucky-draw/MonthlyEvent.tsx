import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
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

export const MonthlyEvent = ({ totalAccumulation }: MonthlyEventProps) => {
  const { toast } = useToast();
  const [countdown, setCountdown] = useState("");
  
  const eventDate = "2024-04-20T00:00:00";
  
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="bg-neutral rounded-xl cursor-pointer hover:bg-neutral/80 transition-colors p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-semibold">Monthly Lucky Draw</h3>
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div className="text-primary text-xl font-medium">
              4/20/2024
            </div>
            <p className="text-muted-foreground text-lg">
              Monthly prize pool from accumulated earnings!
            </p>
            <p className="text-primary text-lg font-medium">
              Time Remaining: {countdown}
            </p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Monthly Lucky Draw</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <p className="text-center text-lg">Monthly prize pool from accumulated earnings!</p>
          <div className="bg-neutral p-6 rounded-lg">
            <p className="font-semibold text-lg mb-2">Grand Prize</p>
            <p className="text-primary text-xl">{totalAccumulation} Coins Prize Pool</p>
          </div>
          <div className="bg-neutral p-6 rounded-lg">
            <p className="font-semibold text-lg mb-2">Time Remaining</p>
            <p className="text-primary text-xl">{countdown}</p>
          </div>
          <Button 
            className="w-full py-6 text-lg" 
            onClick={() => toast({
              title: "Reminder Set!",
              description: "We'll notify you when this event starts.",
            })}
          >
            Set Reminder
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};