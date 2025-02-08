
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { createCheckoutSession } from "@/utils/stripe";
import { DialogContent, DialogDescription } from "@/components/ui/dialog";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  inCart?: boolean;
}

interface ShopSheetsProps {
  wishlistedProducts: Product[];
  cartProducts: Product[];
  toggleWishlist: (id: number) => void;
  toggleCart: (id: number) => void;
  handleCheckout: () => void;
}

export const WishlistSheet = ({ wishlistedProducts, toggleWishlist, toggleCart }: Pick<ShopSheetsProps, 'wishlistedProducts' | 'toggleWishlist' | 'toggleCart'>) => {
  const handleBuyNow = async (product: Product) => {
    try {
      await createCheckoutSession({
        name: product.name,
        price: product.price,
        quantity: 1,
      });
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  return (
    <SheetContent side="right" className="w-[400px]">
      <SheetHeader>
        <SheetTitle>Wishlist</SheetTitle>
        <DialogDescription>Items you've saved for later</DialogDescription>
      </SheetHeader>
      <div className="mt-4 space-y-4">
        {wishlistedProducts.map((product) => (
          <div key={product.id} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={product.image} alt={product.name} className="h-12 w-12 object-cover rounded" />
                <div>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-muted-foreground">${product.price}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" onClick={() => toggleCart(product.id)}>
                  <ShoppingCart className={`h-5 w-5 ${product.inCart ? 'text-primary' : ''}`} />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => toggleWishlist(product.id)}>
                  <Heart className="h-5 w-5 fill-primary text-primary" />
                </Button>
              </div>
            </div>
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => handleBuyNow(product)}
            >
              Buy Now
            </Button>
          </div>
        ))}
      </div>
    </SheetContent>
  );
};

export const CartSheet = ({ cartProducts, toggleCart, handleCheckout }: Pick<ShopSheetsProps, 'cartProducts' | 'toggleCart' | 'handleCheckout'>) => (
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Shopping Cart</SheetTitle>
      <DialogDescription>Items you're ready to purchase</DialogDescription>
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
          <Button className="w-full" onClick={handleCheckout}>
            Proceed to Checkout
          </Button>
        </div>
      )}
    </div>
  </SheetContent>
);
