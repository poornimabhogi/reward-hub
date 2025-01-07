import { useState, useRef, useEffect } from "react";
import { Settings2, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ViewDetailsDropdown } from "./profile/ViewDetailsDropdown";
import { EditProfileForm } from "./profile/EditProfileForm";
import { toast } from "sonner";
import { addTimeCapsule, TimeCapsule } from "@/utils/timeCapsuleUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserProfile {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export const ProfileSettings = ({ userProfile }: { userProfile: UserProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableProfile, setEditableProfile] = useState(userProfile);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPostType, setSelectedPostType] = useState<'timeCapsule' | 'feature' | 'reel'>('feature');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setIsConfirmDialogOpen(true);
      event.target.value = '';
    }
  };

  const handleConfirmPost = () => {
    if (selectedFile) {
      const fileUrl = URL.createObjectURL(selectedFile);
      const fileType = selectedFile.type.startsWith('image/') ? 'photo' as const : 'video' as const;
      
      const newCapsule: TimeCapsule = {
        id: Date.now(),
        type: fileType,
        url: fileUrl,
        timestamp: new Date().toISOString(),
        postType: selectedPostType,
        username: userProfile.name
      };

      addTimeCapsule(newCapsule);
      toast.success(`${selectedPostType === 'timeCapsule' ? "Time capsule" : "Post"} added!`);
      console.log('New time capsule added:', newCapsule);
      
      setSelectedFile(null);
      setIsConfirmDialogOpen(false);
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

  const handleDropdownItemClick = (postType: 'timeCapsule' | 'feature' | 'reel') => {
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
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Plus className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleDropdownItemClick('timeCapsule')}>
            Today's Time Capsule
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDropdownItemClick('feature')}>
            Feature Post
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDropdownItemClick('reel')}>
            Reel
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Preview Post</span>
              <Button onClick={handleConfirmPost} size="sm">
                Post
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedFile && (
              <div className="w-full max-h-[70vh] relative overflow-hidden rounded-lg">
                {selectedFile.type.startsWith('image/') ? (
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <video
                    src={URL.createObjectURL(selectedFile)}
                    className="w-full h-full object-contain"
                    controls
                  />
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};