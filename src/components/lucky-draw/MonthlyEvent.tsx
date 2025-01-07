import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { calculateLuckyDrawAmount } from "@/utils/luckyDrawCalculations";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TicketPurchaseDialog } from "./TicketPurchaseDialog";
import { getStoredTickets, getUserTickets } from "@/utils/ticketManagement";
import { TicketsList } from "./TicketsList";

interface MonthlyEventProps {
  totalAccumulation: number;
}

export const MonthlyEvent = ({ totalAccumulation: baseAmount }: MonthlyEventProps) => {
  const [countdown, setCountdown] = useState("");
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userTickets, setUserTickets] = useState([]);
  
  const eventDate = "2024-04-20T00:00:00";
  const { totalAccumulation, monthlyEarnings } = calculateLuckyDrawAmount(baseAmount);
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId') || 'anonymous';
    const eventId = 'monthly_2024_04';
    const tickets = getUserTickets(userId, eventId);
    setUserTickets(tickets);
    setIsEnrolled(tickets.length > 0);
  }, []);

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
            <div className="space-y-1">
              <p className="text-muted-foreground">
                Monthly Earnings: {formatNumber(monthlyEarnings)} Coins
              </p>
              <p className="text-muted-foreground">
                Total Prize Pool: {formatNumber(totalAccumulation)} Coins
              </p>
            </div>
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
      
      {isEnrolled ? (
        <TicketsList tickets={userTickets} />
      ) : (
        <TicketPurchaseDialog 
          onPurchaseComplete={() => setIsEnrolled(true)}
          setIsDialogOpen={setIsDialogOpen}
        />
      )}
    </Dialog>
  );
};