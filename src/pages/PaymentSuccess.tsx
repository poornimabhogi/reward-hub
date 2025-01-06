import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle } from "lucide-react";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: "Payment Successful",
      description: "Thank you for your purchase!",
    });
  }, [toast]);

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        <h1 className="text-2xl font-bold">Payment Successful!</h1>
        <p className="text-muted-foreground">Thank you for your purchase.</p>
        <Button onClick={() => navigate("/shop")}>Return to Shop</Button>
      </div>
    </div>
  );
};

export default PaymentSuccess;