import { Card, CardContent } from "@/components/ui/card";

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
  return (
    <section>
      <h3 className="text-2xl font-semibold mb-4 text-gray-700">Your Wishlist</h3>
      {products.length === 0 ? (
        <Card className="border border-neutral shadow-none">
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">No items in your wishlist yet. Visit the shop to add items!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <Card key={product.id} className="border border-neutral shadow-none">
              <CardContent className="p-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full aspect-square object-cover rounded-md mb-2"
                />
                <h4 className="font-medium text-sm truncate">{product.name}</h4>
                <p className="text-sm text-muted-foreground">${product.price}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};