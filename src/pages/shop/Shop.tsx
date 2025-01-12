import { ProductList, ShopHeader, WishlistSheet, CartSheet } from "@/components/shop";
import { useShop } from "@/hooks/useShop";

const Shop = () => {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    wishlistedProducts,
    cartProducts,
    toggleWishlist,
    toggleCart,
    handleCheckout
  } = useShop();

  return (
    <div className="container mx-auto px-4 py-8">
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