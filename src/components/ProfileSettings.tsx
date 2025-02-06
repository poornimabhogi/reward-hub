import { useState, useRef, useEffect } from "react";
import { Settings2, Coins } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ViewDetailsDropdown } from "./profile/ViewDetailsDropdown";
import { EditProfileForm } from "./profile/EditProfileForm";
import { MediaEditor } from "./media/MediaEditor";
import { MediaUploadButton } from "./profile/MediaUploadButton";
import { MediaPreviewDialog } from "./profile/MediaPreviewDialog";
import { toast } from "sonner";
import { addTimeCapsule, TimeCapsule } from "@/utils/timeCapsuleUtils";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export const ProfileSettings = ({ userProfile }: { userProfile: UserProfile }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editableProfile, setEditableProfile] = useState(userProfile);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPostType, setSelectedPostType] = useState<'timeCapsule' | 'feature' | 'reel'>('feature');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEditingMedia, setIsEditingMedia] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setIsEditingMedia(true);
      event.target.value = '';
    }
  };

  const handleSaveEdit = (editedFile: File) => {
    if (editedFile) {
      const fileUrl = URL.createObjectURL(editedFile);
      const fileType = editedFile.type.startsWith('image/') ? 'photo' as const : 'video' as const;
      
      const id = Date.now();
      const timestamp = new Date().toISOString();
      
      if (selectedPostType === 'timeCapsule') {
        const newCapsule: TimeCapsule = {
          id,
          type: fileType,
          url: fileUrl,
          timestamp,
          postType: 'timeCapsule',
          username: userProfile.name
        };
        const event = new CustomEvent('newTimeCapsule', { detail: newCapsule });
        window.dispatchEvent(event);
      } else {
        const newFeaturePost = {
          id,
          type: fileType,
          url: fileUrl,
          timestamp,
          postType: 'feature',
          username: userProfile.name
        };
        const event = new CustomEvent('newFeaturePost', { detail: newFeaturePost });
        window.dispatchEvent(event);
      }

      addTimeCapsule(newCapsule);
      toast.success(`${selectedPostType === 'timeCapsule' ? "Time capsule" : "Post"} added!`);
      
      setSelectedFile(null);
      setIsEditingMedia(false);
    }
  };

  useEffect(() => {
    const handleOpenPhotoGallery = (event: CustomEvent<{ postType: 'timeCapsule' | 'feature' | 'reel' }>) => {
      setSelectedPostType(event.detail.postType);
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    };

    window.addEventListener('openPhotoGallery', handleOpenPhotoGallery as EventListener);
    return () => {
      window.removeEventListener('openPhotoGallery', handleOpenPhotoGallery as EventListener);
    };
  }, []);

  const handleSelectPostType = (postType: 'timeCapsule' | 'feature' | 'reel') => {
    setSelectedPostType(postType);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="absolute right-4 top-4 flex items-center gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={handleFileSelect}
      />
      
      <MediaUploadButton onSelectPostType={handleSelectPostType} />

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Settings2 className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Profile Settings</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <ViewDetailsDropdown userProfile={userProfile} />
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Settings2 className="h-4 w-4" /> Edit Profile
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => navigate('/earnings')}
            >
              <Coins className="h-4 w-4" /> Earn With Us
            </Button>

            {isEditing && (
              <EditProfileForm
                editableProfile={editableProfile}
                setEditableProfile={setEditableProfile}
                onSave={() => setIsEditing(false)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditingMedia} onOpenChange={(open) => !open && setIsEditingMedia(false)}>
        <DialogContent className="max-w-none p-0 h-screen w-screen bg-transparent border-none">
          {selectedFile && (
            <MediaEditor
              file={selectedFile}
              onSave={handleSaveEdit}
              onCancel={() => setIsEditingMedia(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};