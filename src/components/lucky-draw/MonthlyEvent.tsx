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
              Monthly prize pool from accumulated earnings!
            </p>
            <p className="text-primary font-medium">
              Time Remaining: {countdown}
            </p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Monthly Lucky Draw</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-center">Monthly prize pool from accumulated earnings!</p>
          <div className="bg-neutral p-4 rounded-lg">
            <p className="font-semibold">Grand Prize</p>
            <p className="text-primary">{totalAccumulation} Coins Prize Pool</p>
          </div>
          <div className="bg-neutral p-4 rounded-lg">
            <p className="font-semibold">Time Remaining</p>
            <p className="text-primary">{countdown}</p>
          </div>
          <Button 
            className="w-full" 
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