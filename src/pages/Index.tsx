import { useState } from "react";
import { Heart, ShoppingCart, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  isWishlisted: boolean;
  inCart: boolean;
}

const Index = () => {
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

  const toggleWishlist = (productId: number) => {
    setProducts(products.map(product => 
      product.id === productId 
        ? { ...product, isWishlisted: !product.isWishlisted }
        : product
    ));
  };

  const toggleCart = (productId: number) => {
    setProducts(products.map(product => 
      product.id === productId 
        ? { ...product, inCart: !product.inCart }
        : product
    ));
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

      <Tabs defaultValue={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="w-full justify-start overflow-auto">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="flex items-center gap-2">
              {category}
              <ChevronRight className="h-4 w-4" />
            </TabsTrigger>
          ))}
        </TabsList>
        {categories.map((category) => (
          <TabsContent key={category} value={category}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
              {products
                .filter((product) => product.category === category)
                .map((product) => (
                  <div key={product.id} className="card group">
                    <div className="relative aspect-square mb-4 overflow-hidden rounded-md">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-8 w-8"
                          onClick={() => toggleWishlist(product.id)}
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              product.isWishlisted ? "fill-primary text-primary" : ""
                            }`}
                          />
                        </Button>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-8 w-8"
                          onClick={() => toggleCart(product.id)}
                        >
                          <ShoppingCart
                            className={`h-4 w-4 ${
                              product.inCart ? "text-primary" : ""
                            }`}
                          />
                        </Button>
                      </div>
                    </div>
                    <h3 className="font-medium text-sm mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600">${product.price}</p>
                  </div>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Index;