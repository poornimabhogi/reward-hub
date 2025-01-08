import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Earnings = () => {
  const navigate = useNavigate();

  const { data: earningsData, isLoading } = useQuery({
    queryKey: ['earnings'],
    queryFn: async () => {
      const response = await fetch('/api/earnings');
      if (!response.ok) {
        throw new Error('Failed to fetch earnings');
      }
      return response.json();
    },
  });

  const { data: pendingPayouts, isLoading: isLoadingPayouts } = useQuery({
    queryKey: ['pending-payouts'],
    queryFn: async () => {
      const response = await fetch('/api/earnings/pending');
      if (!response.ok) {
        throw new Error('Failed to fetch pending payouts');
      }
      return response.json();
    },
  });

  return (
    <div className="min-h-screen bg-white overflow-y-auto">
      <div className="container max-w-2xl mx-auto px-4 py-8 space-y-6">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Earnings Dashboard</h1>
            <p className="text-muted-foreground">Track your earnings and understand how you can maximize your revenue.</p>
          </div>

          <div className="grid gap-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-2">Total Earnings</h2>
              <p className="text-3xl font-bold text-primary">
                {isLoading ? "Loading..." : `$${earningsData?.total || 0}`}
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-2">Pending Payouts</h2>
              <p className="text-3xl font-bold text-primary">
                {isLoadingPayouts ? "Loading..." : `$${pendingPayouts || 0}`}
              </p>
            </Card>
          </div>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Info className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Monetization Rules</h2>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="revenue-share">
                <AccordionTrigger>Revenue Sharing</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <p className="text-sm">We believe in giving back to our creators! You'll receive 70% of all revenue generated from your content when you meet the monthly threshold.</p>
                    <p className="text-sm font-medium text-primary">Monthly Threshold: $100 in earnings</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="earnings-tiers">
                <AccordionTrigger>Earnings Per View</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 text-sm">
                    <li>• 1,000-5,000 views: $5 per reel</li>
                    <li>• 5,000-20,000 views: $15 per reel</li>
                    <li>• 20,000+ views: $30 per reel</li>
                    <li>• Viral bonus: Additional $50 for 100,000+ views</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="creator-levels">
                <AccordionTrigger>Creator Levels</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Bronze: Unlock at 1,000+ total views</li>
                    <li>• Silver: Unlock at 5,000+ total views</li>
                    <li>• Gold: Unlock at 20,000+ total views</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="payment-info">
                <AccordionTrigger>Payment Information</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-sm">
                    <p>Payments are processed monthly for creators who:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Generate at least $100 in monthly earnings</li>
                      <li>Have a verified account</li>
                      <li>Have completed their payment information</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Earnings;