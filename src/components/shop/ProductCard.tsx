import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    isWishlisted: boolean;
    inCart: boolean;
  };
  onToggleWishlist: (id: number) => void;
  onToggleCart: (id: number) => void;
}

const ProductCard = ({ product, onToggleWishlist, onToggleCart }: ProductCardProps) => {
  const [quantity, setQuantity] = useState("1");

  return (
    <div className="card group">
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
            onClick={() => onToggleWishlist(product.id)}
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
            onClick={() => onToggleCart(product.id)}
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
      <p className="text-sm text-gray-600 mb-3">${product.price}</p>
      
      <div>
        <Select value={quantity} onValueChange={setQuantity}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select quantity" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <SelectItem key={num} value={num.toString()}>
                {num}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ProductCard;