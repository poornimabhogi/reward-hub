import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductList from "@/components/shop/ProductList";
import ShopHeader from "@/components/shop/ShopHeader";
import { WishlistSheet, CartSheet } from "@/components/shop/ShopSheets";

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
  const navigate = useNavigate();
  const categories = ["Electronics", "Fashion", "Home & Living", "Books"];
  
  const initialProducts = [
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
  ];

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  useEffect(() => {
    const storedProducts = localStorage.getItem('products');
    if (!storedProducts) {
      localStorage.setItem('products', JSON.stringify(initialProducts));
    } else {
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
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const toggleCart = (productId: number) => {
    const updatedProducts = products.map(product => 
      product.id === productId 
        ? { ...product, inCart: !product.inCart }
        : product
    );
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const wishlistedProducts = products.filter(p => p.isWishlisted);
  const cartProducts = products.filter(p => p.inCart);

  const handleCheckout = () => {
    navigate('/payment', { state: { products: cartProducts } });
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="sticky top-0 z-10 bg-white border-b">
        <ShopHeader
          wishlistedProducts={wishlistedProducts}
          cartProducts={cartProducts}
          WishlistContent={
            <WishlistSheet
              wishlistedProducts={wishlistedProducts}
              toggleWishlist={toggleWishlist}
            />
          }
          CartContent={
            <CartSheet
              cartProducts={cartProducts}
              toggleCart={toggleCart}
              handleCheckout={handleCheckout}
            />
          }
        />
      </div>

      <div 
        className="flex-1 overflow-y-auto px-4"
        style={{
          height: 'calc(100vh - 4rem - 2px)', // 4rem for nav height, 2px for border
          paddingBottom: '1rem'
        }}
      >
        <ProductList
          products={products}
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onToggleWishlist={toggleWishlist}
          onToggleCart={toggleCart}
        />
      </div>
    </div>
  );
};

export default Shop;