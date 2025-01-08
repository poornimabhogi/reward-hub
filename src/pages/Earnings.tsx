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
    <div className="min-h-screen bg-white">
      <div className="fixed inset-0 overflow-y-auto">
        <div className="container max-w-2xl mx-auto px-4 py-8 pb-24">
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
              <Card className="p-6 bg-white shadow-md">
                <h2 className="text-lg font-semibold mb-2">Total Earnings</h2>
                <p className="text-3xl font-bold text-primary">
                  {isLoading ? "Loading..." : `$${earningsData?.total || 0}`}
                </p>
              </Card>

              <Card className="p-6 bg-white shadow-md">
                <h2 className="text-lg font-semibold mb-2">Pending Payouts</h2>
                <p className="text-3xl font-bold text-primary">
                  {isLoadingPayouts ? "Loading..." : `$${pendingPayouts || 0}`}
                </p>
              </Card>
            </div>

            <Card className="p-6 bg-white shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <Info className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Creator Earnings Guide</h2>
              </div>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="earnings-structure">
                  <AccordionTrigger>Earnings Structure</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <p className="text-sm">We offer a simple and transparent earnings structure:</p>
                      <ul className="list-disc pl-4 space-y-1 text-sm">
                        <li>$5 per 1,000 views on your content</li>
                        <li>Example: A video with 20,000 views earns $100</li>
                        <li>Bonus: Additional $50 for viral hits (100,000+ views)</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="payment-info">
                  <AccordionTrigger>Payment Information</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm">
                      <p>Monthly payments are processed when:</p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>You reach the $100 minimum threshold</li>
                        <li>Your account is verified</li>
                        <li>Payment information is complete</li>
                      </ul>
                      <p className="mt-2 text-muted-foreground">Tip: Most creators reach $100 with 2-3 successful videos per month!</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="success-tips">
                  <AccordionTrigger>Tips for Success</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Post consistently (aim for 2-3 videos per week)</li>
                      <li>• Focus on quality content that engages viewers</li>
                      <li>• Engage with your audience to boost views</li>
                      <li>• Use trending topics and hashtags effectively</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earnings;