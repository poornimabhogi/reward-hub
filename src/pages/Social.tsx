import { useState, useEffect } from "react";
import { Search, Volume2, VolumeX, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Status, FollowedUser } from "@/types/profile";

interface Post {
  id: number;
  username: string;
  type: 'photo' | 'video';
  content: string;
  isFollowing: boolean;
  isMuted?: boolean;
}

const Social = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      username: "jane_doe",
      type: 'photo',
      content: "https://picsum.photos/400/600",
      isFollowing: false
    },
    {
      id: 2,
      username: "john_smith",
      type: 'video',
      content: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
      isFollowing: false,
      isMuted: true
    },
  ]);
  const [timeCapsules, setTimeCapsules] = useState<Status[]>([]);
  const [followedUsers, setFollowedUsers] = useState<FollowedUser[]>(() => {
    const storedUsers = localStorage.getItem('followedUsers');
    return storedUsers ? JSON.parse(storedUsers) : [];
  });

  useEffect(() => {
    const handleNewTimeCapsule = (event: CustomEvent<Status>) => {
      const newStatus = event.detail;
      if (newStatus.postType === 'timeCapsule') {
        setTimeCapsules(prev => [newStatus, ...prev].sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ));
      }
    };

    window.addEventListener('newTimeCapsule', handleNewTimeCapsule as EventListener);
    return () => {
      window.removeEventListener('newTimeCapsule', handleNewTimeCapsule as EventListener);
    };
  }, []);

  const handleUnfollow = (username: string) => {
    const updatedUsers = followedUsers.filter(user => user.username !== username);
    setFollowedUsers(updatedUsers);
    localStorage.setItem('followedUsers', JSON.stringify(updatedUsers));
  };

  const toggleMute = (postId: number) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, isMuted: !post.isMuted }
          : post
      )
    );
  };

  const filteredPosts = posts.filter(post =>
    post.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pb-20">
      <div className="sticky top-0 z-10 bg-background pb-4 pt-4">
        <div className="container mx-auto px-4">
          {/* Search Section */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Time Capsules Section */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-medium mb-3">Today's Time Capsules</h3>
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex gap-4">
                {timeCapsules.map((capsule) => (
                  <div key={capsule.id} className="flex-none">
                    <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary p-0.5 bg-neutral">
                      {capsule.type === 'photo' ? (
                        <img
                          src={capsule.url}
                          alt="Time Capsule"
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <video
                          src={capsule.url}
                          className="w-full h-full object-cover rounded-full"
                          autoPlay
                          muted
                          loop
                          playsInline
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid gap-6">
          {filteredPosts.map((post) => (
            <div key={post.id} className="relative rounded-lg overflow-hidden bg-white shadow-lg">
              <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent z-10 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-white" />
                  <span className="text-white font-medium">{post.username}</span>
                </div>
                <Button
                  variant={post.isFollowing ? "secondary" : "default"}
                  size="sm"
                  onClick={() => handleUnfollow(post.username)}
                >
                  {post.isFollowing ? "Following" : "Follow"}
                </Button>
              </div>

              {post.type === 'photo' ? (
                <img
                  src={post.content}
                  alt={`Post by ${post.username}`}
                  className="w-full h-auto"
                />
              ) : (
                <div className="relative">
                  <video
                    src={post.content}
                    autoPlay
                    loop
                    muted={post.isMuted}
                    className="w-full h-auto"
                  />
                  <button
                    onClick={() => toggleMute(post.id)}
                    className="absolute bottom-4 right-4 p-2 rounded-full bg-black/50 text-white"
                  >
                    {post.isMuted ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Social;