import { useState } from "react";
import { Settings2, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ViewDetailsDropdown } from "./profile/ViewDetailsDropdown";
import { EditProfileForm } from "./profile/EditProfileForm";
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

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="absolute right-4 top-4 flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Plus className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Today's Time Capsule</DropdownMenuItem>
          <DropdownMenuItem>Feature Post</DropdownMenuItem>
          <DropdownMenuItem>Reel</DropdownMenuItem>
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
            <div className="space-y-2">
              <ViewDetailsDropdown userProfile={userProfile} />
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Settings2 className="h-4 w-4" /> Edit Profile
              </Button>
            </div>

            {isEditing && (
              <EditProfileForm
                editableProfile={editableProfile}
                setEditableProfile={setEditableProfile}
                onSave={handleSave}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};