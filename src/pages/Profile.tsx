import { useState } from "react";
import { User, Coins, Users, LayoutGrid, LayoutList, MessageSquare, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProfileSettings } from "@/components/ProfileSettings";
import { CreatePostForm } from "@/components/profile/CreatePostForm";
import { PostsGrid } from "@/components/profile/PostsGrid";
import { TimeCapsules } from "@/components/profile/TimeCapsules";
import { Status, FollowedUser, UserProfile } from "@/types/profile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const [followedUsers, setFollowedUsers] = useState<FollowedUser[]>(() => {
    const storedUsers = localStorage.getItem('followedUsers');
    return storedUsers ? JSON.parse(storedUsers) : [];
  });

  const handleUnfollow = (username: string) => {
    const updatedUsers = followedUsers.filter(user => user.username !== username);
    setFollowedUsers(updatedUsers);
    localStorage.setItem('followedUsers', JSON.stringify(updatedUsers));
  };

  const handleNewPost = (newStatus: Status, postType: 'timeCapsule' | 'feature' | 'reel') => {
    if (postType === 'timeCapsule') {
      setTimeCapsules([newStatus, ...timeCapsules]);
    } else {
      setPosts([newStatus, ...posts]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-4 max-w-2xl">
      {/* Compact Profile Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-primary" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">{userProfile.name}</h2>
              <ProfileSettings userProfile={userProfile} />
            </div>
            
            <div className="flex items-center gap-6 text-sm mb-3">
              <div className="text-center">
                <div className="font-semibold">{posts.length}</div>
                <div className="text-muted-foreground">Posts</div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="text-center">
                    <div className="font-semibold">{followedUsers.length}</div>
                    <div className="text-muted-foreground">Following</div>
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-xs">
                  <DialogHeader>
                    <DialogTitle>Following</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-[200px] pr-4">
                    {followedUsers.length > 0 ? (
                      <div className="space-y-2">
                        {followedUsers.map((user) => (
                          <div key={user.username} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
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
              <div className="text-center">
                <div className="font-semibold">{userProfile.coins}</div>
                <div className="text-muted-foreground">Coins</div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <MessageSquare className="w-4 h-4 mr-2" />
                Message
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Phone className="w-4 h-4 mr-2" />
                Contact
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Time Capsules (Stories) */}
      <TimeCapsules timeCapsules={timeCapsules} />

      {/* Create Post Form */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <CreatePostForm onPost={handleNewPost} />
      </div>

      {/* Posts Tabs */}
      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="grid" className="flex-1" onClick={() => setViewMode('grid')}>
            <LayoutGrid className="w-4 h-4 mr-2" />
            Grid
          </TabsTrigger>
          <TabsTrigger value="list" className="flex-1" onClick={() => setViewMode('list')}>
            <LayoutList className="w-4 h-4 mr-2" />
            List
          </TabsTrigger>
        </TabsList>
        <TabsContent value="grid" className="mt-4">
          <PostsGrid posts={posts} viewMode="grid" />
        </TabsContent>
        <TabsContent value="list" className="mt-4">
          <PostsGrid posts={posts} viewMode="list" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
