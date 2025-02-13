import { useState } from "react";
import { Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { createCheckoutSession } from "@/utils/stripe";
import { useQuery } from "@tanstack/react-query";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTicket, storeTicket } from "@/utils/ticketManagement";

interface TicketPurchaseDialogProps {
  onPurchaseComplete: () => void;
  setIsDialogOpen: (open: boolean) => void;
}

export const TicketPurchaseDialog = ({ 
  onPurchaseComplete, 
  setIsDialogOpen 
}: TicketPurchaseDialogProps) => {
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'coins'>('cash');
  const [ticketQuantity, setTicketQuantity] = useState("1");
  
  const TICKET_PRICE_CASH = 1;
  const TICKET_PRICE_COINS = 50;

  // Fetch actual reward balance
  const { data: userCoins = 0, isLoading: isLoadingRewards } = useQuery({
    queryKey: ['rewards', 'balance'],
    queryFn: async () => {
      const response = await fetch('/api/rewards/balance', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch rewards');
      }
      const data = await response.json();
      return data;
    },
  });

  const handlePurchaseWithCoins = async () => {
    const totalCost = parseInt(ticketQuantity) * TICKET_PRICE_COINS;
    if (userCoins >= totalCost) {
      try {
        // Deduct coins using the rewards API
        const response = await fetch('/api/rewards/spend', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: totalCost,
            reason: `Purchased ${ticketQuantity} lucky draw ticket(s)`,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to spend coins');
        }
        
        // Create and store tickets
        const userId = localStorage.getItem('userId') || 'anonymous';
        const eventId = 'monthly_2024_04';
        
        for (let i = 0; i < parseInt(ticketQuantity); i++) {
          const ticket = createTicket(userId, eventId);
          storeTicket(ticket);
        }
        
        onPurchaseComplete();
        setIsDialogOpen(false);
        toast({
          title: "Successfully Enrolled!",
          description: `Purchased ${ticketQuantity} ticket(s) for ${totalCost} coins.`,
        });
      } catch (error) {
        toast({
          title: "Purchase Failed",
          description: "Failed to complete the purchase. Please try again.",
          variant: "destructive",
        });
      }
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
      onPurchaseComplete();
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
                      : `${num * TICKET_PRICE_COINS} coins`
                  }
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {paymentMethod === 'coins' && (
          <div className="flex items-center gap-2 text-sm">
            <Coins className="h-4 w-4" />
            {isLoadingRewards ? (
              <span className="animate-pulse">Loading balance...</span>
            ) : (
              <span>Your balance: {userCoins} coins</span>
            )}
          </div>
        )}

        <Button 
          className="w-full" 
          onClick={handlePurchase}
          disabled={isLoadingRewards}
        >
          Purchase Tickets
        </Button>
      </div>
    </DialogContent>
  );
};