import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createCheckoutSession } from "@/utils/stripe";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    size?: string;
    isWishlisted: boolean;
    inCart: boolean;
  };
  onToggleWishlist: (id: number) => void;
  onToggleCart: (id: number) => void;
}

const ProductCard = ({ product, onToggleWishlist, onToggleCart }: ProductCardProps) => {
  const [quantity, setQuantity] = useState("1");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCardClick = () => {
    navigate(`/shop/product/${product.id}`, {
      state: {
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          size: product.size,
          isWishlisted: product.isWishlisted,
          inCart: product.inCart,
        },
      },
    });
  };

  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await createCheckoutSession({
        name: product.name,
        price: product.price,
        quantity: parseInt(quantity),
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate checkout. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="card group cursor-pointer" onClick={handleCardClick}>
      <div className="relative aspect-square mb-4 overflow-hidden rounded-md">
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 bg-white/80 hover:bg-white"
            onClick={(e) => handleActionClick(e, () => onToggleWishlist(product.id))}
          >
            <Heart
              className={`h-4 w-4 ${
                product.isWishlisted 
                  ? "fill-primary text-primary" 
                  : "text-muted-foreground"
              }`}
            />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 bg-white/80 hover:bg-white"
            onClick={(e) => handleActionClick(e, () => onToggleCart(product.id))}
          >
            <ShoppingCart
              className={`h-4 w-4 ${
                product.inCart 
                  ? "fill-primary text-primary" 
                  : "text-muted-foreground"
              }`}
            />
          </Button>
        </div>
      </div>
      <h3 className="font-medium text-sm mb-1">{product.name}</h3>
      <p className="text-sm text-gray-600 mb-2">${product.price}</p>
      {product.size && (
        <p className="text-sm text-gray-500 mb-3">Size: {product.size}</p>
      )}
      
      <div onClick={(e) => e.stopPropagation()} className="space-y-3">
        <Select value={quantity} onValueChange={setQuantity}>
          <SelectTrigger className="w-full">
            <SelectValue>Quantity: {quantity}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <SelectItem key={num} value={num.toString()}>
                {num}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button 
          className="w-full"
          onClick={handleBuyNow}
        >
          Buy Now
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;