import { useState } from "react";
import { Image, Send, Film, LayoutGrid, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Status } from "@/types/profile";
import { toast } from "sonner";

interface CreatePostFormProps {
  onPost: (newStatus: Status, isTimeCapsule: boolean) => void;
}

export const CreatePostForm = ({ onPost }: CreatePostFormProps) => {
  const [thoughtText, setThoughtText] = useState('');
  const [thoughtMedia, setThoughtMedia] = useState<File | null>(null);
  const [isTimeCapsule, setIsTimeCapsule] = useState(false);

  const handleSubmit = () => {
    if (thoughtText.trim() || thoughtMedia) {
      const newStatus: Status = {
        id: Date.now(),
        type: thoughtMedia?.type.startsWith('image/') ? 'photo' : 'video',
        url: thoughtMedia ? URL.createObjectURL(thoughtMedia) : '',
        timestamp: new Date(),
        isTimeCapsule
      };
      onPost(newStatus, isTimeCapsule);
      setThoughtText('');
      setThoughtMedia(null);
      toast.success(isTimeCapsule ? "Time capsule created!" : "Post created!");
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Share your thoughts..."
        value={thoughtText}
        onChange={(e) => setThoughtText(e.target.value)}
        className="min-h-[100px]"
      />
      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setThoughtMedia(e.target.files?.[0] || null)}
            />
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted hover:bg-muted/80">
              <Image className="h-5 w-5" />
            </div>
          </label>
          <label className="cursor-pointer">
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => setThoughtMedia(e.target.files?.[0] || null)}
            />
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted hover:bg-muted/80">
              <Film className="h-5 w-5" />
            </div>
          </label>
        </div>
        {thoughtMedia && (
          <span className="text-sm text-muted-foreground">
            {thoughtMedia.name}
          </span>
        )}
        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsTimeCapsule(!isTimeCapsule)}
            className={isTimeCapsule ? "bg-primary text-white" : ""}
          >
            Time Capsule
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!thoughtText.trim() && !thoughtMedia}
          >
            <Send className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};