import { useState } from "react";
import { User, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ProfileSettings } from "@/components/ProfileSettings";

const Index = () => {
  const [coins] = useState(100);
  const navigate = useNavigate();

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
        <div className="grid grid-cols-2 gap-4">
          <Card key={1} className="overflow-hidden">
            <CardContent className="p-3">
              <img
                src="/placeholder.svg"
                alt="Premium Headphones"
                className="w-full h-32 object-cover rounded-md mb-2"
              />
              <h4 className="font-medium text-sm truncate">Premium Headphones</h4>
              <p className="text-sm text-muted-foreground">$299</p>
            </CardContent>
          </Card>
          <Card key={2} className="overflow-hidden">
            <CardContent className="p-3">
              <img
                src="/placeholder.svg"
                alt="Smart Watch"
                className="w-full h-32 object-cover rounded-md mb-2"
              />
              <h4 className="font-medium text-sm truncate">Smart Watch</h4>
              <p className="text-sm text-muted-foreground">$199</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
