import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  isWishlisted: boolean;
  inCart: boolean;
}

interface ProductListProps {
  products: Product[];
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onToggleWishlist: (id: number) => void;
  onToggleCart: (id: number) => void;
}

const ProductList = ({
  products,
  categories,
  selectedCategory,
  onSelectCategory,
  onToggleWishlist,
  onToggleCart,
}: ProductListProps) => {
  return (
    <Tabs defaultValue={selectedCategory} onValueChange={onSelectCategory}>
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
                <ProductCard
                  key={product.id}
                  product={product}
                  onToggleWishlist={onToggleWishlist}
                  onToggleCart={onToggleCart}
                />
              ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default ProductList;