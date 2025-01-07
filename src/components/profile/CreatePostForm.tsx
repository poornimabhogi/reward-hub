import { useState } from "react";
import { Image, Send, Film, CircleDot, LayoutGrid, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Status } from "@/types/profile";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreatePostFormProps {
  onPost: (newStatus: Status, postType: 'timeCapsule' | 'feature' | 'reel') => void;
  initialPostType?: 'timeCapsule' | 'feature' | 'reel';
}

export const CreatePostForm = ({ onPost, initialPostType = 'feature' }: CreatePostFormProps) => {
  const [thoughtText, setThoughtText] = useState('');
  const [thoughtMedia, setThoughtMedia] = useState<File | null>(null);
  const [postType, setPostType] = useState<'timeCapsule' | 'feature' | 'reel'>(initialPostType);

  const validateVideoDuration = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        const duration = video.duration;
        
        if (postType === 'reel') {
          if (duration < 30) {
            toast.error("Reels must be at least 30 seconds long");
            resolve(false);
          } else if (duration > 900) { // 15 minutes = 900 seconds
            toast.error("Reels cannot be longer than 15 minutes");
            resolve(false);
          } else {
            resolve(true);
          }
        } else {
          resolve(true); // No duration restrictions for other post types
        }
      };

      video.src = URL.createObjectURL(file);
    });
  };

  const handleMediaChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('video/')) {
      const isValidDuration = await validateVideoDuration(file);
      if (!isValidDuration) {
        e.target.value = ''; // Reset input
        return;
      }
    }

    setThoughtMedia(file);
  };

  const handleSubmit = () => {
    if (thoughtText.trim() || thoughtMedia) {
      const newStatus: Status = {
        id: Date.now(),
        type: thoughtMedia?.type.startsWith('image/') ? 'photo' : 'video',
        url: thoughtMedia ? URL.createObjectURL(thoughtMedia) : '',
        timestamp: new Date(),
        postType
      };
      onPost(newStatus, postType);
      setThoughtText('');
      setThoughtMedia(null);
      toast.success(`${postType === 'timeCapsule' ? "Time capsule" : "Post"} created!`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-4">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={() => document.getElementById('photoInput')?.click()}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Select value={postType} onValueChange={(value: 'timeCapsule' | 'feature' | 'reel') => setPostType(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select post type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="timeCapsule">Today's Capsule</SelectItem>
            <SelectItem value="feature">Feature Post</SelectItem>
            <SelectItem value="reel">Reel</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <input
        id="photoInput"
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={handleMediaChange}
      />

      <Textarea
        placeholder="Share your thoughts..."
        value={thoughtText}
        onChange={(e) => setThoughtText(e.target.value)}
        className="min-h-[80px]"
      />
      
      {thoughtMedia && (
        <span className="text-sm text-muted-foreground">
          Selected: {thoughtMedia.name}
        </span>
      )}

      <div className="flex justify-end">
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={!thoughtText.trim() && !thoughtMedia}
        >
          <Send className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  );
};