import { useState } from "react";
import { User, Mail, Phone, MapPin, Coins, Settings2, Image, Video, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProfileSettings } from "@/components/ProfileSettings";

interface Status {
  id: number;
  type: 'photo' | 'video';
  url: string;
  timestamp: Date;
}

interface FollowedUser {
  username: string;
  isFollowing: boolean;
}

const Profile = () => {
  const [userProfile, setUserProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 234 567 8900",
    address: "123 Main St, City, Country",
    coins: 100
  });

  const [statusFeedEnabled, setStatusFeedEnabled] = useState(false);
  const [statuses, setStatuses] = useState<Status[]>([]);
  
  // Get followed users from localStorage or initialize empty array
  const [followedUsers, setFollowedUsers] = useState<FollowedUser[]>(() => {
    const storedUsers = localStorage.getItem('followedUsers');
    return storedUsers ? JSON.parse(storedUsers) : [];
  });

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

  const handleUnfollow = (username: string) => {
    const updatedUsers = followedUsers.filter(user => user.username !== username);
    setFollowedUsers(updatedUsers);
    localStorage.setItem('followedUsers', JSON.stringify(updatedUsers));
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
            
            <ProfileSettings userProfile={userProfile} />
          </div>

          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold">{userProfile.name}</h2>
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-yellow-500" />
                <span className="font-medium">{userProfile.coins} coins</span>
              </div>
              
              {/* Followers Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Users className="h-4 w-4" />
                    Following ({followedUsers.length})
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Following</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-[300px] pr-4">
                    {followedUsers.length > 0 ? (
                      <div className="space-y-4">
                        {followedUsers.map((user) => (
                          <div key={user.username} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <User className="h-8 w-8 text-muted-foreground" />
                              <span className="font-medium">{user.username}</span>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUnfollow(user.username)}
                            >
                              Unfollow
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        You're not following anyone yet
                      </p>
                    )}
                  </ScrollArea>
                </DialogContent>
              </Dialog>
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