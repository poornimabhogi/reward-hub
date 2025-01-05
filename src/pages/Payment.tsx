import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const products = state?.products || [];
  const total = products.reduce((sum: number, product: any) => sum + product.price, 0);

  const handlePayment = () => {
    toast({
      title: "Payment Successful",
      description: "Thank you for your purchase!",
    });
    navigate("/shop");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      <div className="bg-card rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
        <div className="space-y-4">
          {products.map((product: any) => (
            <div key={product.id} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img src={product.image} alt={product.name} className="h-12 w-12 object-cover rounded" />
                <div>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-muted-foreground">${product.price}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-6 border-t">
          <div className="flex justify-between items-center font-semibold">
            <span>Total</span>
            <span>${total}</span>
          </div>
        </div>
      </div>

      <Button className="w-full" onClick={handlePayment}>
        Pay ${total}
      </Button>
    </div>
  );
};

export default Payment;