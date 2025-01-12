import { ProductList } from "@/components/shop";
import { ShopHeader } from "@/components/shop";

const Shop = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <ShopHeader />
      <ProductList />
    </div>
  );
};

export default Shop;