import { Status } from "@/types/profile";

interface PostsGridProps {
  posts: Status[];
}

export const PostsGrid = ({ posts }: PostsGridProps) => {
  if (posts.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No posts yet. Share your first post!
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
      {posts.map((post) => (
        <div key={post.id} className="aspect-square relative rounded-lg overflow-hidden">
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