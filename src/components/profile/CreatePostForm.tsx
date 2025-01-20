import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface CreatePostFormProps {
  onPost: (newStatus: Status, postType: 'timeCapsule' | 'feature' | 'reel') => void;
  initialPostType: 'timeCapsule' | 'feature' | 'reel';
}

export const CreatePostForm = ({ onPost, initialPostType }: CreatePostFormProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [selectedPostType, setSelectedPostType] = useState(initialPostType);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedFile) {
      const fileUrl = URL.createObjectURL(selectedFile);
      const fileType = selectedFile.type.startsWith('image/') ? 'photo' as const : 'video' as const;
      
      const newStatus: Status = {
        id: Date.now(),
        type: fileType,
        url: fileUrl,
        timestamp: new Date(),
        postType: selectedPostType,
        caption: caption,
        likes: 0,
        comments: 0,
        shares: 0
      };

      onPost(newStatus, selectedPostType);
      setCaption('');
      setSelectedFile(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
        required
      />
      <Input
        placeholder="Add a caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <Button type="submit">Post</Button>
    </form>
  );
};
