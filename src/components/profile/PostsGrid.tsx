import { useState } from "react";
import { Status } from "@/types/profile";
import { LayoutGrid, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PostsGridProps {
  posts: Status[];
  viewMode?: 'grid' | 'list';
}

export const PostsGrid = ({ posts, viewMode: externalViewMode }: PostsGridProps) => {
  const [internalViewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const featurePosts = posts.filter(post => post.postType === 'feature' || post.postType === 'reel');
  
  // Use external viewMode if provided, otherwise use internal state
  const currentViewMode = externalViewMode || internalViewMode;
  
  if (featurePosts.length === 0) {
    return (
      <div className="mt-8">
        <p className="text-center text-muted-foreground py-8">
          No posts yet. Share your first post!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-8">
      <div className="flex justify-end gap-2">
        <Button
          variant={currentViewMode === 'grid' ? 'default' : 'outline'}
          size="icon"
          onClick={() => setViewMode('grid')}
          title="Grid View"
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
        <Button
          variant={currentViewMode === 'list' ? 'default' : 'outline'}
          size="icon"
          onClick={() => setViewMode('list')}
          title="List View"
        >
          <LayoutList className="h-4 w-4" />
        </Button>
      </div>

      <div 
        className={`${
          currentViewMode === 'grid' 
            ? "grid grid-cols-3 gap-4"
            : "flex flex-col gap-4"
        } animate-fade-in`}
      >
        {featurePosts.map((post) => (
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
        ))}
      </div>
    </div>
  );
};