import { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  isWishlisted: boolean;
}

const ProductDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);

  const getProduct = () => {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    return products.find((product: Product) => product.id === Number(id));
  };

  useEffect(() => {
    const foundProduct = getProduct();
    if (foundProduct) {
      setProduct(foundProduct);
    }
  }, [id]);

  const handleWishlist = () => {
    if (product) {
      product.isWishlisted = !product.isWishlisted;
      localStorage.setItem('products', JSON.stringify([...JSON.parse(localStorage.getItem('products') || '[]'), product]));
      toast({
        title: product.isWishlisted ? "Added to Wishlist" : "Removed from Wishlist",
      });
    }
  };

  const handleAddToCart = () => {
    toast({
      title: "Added to Cart",
    });
  };

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Carousel className="w-full">
            <CarouselContent>
              {[product.image, product.image].map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative">
                    <img
                      src={image}
                      alt={`${product.name} - View ${index + 1}`}
                      className="w-full h-[300px] rounded-lg object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
          <Button
            size="icon"
            variant="outline"
            className="absolute top-4 right-4"
            onClick={handleWishlist}
          >
            <Heart
              className={`h-4 w-4 ${product.isWishlisted ? "fill-red-500 text-red-500" : ""}`}
            />
          </Button>
        </div>

        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-xl font-semibold">${product.price}</p>
          <p className="text-gray-600">{product.description}</p>
          <div className="space-y-2">
            <Button 
              className="w-full" 
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
            <Button 
              className="w-full" 
              variant="secondary"
              onClick={() => navigate('/payment', { state: { product }})}
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
