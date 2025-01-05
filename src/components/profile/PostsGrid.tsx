import { useState } from "react";
import { Status } from "@/types/profile";
import { LayoutGrid, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-t pt-4">
        <h3 className="text-lg font-medium">Feature Posts</h3>
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
            ? "grid grid-cols-3 gap-4"
            : "flex flex-col gap-4"
        } animate-fade-in`}
      >
        {featurePosts.length > 0 ? (
          featurePosts.map((post) => (
            <div 
              key={post.id} 
              className={`${
                currentViewMode === 'grid'
                  ? "aspect-square"
                  : "w-full aspect-[16/9]"
              } relative overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200`}
            >
              {post.type === 'photo' ? (
                <img
                  src={post.url}
                  alt="Post"
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
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center text-muted-foreground py-8">
            No posts yet. Share your first post!
          </div>
        )}
      </div>
    </div>
  );
};