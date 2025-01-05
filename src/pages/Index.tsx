import { useState, useEffect } from "react";
import { User, Coins, Activity, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  isWishlisted: boolean;
}

interface HealthGoal {
  id: number;
  title: string;
  current: number;
  target: number;
  unit: string;
}

const Index = () => {
  const [coins] = useState(100);
  const navigate = useNavigate();
  const [wishlistedProducts, setWishlistedProducts] = useState<Product[]>([]);
  const [healthGoals, setHealthGoals] = useState<HealthGoal[]>([
    {
      id: 1,
      title: "Daily Steps",
      current: 6500,
      target: 10000,
      unit: "steps"
    },
    {
      id: 2,
      title: "Water Intake",
      current: 1200,
      target: 2000,
      unit: "ml"
    },
    {
      id: 3,
      title: "Calories Burned",
      current: 350,
      target: 500,
      unit: "kcal"
    }
  ]);

  useEffect(() => {
    // Add event listener for storage changes
    const handleStorageChange = () => {
      const storedProducts = localStorage.getItem('products');
      if (storedProducts) {
        const products: Product[] = JSON.parse(storedProducts);
        const wishlisted = products.filter(product => product.isWishlisted);
        setWishlistedProducts(wishlisted);
      }
    };

    // Initial load
    handleStorageChange();

    // Listen for changes
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
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

      {/* Health Goals Section */}
      <div className="space-y-4 mt-8">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Pending Goals</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/health')}
            className="flex items-center gap-2"
          >
            <Activity className="h-4 w-4" />
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {healthGoals.map((goal) => (
            <Card key={goal.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    <h4 className="font-medium">{goal.title}</h4>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {goal.current} / {goal.target} {goal.unit}
                  </span>
                </div>
                <Progress 
                  value={(goal.current / goal.target) * 100} 
                  className="h-2"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Wishlist Section */}
      <div className="space-y-4 mt-8">
        <h3 className="text-lg font-semibold">Your Wishlist</h3>
        {wishlistedProducts.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No items in your wishlist yet. Visit the shop to add items!
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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