import { useState } from "react";
import { ThumbsUp, MessageSquare, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PostInteractionsProps {
  postId: number;
  initialLikes?: number;
  initialComments?: number;
  initialShares?: number;
  onInteraction?: (type: 'like' | 'comment' | 'share', count: number) => void;
}

export const PostInteractions = ({
  postId,
  initialLikes = 0,
  initialComments = 0,
  initialShares = 0,
  onInteraction
}: PostInteractionsProps) => {
  const [likes, setLikes] = useState(initialLikes);
  const [comments, setComments] = useState(initialComments);
  const [shares, setShares] = useState(initialShares);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    const newLikes = isLiked ? likes - 1 : likes + 1;
    setLikes(newLikes);
    setIsLiked(!isLiked);
    onInteraction?.('like', newLikes);
    
    if (!isLiked) {
      toast.success("Post liked!");
    }
  };

  const handleComment = () => {
    const newComments = comments + 1;
    setComments(newComments);
    onInteraction?.('comment', newComments);
    toast("Comments feature coming soon!");
  };

  const handleShare = () => {
    const newShares = shares + 1;
    setShares(newShares);
    onInteraction?.('share', newShares);
    toast.success("Post shared!");
  };

  return (
    <div className="flex items-center gap-4 py-2">
      <Button
        variant="ghost"
        size="sm"
        className={`flex items-center gap-1 ${isLiked ? 'text-primary' : ''}`}
        onClick={handleLike}
      >
        <ThumbsUp className="h-4 w-4" />
        <span>{likes}</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-1"
        onClick={handleComment}
      >
        <MessageSquare className="h-4 w-4" />
        <span>{comments}</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-1"
        onClick={handleShare}
      >
        <Share2 className="h-4 w-4" />
        <span>{shares}</span>
      </Button>
    </div>
  );
};