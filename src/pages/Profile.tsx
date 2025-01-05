import { useState } from "react";
import { User, Coins, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProfileSettings } from "@/components/ProfileSettings";
import { CreatePostForm } from "@/components/profile/CreatePostForm";
import { PostsGrid } from "@/components/profile/PostsGrid";
import { TimeCapsules } from "@/components/profile/TimeCapsules";
import { Status, FollowedUser, UserProfile } from "@/types/profile";

const Profile = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 234 567 8900",
    address: "123 Main St, City, Country",
    coins: 100
  });

  const [posts, setPosts] = useState<Status[]>([]);
  const [timeCapsules, setTimeCapsules] = useState<Status[]>([]);
  
  const [followedUsers, setFollowedUsers] = useState<FollowedUser[]>(() => {
    const storedUsers = localStorage.getItem('followedUsers');
    return storedUsers ? JSON.parse(storedUsers) : [];
  });

  const handleUnfollow = (username: string) => {
    const updatedUsers = followedUsers.filter(user => user.username !== username);
    setFollowedUsers(updatedUsers);
    localStorage.setItem('followedUsers', JSON.stringify(updatedUsers));
  };

  const handleNewPost = (newStatus: Status, isTimeCapsule: boolean) => {
    if (isTimeCapsule) {
      setTimeCapsules([newStatus, ...timeCapsules]);
    } else {
      setPosts([newStatus, ...posts]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Profile Header - Reduced size */}
        <div className="bg-white rounded-lg shadow-lg p-4 relative mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <ProfileSettings userProfile={userProfile} />
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold">{userProfile.name}</h2>
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-yellow-500" />
                <span className="font-medium">{userProfile.coins} coins</span>
              </div>
              
              {/* Followers Dialog - Reduced size */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Users className="h-4 w-4" />
                    Following ({followedUsers.length})
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-xs">
                  <DialogHeader>
                    <DialogTitle>Following</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-[150px] pr-4">
                    {followedUsers.length > 0 ? (
                      <div className="space-y-3">
                        {followedUsers.map((user) => (
                          <div key={user.username} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <User className="h-6 w-6 text-muted-foreground" />
                              <span className="font-medium text-sm">{user.username}</span>
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
                      <p className="text-center text-muted-foreground py-4 text-sm">
                        You're not following anyone yet
                      </p>
                    )}
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Create Post Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Create a Post</h3>
          <CreatePostForm onPost={handleNewPost} />
        </div>

        {/* Time Capsules Section */}
        <TimeCapsules timeCapsules={timeCapsules} />

        {/* Posts Grid Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Your Posts</h3>
          <PostsGrid posts={posts} />
        </div>
      </div>
    </div>
  );
};

export default Profile;