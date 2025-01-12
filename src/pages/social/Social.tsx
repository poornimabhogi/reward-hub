import { useState, useEffect } from "react";
import { User, Coins, Dice1 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LoginForm } from "@/components/auth/LoginForm";
import { HealthGoals } from "@/components/dashboard/HealthGoals";
import { WishlistSection } from "@/components/dashboard/WishlistSection";
import { useToast } from "@/hooks/use-toast";

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

const Social = () => {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const [coins, setCoins] = useState(100);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [wishlistedProducts, setWishlistedProducts] = useState<Product[]>([]);
  const [healthGoals] = useState<HealthGoal[]>([
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral flex items-center justify-center p-4">
        <LoginForm />
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
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-neutral px-3 py-1.5 rounded-full">
              <Coins className="h-5 w-5 text-yellow-500" />
              <span className="font-medium">{coins}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/lucky-draw')}
              className="flex items-center gap-2"
            >
              <Dice1 className="h-4 w-4" />
              Lucky Draw
            </Button>
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
        <HealthGoals goals={healthGoals} />
        <WishlistSection products={wishlistedProducts} />
      </div>
    </div>
  );
};

export default Social;
