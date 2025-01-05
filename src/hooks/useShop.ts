import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  isWishlisted: boolean;
  inCart: boolean;
}

export const useShop = () => {
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

  const handleCheckout = () => {
    navigate('/payment', { state: { products: cartProducts } });
  };

  const wishlistedProducts = products.filter(p => p.isWishlisted);
  const cartProducts = products.filter(p => p.inCart);

  return {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    wishlistedProducts,
    cartProducts,
    toggleWishlist,
    toggleCart,
    handleCheckout
  };
};