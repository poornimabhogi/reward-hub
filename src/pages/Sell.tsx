import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Sell = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "Electronics",
    size: "",
    image: null as File | null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        setFormData({ ...formData, image: file });
      } else {
        toast.error("Please upload an image or video file");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a new product object
    const newProduct = {
      id: Date.now(),
      name: formData.name,
      price: parseFloat(formData.price),
      image: formData.image ? URL.createObjectURL(formData.image) : "/placeholder.svg",
      category: formData.category,
      size: formData.size,
      description: formData.description,
      isWishlisted: false,
      inCart: false,
    };

    // Get existing products from localStorage or initialize empty array
    const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');
    
    // Add new product to the array
    const updatedProducts = [...existingProducts, newProduct];
    
    // Save back to localStorage
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    
    toast.success("Item listed successfully!");
    navigate("/shop");
  };

  const PreviewProduct = () => (
    <div className="space-y-4">
      {formData.image && (
        <div className="relative aspect-square w-full overflow-hidden rounded-lg">
          <img
            src={URL.createObjectURL(formData.image)}
            alt="Product preview"
            className="object-contain w-full h-full"
          />
        </div>
      )}
      <div className="space-y-2">
        <h3 className="font-semibold">{formData.name || "Product Name"}</h3>
        <p className="text-lg font-bold">${formData.price || "0.00"}</p>
        {formData.size && <p className="text-sm text-gray-500">Size: {formData.size}</p>}
        <p className="text-sm text-gray-600">{formData.description || "No description provided"}</p>
        <p className="text-sm text-gray-500">Category: {formData.category}</p>
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              className="mr-4 p-2"
              onClick={() => navigate('/shop')}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-bold flex-1">List Item for Sale</h1>
            <Button 
              type="submit"
              form="sellForm"
              className="bg-primary hover:bg-primary/90"
            >
              Add Product
            </Button>
          </div>
          <form id="sellForm" onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Item Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="size">Size (optional)</Label>
              <Input
                id="size"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                placeholder="e.g., Small, Medium, Large, or specific dimensions"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option>Electronics</option>
                <option>Fashion</option>
                <option>Home & Living</option>
                <option>Books</option>
              </select>
            </div>

            <div>
              <Label htmlFor="image">Product Image/Video</Label>
              <Input
                id="image"
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="cursor-pointer"
                required
              />
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button type="button" variant="outline" className="w-full">
                  Preview Product
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Product Preview</DialogTitle>
                </DialogHeader>
                <PreviewProduct />
              </DialogContent>
            </Dialog>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Sell;