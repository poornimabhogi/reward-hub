import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProfileSettings } from "@/components/ProfileSettings";
import { CreatePostForm } from "@/components/profile/CreatePostForm";
import { PostsGrid } from "@/components/profile/PostsGrid";
import { TimeCapsules } from "@/components/profile/TimeCapsules";
import { Status, FollowedUser, UserProfile } from "@/types/profile";
import { TimeCapsule } from "@/utils/timeCapsuleUtils";

const Profile = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 234 567 8900",
    address: "123 Main St, City, Country",
    coins: 100
  });

  const [posts, setPosts] = useState<Status[]>([]);
  const [timeCapsules, setTimeCapsules] = useState<TimeCapsule[]>([]);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedPostType, setSelectedPostType] = useState<'timeCapsule' | 'feature' | 'reel'>('feature');
  
  const [followedUsers, setFollowedUsers] = useState<FollowedUser[]>(() => {
    const storedUsers = localStorage.getItem('followedUsers');
    return storedUsers ? JSON.parse(storedUsers) : [];
  });

  useEffect(() => {
    const handleNewTimeCapsule = (event: CustomEvent<Status>) => {
      const newStatus = event.detail;
      if (newStatus.postType === 'timeCapsule') {
        const newTimeCapsule: TimeCapsule = {
          id: newStatus.id,
          type: newStatus.type,
          url: newStatus.url,
          timestamp: new Date().toISOString(),
          username: userProfile.name,
          postType: 'timeCapsule'
        };
        setTimeCapsules(prev => [newTimeCapsule, ...prev]);
      } else {
        setPosts(prev => [newStatus, ...prev]);
      }
    };

    window.addEventListener('newTimeCapsule', handleNewTimeCapsule as EventListener);
    return () => {
      window.removeEventListener('newTimeCapsule', handleNewTimeCapsule as EventListener);
    };
  }, [userProfile.name]);

  const handleUnfollow = (username: string) => {
    const updatedUsers = followedUsers.filter(user => user.username !== username);
    setFollowedUsers(updatedUsers);
    localStorage.setItem('followedUsers', JSON.stringify(updatedUsers));
  };

  const handleNewPost = (newStatus: Status, postType: 'timeCapsule' | 'feature' | 'reel') => {
    if (postType === 'timeCapsule') {
      const newTimeCapsule: TimeCapsule = {
        id: newStatus.id,
        type: newStatus.type,
        url: newStatus.url,
        timestamp: new Date().toISOString(),
        username: userProfile.name,
        postType: 'timeCapsule'
      };
      setTimeCapsules([newTimeCapsule, ...timeCapsules]);
    } else {
      setPosts([newStatus, ...posts]);
    }
    setIsCreatePostOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-4 max-w-2xl">
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{userProfile.name}</h2>
              <div className="flex items-center gap-6 text-sm mt-2">
                <div className="text-center">
                  <div className="font-semibold">{posts.length}</div>
                  <div className="text-muted-foreground">Posts</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{followedUsers.length}</div>
                  <div className="text-muted-foreground">Following</div>
                </div>
              </div>
            </div>
          </div>
          <ProfileSettings userProfile={userProfile} />
        </div>
      </div>

      <TimeCapsules timeCapsules={timeCapsules} />

      <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedPostType === 'timeCapsule' 
                ? "Create Time Capsule" 
                : selectedPostType === 'feature' 
                  ? "Create Feature Post" 
                  : "Create Reel"}
            </DialogTitle>
          </DialogHeader>
          <CreatePostForm onPost={handleNewPost} initialPostType={selectedPostType} />
        </DialogContent>
      </Dialog>

      <div id="posts-section">
        <PostsGrid posts={posts} />
      </div>
    </div>
  );
};

export default Profile;