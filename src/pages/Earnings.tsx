import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <h1 className="text-2xl font-bold mb-6">Earnings Dashboard</h1>

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
    </div>
  );
};

export default Earnings;