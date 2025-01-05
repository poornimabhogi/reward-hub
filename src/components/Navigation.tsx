import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingBag, Gamepad2, Video, Heart, ShoppingCart, User, Gift, Coins } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  const [wishlistCount] = useState(0);
  const [cartCount] = useState(0);
  const [coins] = useState(100);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link to="/profile" className="hover:opacity-80 transition-opacity">
              <User className="h-6 w-6" />
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Coins className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium">{coins}</span>
            </div>
            <Link to="/gifts" className="button-secondary flex items-center space-x-2">
              <Gift className="h-4 w-4" />
              <span>Lucky Draw</span>
            </Link>
          </div>
        </div>
      </div>
      
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <Link to="/" className={`nav-link ${location.pathname === "/" ? "text-primary" : "text-gray-500"}`}>
              <Home className="h-6 w-6" />
            </Link>
            <Link to="/marketplace" className={`nav-link ${location.pathname === "/marketplace" ? "text-primary" : "text-gray-500"}`}>
              <ShoppingBag className="h-6 w-6" />
            </Link>
            <Link to="/games" className={`nav-link ${location.pathname === "/games" ? "text-primary" : "text-gray-500"}`}>
              <Gamepad2 className="h-6 w-6" />
            </Link>
            <Link to="/social" className={`nav-link ${location.pathname === "/social" ? "text-primary" : "text-gray-500"}`}>
              <Video className="h-6 w-6" />
            </Link>
            <Link to="/health" className={`nav-link ${location.pathname === "/health" ? "text-primary" : "text-gray-500"}`}>
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 2H8a4 4 0 0 0-4 4v12a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V6a4 4 0 0 0-4-4Z" />
                <path d="M12 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                <path d="M12 6v4" />
              </svg>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navigation;