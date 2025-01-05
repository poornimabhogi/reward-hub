import { useState, useEffect } from "react";
import { Search, Volume2, VolumeX, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface Post {
  id: number;
  username: string;
  type: 'photo' | 'video';
  content: string;
  isFollowing: boolean;
  isMuted?: boolean;
}

interface FollowedUser {
  username: string;
  isFollowing: boolean;
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

  // Initialize posts with following status from localStorage
  useEffect(() => {
    const followedUsers = JSON.parse(localStorage.getItem('followedUsers') || '[]');
    setPosts(posts.map(post => ({
      ...post,
      isFollowing: followedUsers.some((user: FollowedUser) => user.username === post.username)
    })));
  }, []);

  const handleFollow = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newState = !post.isFollowing;
        
        // Update localStorage
        const followedUsers = JSON.parse(localStorage.getItem('followedUsers') || '[]');
        if (newState) {
          followedUsers.push({ username: post.username, isFollowing: true });
        } else {
          const index = followedUsers.findIndex((user: FollowedUser) => user.username === post.username);
          if (index > -1) followedUsers.splice(index, 1);
        }
        localStorage.setItem('followedUsers', JSON.stringify(followedUsers));

        toast({
          title: newState ? "Following" : "Unfollowed",
          description: `You ${newState ? 'are now following' : 'have unfollowed'} ${post.username}`,
        });
        return { ...post, isFollowing: newState };
      }
      return post;
    }));
  };

  const toggleMute = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId && post.type === 'video') {
        return { ...post, isMuted: !post.isMuted };
      }
      return post;
    }));
  };

  const filteredPosts = posts.filter(post =>
    post.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 pb-20 pt-4">
      {/* Search Bar */}
      <div className="sticky top-0 z-10 bg-background pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid gap-6">
        {filteredPosts.map((post) => (
          <div key={post.id} className="relative rounded-lg overflow-hidden bg-white shadow-lg">
            {/* Username and Follow Button */}
            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent z-10 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-white" />
                <span className="text-white font-medium">{post.username}</span>
              </div>
              <Button
                variant={post.isFollowing ? "secondary" : "default"}
                size="sm"
                onClick={() => handleFollow(post.id)}
              >
                {post.isFollowing ? "Following" : "Follow"}
              </Button>
            </div>

            {/* Content */}
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
  );
};

export default Social;