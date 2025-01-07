import { useState, useEffect } from "react";
import { Calendar, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { calculateLuckyDrawAmount } from "@/utils/luckyDrawCalculations";
import { createCheckoutSession } from "@/utils/stripe";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MonthlyEventProps {
  totalAccumulation: number;
}

export const MonthlyEvent = ({ totalAccumulation: baseAmount }: MonthlyEventProps) => {
  const { toast } = useToast();
  const [countdown, setCountdown] = useState("");
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'coins'>('cash');
  const [ticketQuantity, setTicketQuantity] = useState("1");
  
  const eventDate = "2024-04-20T00:00:00";
  const { totalAccumulation, monthlyEarnings } = calculateLuckyDrawAmount(baseAmount);
  const luckyAmount = Math.floor(totalAccumulation * 0.1); // 10% of total accumulation
  
  const TICKET_PRICE_CASH = 5; // $5 per ticket
  const TICKET_PRICE_COINS = 500; // 500 coins per ticket
  const userCoins = parseInt(localStorage.getItem('userCoins') || '1000'); // Get user's coins
  
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

  const handlePurchaseWithCoins = () => {
    const totalCost = parseInt(ticketQuantity) * TICKET_PRICE_COINS;
    if (userCoins >= totalCost) {
      const remainingCoins = userCoins - totalCost;
      localStorage.setItem('userCoins', remainingCoins.toString());
      setIsEnrolled(true);
      setIsDialogOpen(false);
      toast({
        title: "Successfully Enrolled!",
        description: `Purchased ${ticketQuantity} ticket(s) for ${formatNumber(totalCost)} coins.`,
      });
    } else {
      toast({
        title: "Insufficient Coins",
        description: "You don't have enough coins to purchase these tickets.",
        variant: "destructive",
      });
    }
  };

  const handlePurchaseWithCash = async () => {
    try {
      await createCheckoutSession({
        name: "Lucky Draw Ticket",
        price: TICKET_PRICE_CASH,
        quantity: parseInt(ticketQuantity),
      });
      setIsEnrolled(true);
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: "Unable to process payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePurchase = () => {
    if (paymentMethod === 'coins') {
      handlePurchaseWithCoins();
    } else {
      handlePurchaseWithCash();
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
      {!isEnrolled && (
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Purchase Lucky Draw Tickets</DialogTitle>
            <DialogDescription>
              Choose your payment method and number of tickets
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Method</label>
              <Select value={paymentMethod} onValueChange={(value: 'cash' | 'coins') => setPaymentMethod(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash (${TICKET_PRICE_CASH}/ticket)</SelectItem>
                  <SelectItem value="coins">Coins ({TICKET_PRICE_COINS}/ticket)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Number of Tickets</label>
              <Select value={ticketQuantity} onValueChange={setTicketQuantity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'ticket' : 'tickets'} - {
                        paymentMethod === 'cash' 
                          ? `$${num * TICKET_PRICE_CASH}` 
                          : `${formatNumber(num * TICKET_PRICE_COINS)} coins`
                      }
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {paymentMethod === 'coins' && (
              <div className="flex items-center gap-2 text-sm">
                <Coins className="h-4 w-4" />
                <span>Your balance: {formatNumber(userCoins)} coins</span>
              </div>
            )}

            <Button 
              className="w-full" 
              onClick={handlePurchase}
            >
              Purchase Tickets
            </Button>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};