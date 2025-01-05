import { useState } from "react";
import { Heart, Gift, Coins, User } from "lucide-react";
import { Link } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  isWishlisted: boolean;
}

const Index = () => {
  const [wishlistedProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Premium Headphones",
      price: 299,
      image: "/placeholder.svg",
      isWishlisted: true,
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 199,
      image: "/placeholder.svg",
      isWishlisted: true,
    },
  ]);

  const [coins] = useState(100);

  return (
    <div className="container mx-auto px-4 pb-24">
      <div className="flex items-center justify-between mb-6 sticky top-0 bg-white/80 backdrop-blur-md py-4 z-10">
        <button className="button-secondary flex items-center space-x-2">
          <User className="h-4 w-4" />
          <span>Profile</span>
        </button>
        
        <div className="flex items-center gap-4">
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

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-6">Your Wishlist</h2>
          <div className="grid grid-cols-2 gap-4">
            {wishlistedProducts.map((product) => (
              <div key={product.id} className="card group">
                <div className="relative aspect-square mb-4 overflow-hidden rounded-md">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                  <button className="absolute top-2 right-2 p-2 rounded-full bg-white/80 backdrop-blur-sm">
                    <Heart className="h-4 w-4 text-primary" fill="currentColor" />
                  </button>
                </div>
                <h3 className="font-medium text-sm mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600">${product.price}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Featured Products</h2>
          <div className="grid grid-cols-2 gap-4">
            {/* Similar product cards can be added here */}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;