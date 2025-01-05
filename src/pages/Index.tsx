import { useState } from "react";
import { User, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  // This would typically come from a global state management solution
  const [userProfile] = useState({
    name: "John Doe",
    coins: 100
  });

  // Mock wishlist data - in a real app, this would be shared state with the Shop component
  const [wishlistedProducts] = useState([
    {
      id: 1,
      name: "Premium Headphones",
      price: 299,
      image: "/placeholder.svg",
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 199,
      image: "/placeholder.svg",
    }
  ]);

  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 pb-24">
      {/* Profile Section */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold">{userProfile.name}</h2>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Coins className="w-4 h-4" />
            <span>{userProfile.coins} coins</span>
          </div>
        </div>
      </div>

      {/* Lucky Draw Button */}
      <Button 
        className="w-full mb-8" 
        onClick={() => navigate('/lucky-draw')}
      >
        Try Your Luck!
      </Button>

      {/* Wishlist Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Your Wishlist</h3>
        {wishlistedProducts.length > 0 ? (
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
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No items in your wishlist yet
          </p>
        )}
      </div>
    </div>
  );
};

export default Index;