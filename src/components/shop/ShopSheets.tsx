import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { useToast } from "@/components/ui/use-toast";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface ShopSheetsProps {
  wishlistedProducts: Product[];
  cartProducts: Product[];
  toggleWishlist: (id: number) => void;
  toggleCart: (id: number) => void;
  handleCheckout: () => void;
}

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_your_publishable_key');

export const WishlistSheet = ({ wishlistedProducts, toggleWishlist }: Pick<ShopSheetsProps, 'wishlistedProducts' | 'toggleWishlist'>) => (
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Wishlist</SheetTitle>
    </SheetHeader>
    <div className="mt-4 space-y-4">
      {wishlistedProducts.map((product) => (
        <div key={product.id} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={product.image} alt={product.name} className="h-12 w-12 object-cover rounded" />
            <div>
              <div className="font-medium">{product.name}</div>
              <div className="text-sm text-muted-foreground">${product.price}</div>
            </div>
          </div>
          <Button size="icon" variant="ghost" onClick={() => toggleWishlist(product.id)}>
            <Heart className="h-5 w-5 fill-primary text-primary" />
          </Button>
        </div>
      ))}
    </div>
  </SheetContent>
);

export const CartSheet = ({ cartProducts, toggleCart, handleCheckout }: Pick<ShopSheetsProps, 'cartProducts' | 'toggleCart' | 'handleCheckout'>) => {
  const { toast } = useToast();

  const handleStripeCheckout = async () => {
    try {
      const stripe = await stripePromise;
      if (!stripe) {
        toast({
          title: "Error",
          description: "Payment system is not available",
          variant: "destructive",
        });
        return;
      }

      // Create line items from cart products
      const lineItems = cartProducts.map(product => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: product.price * 100, // Stripe expects amounts in cents
        },
        quantity: 1,
      }));

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        mode: 'payment',
        lineItems,
        successUrl: `${window.location.origin}/payment-success`,
        cancelUrl: `${window.location.origin}/shop`,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate checkout",
        variant: "destructive",
      });
    }
  };

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Shopping Cart</SheetTitle>
      </SheetHeader>
      <div className="mt-4 space-y-4">
        {cartProducts.map((product) => (
          <div key={product.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={product.image} alt={product.name} className="h-12 w-12 object-cover rounded" />
              <div>
                <div className="font-medium">{product.name}</div>
                <div className="text-sm text-muted-foreground">${product.price}</div>
              </div>
            </div>
            <Button size="icon" variant="ghost" onClick={() => toggleCart(product.id)}>
              <ShoppingCart className="h-5 w-5 text-primary" />
            </Button>
          </div>
        ))}
        {cartProducts.length > 0 && (
          <div className="pt-4 border-t">
            <Button className="w-full" onClick={handleStripeCheckout}>
              Proceed to Checkout (${cartProducts.reduce((sum, product) => sum + product.price, 0)})
            </Button>
          </div>
        )}
      </div>
    </SheetContent>
  );
};