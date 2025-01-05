import { Heart, ShoppingCart, Plus, Minus } from "lucide-react";
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
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");

  const handleIncrement = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

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
      
      <div className="space-y-3">
        <Select value={selectedSize} onValueChange={setSelectedSize}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="xs">XS</SelectItem>
            <SelectItem value="s">S</SelectItem>
            <SelectItem value="m">M</SelectItem>
            <SelectItem value="l">L</SelectItem>
            <SelectItem value="xl">XL</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center justify-between border rounded-md p-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleDecrement}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleIncrement}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;