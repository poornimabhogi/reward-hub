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
        <div className="bg-neutral rounded-lg cursor-pointer hover:bg-neutral/80 transition-colors p-6">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Monthly Lucky Draw</h3>
              <div className="flex items-center gap-2 text-primary">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">4/20/2024</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Monthly prize pool from accumulated earnings!
            </p>
            <p className="text-sm text-primary">
              Time Remaining: {countdown}
            </p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Monthly Lucky Draw</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Monthly prize pool from accumulated earnings!</p>
          <div className="bg-neutral p-4 rounded-lg">
            <p className="font-semibold">Grand Prize</p>
            <p className="text-primary">{totalAccumulation} Coins Prize Pool</p>
          </div>
          <div className="bg-neutral p-4 rounded-lg">
            <p className="font-semibold">Time Remaining</p>
            <p className="text-primary">{countdown}</p>
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
  );
};