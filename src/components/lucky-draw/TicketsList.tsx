import { Button } from "@/components/ui/button";
import { Ticket, downloadTicket } from "@/utils/ticketManagement";
import { Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TicketsListProps {
  tickets: Ticket[];
}

export const TicketsList = ({ tickets }: TicketsListProps) => {
  const { toast } = useToast();

  const copyTicketId = (ticketId: string) => {
    navigator.clipboard.writeText(ticketId);
    toast({
      title: "Copied!",
      description: "Ticket ID copied to clipboard",
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Your Tickets</h3>
      {tickets.length === 0 ? (
        <p className="text-muted-foreground">No tickets purchased yet.</p>
      ) : (
        <div className="grid gap-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-card p-4 rounded-lg border flex items-center justify-between"
            >
              <div className="flex-1">
                <p className="font-medium">Ticket ID: {ticket.id}</p>
                <p className="text-sm text-muted-foreground">
                  Purchased: {new Date(ticket.purchaseDate).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyTicketId(ticket.id)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => downloadTicket(ticket)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};