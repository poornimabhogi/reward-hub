import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Info, TrendingUp, DollarSign, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState, useEffect } from "react";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// Helper function to handle API responses
const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const Earnings = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEnabled, setIsEnabled] = useState(false);

  // Get initial earnings status
  const { data: statusData } = useQuery({
    queryKey: ['earnings-status'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/earnings/status', {
          headers: getAuthHeaders(),
        });
        return handleApiResponse(response);
      } catch (error) {
        console.error('Status fetch error:', error);
        toast.error('Failed to fetch earnings status');
        throw error;
      }
    },
    retry: 1,
  });

  useEffect(() => {
    if (statusData) {
      setIsEnabled(statusData.enabled);
    }
  }, [statusData]);

  const { data: earningsData, isLoading } = useQuery({
    queryKey: ['earnings'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/earnings', {
          headers: getAuthHeaders(),
        });
        return handleApiResponse(response);
      } catch (error) {
        console.error('Earnings fetch error:', error);
        toast.error('Failed to fetch earnings data');
        throw error;
      }
    },
    refetchInterval: isEnabled ? 5000 : false,
    enabled: isEnabled,
  });

  const { data: pendingPayouts, isLoading: isLoadingPayouts } = useQuery({
    queryKey: ['pending-payouts'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/earnings/pending', {
          headers: getAuthHeaders(),
        });
        return handleApiResponse(response);
      } catch (error) {
        console.error('Pending payouts fetch error:', error);
        toast.error('Failed to fetch pending payouts');
        throw error;
      }
    },
    refetchInterval: isEnabled ? 5000 : false,
    enabled: isEnabled,
  });

  const handleEarningsToggle = async (enabled: boolean) => {
    try {
      const response = await fetch('/api/earnings/toggle', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ enabled }),
      });

      const data = await handleApiResponse(response);
      setIsEnabled(data.enabled);
      
      // Invalidate queries only after successful toggle
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['earnings'] }),
        queryClient.invalidateQueries({ queryKey: ['pending-payouts'] }),
        queryClient.invalidateQueries({ queryKey: ['earnings-status'] }),
      ]);

      toast.success(enabled ? "Earnings features activated!" : "Earnings features deactivated");
    } catch (error) {
      console.error('Toggle error:', error);
      toast.error(error instanceof Error ? error.message : "Failed to update earnings status");
      // Revert the switch state on error
      setIsEnabled(!enabled);
    }
  };

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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold">Earnings Dashboard</h1>
                <Switch 
                  checked={isEnabled}
                  onCheckedChange={handleEarningsToggle}
                />
              </div>
            </div>

            {isEnabled && (
              <div className="grid gap-6">
                <Card className="p-6 bg-white shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Total Earnings</h2>
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-3xl font-bold text-primary">
                    {isLoading ? "Loading..." : `$${earningsData?.total || 0}`}
                  </p>
                </Card>

                <Card className="p-6 bg-white shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Pending Payouts</h2>
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-3xl font-bold text-primary">
                    {isLoadingPayouts ? "Loading..." : `$${pendingPayouts || 0}`}
                  </p>
                </Card>

                <Card className="p-6 bg-white shadow-md">
                  <div className="flex items-center gap-2 mb-4">
                    <Check className="h-5 w-5 text-green-500" />
                    <h2 className="text-lg font-semibold">Achievement Tracking</h2>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Views</p>
                      <div className="text-xl font-semibold">{earningsData?.totalViews || 0}</div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Creator Level</p>
                      <div className="text-xl font-semibold capitalize">{earningsData?.creatorLevel || "Beginner"}</div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Reels Posted</p>
                      <div className="text-xl font-semibold">{earningsData?.reelsCount || 0}</div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            <Card className="p-6 bg-white shadow-md">
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
    </div>
  );
};

export default Earnings;