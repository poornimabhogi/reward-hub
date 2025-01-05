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
    <div className="container mx-auto px-4 pb-24">
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
