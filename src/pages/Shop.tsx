import { useState, useEffect } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ProductList from "@/components/shop/ProductList";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  isWishlisted: boolean;
  inCart: boolean;
}

const Shop = () => {
  const categories = ["Electronics", "Fashion", "Home & Living", "Books"];
  
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Premium Headphones",
      price: 299,
      image: "/placeholder.svg",
      category: "Electronics",
      isWishlisted: false,
      inCart: false,
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 199,
      image: "/placeholder.svg",
      category: "Electronics",
      isWishlisted: false,
      inCart: false,
    },
    {
      id: 3,
      name: "Cotton T-Shirt",
      price: 29,
      image: "/placeholder.svg",
      category: "Fashion",
      isWishlisted: false,
      inCart: false,
    },
    {
      id: 4,
      name: "Table Lamp",
      price: 49,
      image: "/placeholder.svg",
      category: "Home & Living",
      isWishlisted: false,
      inCart: false,
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  // Load products from localStorage on component mount
  useEffect(() => {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }
  }, []);

  const toggleWishlist = (productId: number) => {
    const updatedProducts = products.map(product => 
      product.id === productId 
        ? { ...product, isWishlisted: !product.isWishlisted }
        : product
    );
    setProducts(updatedProducts);
    // Save to localStorage whenever products are updated
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const toggleCart = (productId: number) => {
    const updatedProducts = products.map(product => 
      product.id === productId 
        ? { ...product, inCart: !product.inCart }
        : product
    );
    setProducts(updatedProducts);
    // Save to localStorage whenever products are updated
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const wishlistedProducts = products.filter(p => p.isWishlisted);
  const cartProducts = products.filter(p => p.inCart);

  return (
    <div className="container mx-auto px-4 pb-24">
      <div className="flex items-center justify-between mb-6 sticky top-0 bg-white/80 backdrop-blur-md py-4 z-10">
        <div className="text-2xl font-bold">Shop</div>
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Heart className={`h-5 w-5 ${wishlistedProducts.length > 0 ? 'fill-primary text-primary' : ''}`} />
                {wishlistedProducts.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                    {wishlistedProducts.length}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Wishlist</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                {wishlistedProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="h-12 w-12 object-cover rounded" />
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">${product.price}</div>
                      </div>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => toggleWishlist(product.id)}>
                      <Heart className="h-5 w-5 fill-primary text-primary" />
                    </Button>
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className={`h-5 w-5 ${cartProducts.length > 0 ? 'text-primary' : ''}`} />
                {cartProducts.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                    {cartProducts.length}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Shopping Cart</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                {cartProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="h-12 w-12 object-cover rounded" />
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">${product.price}</div>
                      </div>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => toggleCart(product.id)}>
                      <ShoppingCart className="h-5 w-5 text-primary" />
                    </Button>
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <ProductList
        products={products}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onToggleWishlist={toggleWishlist}
        onToggleCart={toggleCart}
      />
    </div>
  );
};

export default Shop;