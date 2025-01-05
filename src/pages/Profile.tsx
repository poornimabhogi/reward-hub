import { User, Mail, Phone, MapPin, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const userProfile = {
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 234 567 8900",
    address: "123 Main St, City, Country",
    coins: 100
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <div className="flex items-center justify-center mb-8">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-primary" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-secondary/50 rounded-lg">
              <User className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{userProfile.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-3 bg-secondary/50 rounded-lg">
              <Mail className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{userProfile.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-3 bg-secondary/50 rounded-lg">
              <Phone className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{userProfile.phone}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-3 bg-secondary/50 rounded-lg">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{userProfile.address}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-3 bg-secondary/50 rounded-lg">
              <Coins className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Available Coins</p>
                <p className="font-medium">{userProfile.coins}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-6">
            <Button variant="outline" className="w-full max-w-xs">
              Edit Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;