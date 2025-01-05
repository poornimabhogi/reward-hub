import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingBag, Gamepad2, Video, Heart } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  const [wishlistCount] = useState(0);
  const [cartCount] = useState(0);
  const [coins] = useState(100);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around py-3">
          <Link to="/" className={`nav-link flex flex-col items-center ${location.pathname === "/" ? "text-primary" : "text-gray-500"}`}>
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          
          <Link to="/shop" className={`nav-link flex flex-col items-center ${location.pathname === "/shop" ? "text-primary" : "text-gray-500"}`}>
            <ShoppingBag className="h-6 w-6" />
            <span className="text-xs mt-1">Shop</span>
          </Link>
          
          <Link to="/games" className={`nav-link flex flex-col items-center ${location.pathname === "/games" ? "text-primary" : "text-gray-500"}`}>
            <Gamepad2 className="h-6 w-6" />
            <span className="text-xs mt-1">Games</span>
          </Link>
          
          <Link to="/social" className={`nav-link flex flex-col items-center ${location.pathname === "/social" ? "text-primary" : "text-gray-500"}`}>
            <Video className="h-6 w-6" />
            <span className="text-xs mt-1">Social</span>
          </Link>
          
          <Link to="/health" className={`nav-link flex flex-col items-center ${location.pathname === "/health" ? "text-primary" : "text-gray-500"}`}>
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 2H8a4 4 0 0 0-4 4v12a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V6a4 4 0 0 0-4-4Z" />
              <path d="M12 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
              <path d="M12 6v4" />
            </svg>
            <span className="text-xs mt-1">Health</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;