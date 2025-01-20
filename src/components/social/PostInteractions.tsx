import { useState } from "react";
import { ThumbsUp, MessageSquare, Share2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Comment {
  id: number;
  text: string;
  username: string;
  timestamp: Date;
}

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
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [postComments, setPostComments] = useState<Comment[]>([]);

  const handleLike = () => {
    const newLikes = isLiked ? likes - 1 : likes + 1;
    setLikes(newLikes);
    setIsLiked(!isLiked);
    onInteraction?.('like', newLikes);
    
    if (!isLiked) {
      toast.success("Post liked!");
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now(),
        text: newComment,
        username: "You", // In a real app, this would come from auth context
        timestamp: new Date(),
      };
      
      setPostComments([comment, ...postComments]);
      setComments(comments + 1);
      onInteraction?.('comment', comments + 1);
      setNewComment("");
      toast.success("Comment added!");
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this post!',
          text: 'I found this interesting post',
          url: window.location.href,
        });
        const newShares = shares + 1;
        setShares(newShares);
        onInteraction?.('share', newShares);
        toast.success("Post shared successfully!");
      } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      toast.error("Failed to share post");
    }
  };

  return (
    <>
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
          onClick={() => setIsCommentDialogOpen(true)}
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

      <Dialog open={isCommentDialogOpen} onOpenChange={setIsCommentDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col gap-4">
            <ScrollArea className="h-[300px] w-full pr-4">
              {postComments.length > 0 ? (
                <div className="space-y-4">
                  {postComments.map((comment) => (
                    <div key={comment.id} className="bg-muted p-3 rounded-lg">
                      <div className="flex justify-between items-start">
                        <span className="font-medium">{comment.username}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-1 text-sm">{comment.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">No comments yet</p>
              )}
            </ScrollArea>
            
            <div className="flex gap-2">
              <Input
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
              />
              <Button size="icon" onClick={handleAddComment}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};