import { useState, useEffect } from "react";
import { User, Coins, Activity, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { LoginForm } from "@/components/LoginForm";

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
  const { isAuthenticated, user, logout } = useAuth();
  const [coins] = useState(100);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
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
    const handleStorageChange = () => {
      const storedProducts = localStorage.getItem('products');
      if (storedProducts) {
        const products: Product[] = JSON.parse(storedProducts);
        const wishlisted = products.filter(product => product.isWishlisted);
        setWishlistedProducts(wishlisted);
      }
    };

    handleStorageChange();
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-md mx-auto pt-10">
          <h1 className="text-2xl font-bold text-center mb-8">Welcome to Reward Hub</h1>
          <LoginForm />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b z-50">
        <div className="flex items-center justify-between p-4 max-w-md mx-auto">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/profile')}
            className="relative"
          >
            <User className="h-6 w-6" />
          </Button>
          
          <div className="flex items-center gap-2 bg-neutral px-3 py-1.5 rounded-full">
            <Coins className="h-5 w-5 text-yellow-500" />
            <span className="font-medium">{coins}</span>
          </div>
          
          <Button 
            onClick={logout}
            variant="outline"
            size="sm"
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pb-24 pt-6 space-y-6">
        {/* Health Goals Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Pending Goals</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/health')}
              className="flex items-center gap-2 text-primary"
            >
              <Activity className="h-4 w-4" />
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {healthGoals.map((goal) => (
              <Card key={goal.id} className="border border-neutral">
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
        </section>

        {/* Wishlist Section */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Your Wishlist</h3>
          {wishlistedProducts.length === 0 ? (
            <Card className="border border-neutral">
              <CardContent className="p-6 text-center text-muted-foreground">
                No items in your wishlist yet. Visit the shop to add items!
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {wishlistedProducts.map((product) => (
                <Card key={product.id} className="border border-neutral">
                  <CardContent className="p-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full aspect-square object-cover rounded-md mb-2"
                    />
                    <h4 className="font-medium text-sm truncate">{product.name}</h4>
                    <p className="text-sm text-muted-foreground">${product.price}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Index;
