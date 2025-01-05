import ProductList from "@/components/shop/ProductList";
import ShopHeader from "@/components/shop/ShopHeader";
import { WishlistSheet, CartSheet } from "@/components/shop/ShopSheets";
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