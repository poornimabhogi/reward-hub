import { useState } from "react";
import { User, Mail, Phone, MapPin, Coins, Settings2, Image, Video, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Status {
  id: number;
  type: 'photo' | 'video';
  url: string;
  timestamp: Date;
}

const Profile = () => {
  const [userProfile, setUserProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 234 567 8900",
    address: "123 Main St, City, Country",
    coins: 100
  });

  const [editableProfile, setEditableProfile] = useState({ ...userProfile });
  const [statusFeedEnabled, setStatusFeedEnabled] = useState(false);
  const [statuses, setStatuses] = useState<Status[]>([]);

  const handleSave = () => {
    setUserProfile(editableProfile);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileType = file.type.startsWith('image/') ? 'photo' : 'video';
      const newStatus: Status = {
        id: Date.now(),
        type: fileType,
        url: URL.createObjectURL(file),
        timestamp: new Date(),
      };
      setStatuses([newStatus, ...statuses]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 relative">
          <div className="flex items-center justify-between mb-8">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-primary" />
            </div>
            
            {/* Settings Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings2 className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Profile Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={editableProfile.name}
                      onChange={(e) =>
                        setEditableProfile({ ...editableProfile, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editableProfile.email}
                      onChange={(e) =>
                        setEditableProfile({ ...editableProfile, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={editableProfile.phone}
                      onChange={(e) =>
                        setEditableProfile({ ...editableProfile, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={editableProfile.address}
                      onChange={(e) =>
                        setEditableProfile({ ...editableProfile, address: e.target.value })
                      }
                    />
                  </div>
                  <Button onClick={handleSave} className="w-full">Save Changes</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-semibold">{userProfile.name}</h2>
            <div className="flex items-center justify-center mt-2 space-x-2">
              <Coins className="w-5 h-5 text-yellow-500" />
              <span className="font-medium">{userProfile.coins} coins</span>
            </div>
          </div>
        </div>

        {/* Daily Status Feed */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Daily Status Feed</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStatusFeedEnabled(!statusFeedEnabled)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {statusFeedEnabled && (
            <>
              <div className="flex gap-4 mb-4">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted hover:bg-muted/80">
                    <Image className="h-6 w-6" />
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted hover:bg-muted/80">
                    <Video className="h-6 w-6" />
                  </div>
                </label>
              </div>

              {/* Status Feed Display */}
              {statuses.length > 0 && (
                <div className="overflow-x-auto">
                  <div className="flex gap-4 pb-2">
                    {statuses.map((status) => (
                      <div key={status.id} className="flex-shrink-0 w-32">
                        {status.type === 'photo' ? (
                          <img
                            src={status.url}
                            alt="Status"
                            className="w-32 h-32 rounded-lg object-cover"
                          />
                        ) : (
                          <video
                            src={status.url}
                            className="w-32 h-32 rounded-lg object-cover"
                            autoPlay
                            muted
                            loop
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;