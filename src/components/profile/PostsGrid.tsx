import { useState } from "react";
import { Status } from "@/types/profile";
import { LayoutGrid, LayoutList, PlusSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PostInteractions } from "@/components/social/PostInteractions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PostsGridProps {
  posts: Status[];
  viewMode?: 'grid' | 'list';
}

export const PostsGrid = ({ posts, viewMode: externalViewMode }: PostsGridProps) => {
  const [internalViewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const featurePosts = posts.filter(post => post.postType === 'feature' || post.postType === 'reel');
  
  const currentViewMode = externalViewMode || internalViewMode;

  const handleAddPost = () => {
    const event = new CustomEvent('openPhotoGallery', { 
      detail: { postType: 'feature' }
    });
    window.dispatchEvent(event);
  };

  const handleInteraction = (postId: number, type: 'like' | 'comment' | 'share', count: number) => {
    // In a real app, this would update the backend
    console.log(`Post ${postId} ${type} count updated to ${count}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-t pt-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium">Feature Posts</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 flex items-center justify-center"
                  onClick={handleAddPost}
                >
                  <PlusSquare className="h-10 w-10 text-black" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add Feature Post</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={currentViewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Grid View</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={currentViewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <LayoutList className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>List View</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div 
        className={`${
          currentViewMode === 'grid' 
            ? "grid grid-cols-2 gap-6"
            : "flex flex-col gap-4"
        } animate-fade-in`}
      >
        {featurePosts.length > 0 ? (
          featurePosts.map((post) => (
            <div 
              key={post.id} 
              className="relative group"
            >
              <div 
                className={`${
                  currentViewMode === 'grid'
                    ? "aspect-square w-full"
                    : "w-full aspect-[16/9]"
                } relative overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200`}
              >
                {post.type === 'photo' ? (
                  <img
                    src={post.url}
                    alt={post.caption || "Post"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={post.url}
                    className="w-full h-full object-cover"
                    controls
                    muted
                    loop
                  />
                )}
                {post.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <p className="text-sm line-clamp-2">{post.caption}</p>
                  </div>
                )}
              </div>
              <PostInteractions
                postId={post.id}
                initialLikes={post.likes}
                initialComments={post.comments}
                initialShares={post.shares}
                onInteraction={(type, count) => handleInteraction(post.id, type, count)}
              />
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center text-muted-foreground py-8">
            No posts yet. Share your first post!
          </div>
        )}
      </div>
    </div>
  );
};