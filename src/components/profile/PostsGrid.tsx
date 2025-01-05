import { Status } from "@/types/profile";

interface PostsGridProps {
  posts: Status[];
  viewMode: 'grid' | 'list';
}

export const PostsGrid = ({ posts, viewMode }: PostsGridProps) => {
  const regularPosts = posts.filter(post => !post.isTimeCapsule);
  
  if (regularPosts.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No posts yet. Share your first post!
      </p>
    );
  }

  return (
    <div className={viewMode === 'grid' 
      ? "grid grid-cols-2 md:grid-cols-3 gap-4"
      : "flex flex-col gap-4"
    }>
      {regularPosts.map((post) => (
        <div 
          key={post.id} 
          className={viewMode === 'grid'
            ? "aspect-square relative rounded-lg overflow-hidden"
            : "w-full aspect-[16/9] relative rounded-lg overflow-hidden"
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
  );
};