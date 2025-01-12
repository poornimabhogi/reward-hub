import { Card } from "@/components/ui/card";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  isWishlisted: boolean;
}

interface WishlistSectionProps {
  products: Product[];
}

export const WishlistSection = ({ products }: WishlistSectionProps) => {
  if (products.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-sm font-medium mb-3">Wishlist</h3>
      <div className="grid grid-cols-2 gap-4">
        {products.map((product) => (
          <Card key={product.id} className="p-2">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-32 object-cover rounded-md mb-2"
            />
            <div className="text-sm font-medium truncate">{product.name}</div>
            <div className="text-sm text-muted-foreground">${product.price}</div>
          </Card>
        ))}
      </div>
    </div>
  );
};