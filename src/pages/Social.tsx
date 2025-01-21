import { useState, useEffect } from "react";
import { Search, Volume2, VolumeX, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { SocialTimeCapsules } from "@/components/social/SocialTimeCapsules";
import { VideoViewer } from "@/components/social/VideoViewer";

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
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null);
  const [followedUsers, setFollowedUsers] = useState<FollowedUser[]>(() => {
    const stored = localStorage.getItem('followedUsers');
    return stored ? JSON.parse(stored) : [];
  });
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

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('followedUsers') || '[]');
    setPosts(posts.map(post => ({
      ...post,
      isFollowing: storedUsers.some((user: FollowedUser) => user.username === post.username)
    })));
  }, []);

  const handleFollow = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newState = !post.isFollowing;
        
        const updatedFollowedUsers = [...followedUsers];
        if (newState) {
          updatedFollowedUsers.push({ username: post.username, isFollowing: true });
        } else {
          const index = updatedFollowedUsers.findIndex(user => user.username === post.username);
          if (index > -1) updatedFollowedUsers.splice(index, 1);
        }
        
        setFollowedUsers(updatedFollowedUsers);
        localStorage.setItem('followedUsers', JSON.stringify(updatedFollowedUsers));

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

  const handleVideoClick = (videoUrl: string, postId: number) => {
    setSelectedVideo(videoUrl);
    setSelectedVideoId(postId);
  };

  const filteredPosts = posts.filter(post =>
    post.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const videoOnlyPosts = posts.filter(post => post.type === 'video').map(post => ({
    id: post.id,
    content: post.content
  }));

  return (
    <div className="min-h-screen pb-20">
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 space-y-6">
        <SocialTimeCapsules followedUsers={followedUsers} />
        
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
                  onClick={() => handleFollow(post.id)}
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
                    className="w-full h-auto cursor-pointer"
                    onClick={() => handleVideoClick(post.content, post.id)}
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

      <VideoViewer
        isOpen={!!selectedVideo}
        onClose={() => {
          setSelectedVideo(null);
          setSelectedVideoId(null);
        }}
        videoUrl={selectedVideo || ''}
        allVideos={videoOnlyPosts}
        currentVideoId={selectedVideoId || 0}
      />
    </div>
  );
};

export default Social;