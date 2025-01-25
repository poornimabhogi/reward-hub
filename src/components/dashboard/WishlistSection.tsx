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
      <h3 className="text-lg font-semibold mb-4">Your Wishlist</h3>
      {products.length === 0 ? (
        <Card className="border border-neutral">
          <CardContent className="p-6 text-center text-muted-foreground">
            <p className="mb-2">No items in your wishlist yet.</p>
            <p className="text-sm">Visit the shop to add items you love!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <Card key={product.id} className="border border-neutral">
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