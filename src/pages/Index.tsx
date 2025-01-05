import { useState, useEffect } from "react";
import { User, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ProfileSettings } from "@/components/ProfileSettings";

// Sample product data structure
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  isWishlisted: boolean;
}

const Index = () => {
  const [coins] = useState(100);
  const navigate = useNavigate();
  const [wishlistedProducts, setWishlistedProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Retrieve wishlisted products from localStorage
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      const products: Product[] = JSON.parse(storedProducts);
      const wishlisted = products.filter(product => product.isWishlisted);
      setWishlistedProducts(wishlisted);
    }
  }, []);

  return (
    <div className="container mx-auto px-4 pb-24">
      {/* Top Bar */}
      <div className="flex items-center justify-between py-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/profile')}
        >
          <User className="h-6 w-6" />
        </Button>
        
        <div className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-yellow-500" />
          <span className="font-medium">{coins} coins</span>
        </div>
        
        <Button 
          onClick={() => navigate('/lucky-draw')}
          variant="default"
          size="sm"
        >
          Try Your Luck!
        </Button>
      </div>

      {/* Wishlist Section */}
      <div className="space-y-4 mt-8">
        <h3 className="text-lg font-semibold">Your Wishlist</h3>
        {wishlistedProducts.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No items in your wishlist yet. Visit the shop to add items!
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {wishlistedProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <CardContent className="p-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-md mb-2"
                  />
                  <h4 className="font-medium text-sm truncate">{product.name}</h4>
                  <p className="text-sm text-muted-foreground">${product.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;