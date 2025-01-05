import { useState } from "react";
import { Status } from "@/types/profile";
import { LayoutGrid, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PostsGridProps {
  posts: Status[];
}

export const PostsGrid = ({ posts }: PostsGridProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const featurePosts = posts.filter(post => post.postType === 'feature' || post.postType === 'reel');
  
  if (featurePosts.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No posts yet. Share your first post!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <Button
          variant={viewMode === 'grid' ? 'default' : 'outline'}
          size="icon"
          onClick={() => setViewMode('grid')}
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'outline'}
          size="icon"
          onClick={() => setViewMode('list')}
        >
          <LayoutList className="h-4 w-4" />
        </Button>
      </div>

      <div className={viewMode === 'grid' 
        ? "grid grid-cols-3 gap-1"
        : "flex flex-col gap-4"
      }>
        {featurePosts.map((post) => (
          <div 
            key={post.id} 
            className={viewMode === 'grid'
              ? "aspect-square relative"
              : "w-full aspect-[16/9] relative"
            }
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
                autoPlay
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