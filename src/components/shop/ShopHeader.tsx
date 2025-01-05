import { Heart, ShoppingCart, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";

interface ShopHeaderProps {
  wishlistedProducts: any[];
  cartProducts: any[];
  WishlistContent: React.ReactNode;
  CartContent: React.ReactNode;
}

const ShopHeader = ({ wishlistedProducts, cartProducts, WishlistContent, CartContent }: ShopHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-6 sticky top-0 bg-white/80 backdrop-blur-md py-4 z-10">
      <div className="text-2xl font-bold">Shop</div>
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Heart className={`h-5 w-5 ${wishlistedProducts.length > 0 ? 'fill-primary text-primary' : ''}`} />
              {wishlistedProducts.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                  {wishlistedProducts.length}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          {WishlistContent}
        </Sheet>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className={`h-5 w-5 ${cartProducts.length > 0 ? 'text-primary' : ''}`} />
              {cartProducts.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                  {cartProducts.length}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          {CartContent}
        </Sheet>

        <Button
          variant="default"
          onClick={() => navigate('/sell')}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-5 w-5" />
          Sell Item
        </Button>
      </div>
    </div>
  );
};

export default ShopHeader;