import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";

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

export const CartSheet = ({ cartProducts, toggleCart, handleCheckout }: Pick<ShopSheetsProps, 'cartProducts' | 'toggleCart' | 'handleCheckout'>) => (
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
          <Button className="w-full" onClick={handleCheckout}>
            Proceed to Checkout
          </Button>
        </div>
      )}
    </div>
  </SheetContent>
);