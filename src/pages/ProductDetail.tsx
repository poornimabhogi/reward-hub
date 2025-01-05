import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Heart, ShoppingCart } from "lucide-react";

const ProductDetail = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get product either from navigation state or localStorage
  const getProduct = () => {
    if (state?.product) return state.product;
    
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      const products = JSON.parse(storedProducts);
      return products.find((p: any) => p.id === Number(id));
    }
    return null;
  };

  const product = getProduct();

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate('/shop')}
        >
          <ArrowLeft className="mr-2" />
          Back to Shop
        </Button>
        <div className="text-center">Product not found</div>
      </div>
    );
  }

  const handleAddToCart = () => {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      const products = JSON.parse(storedProducts);
      const updatedProducts = products.map((p: any) => 
        p.id === product.id ? { ...p, inCart: true } : p
      );
      localStorage.setItem('products', JSON.stringify(updatedProducts));
    }

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleToggleWishlist = () => {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      const products = JSON.parse(storedProducts);
      const updatedProducts = products.map((p: any) => 
        p.id === product.id ? { ...p, isWishlisted: !p.isWishlisted } : p
      );
      localStorage.setItem('products', JSON.stringify(updatedProducts));
    }
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
            onClick={handleToggleWishlist}
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