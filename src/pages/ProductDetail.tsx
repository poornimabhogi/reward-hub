import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Heart, ShoppingCart } from "lucide-react";

const ProductDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const product = state?.product;

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Product not found</div>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Reuse the existing cart toggle logic
    product.onToggleCart(product.id);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/payment', { state: { products: [product] } });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2" />
        Back
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-auto rounded-lg object-cover aspect-square"
          />
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-4 right-4 h-10 w-10 bg-white/80 hover:bg-white"
            onClick={() => product.onToggleWishlist(product.id)}
          >
            <Heart
              className={`h-5 w-5 ${
                product.isWishlisted 
                  ? "fill-primary text-primary" 
                  : "text-muted-foreground"
              }`}
            />
          </Button>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            <p className="text-xl font-semibold text-primary">${product.price}</p>
          </div>

          <div className="space-y-4">
            <Button
              className="w-full"
              variant="outline"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2" />
              Add to Cart
            </Button>
            <Button
              className="w-full"
              onClick={handleBuyNow}
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;