import { useState } from "react";
import { User, Settings2, Edit, Eye, Plus, Image, Video } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Status {
  id: number;
  type: 'photo' | 'video';
  url: string;
  timestamp: Date;
}

export const ProfileSettings = ({ userProfile }: { userProfile: { name: string; email?: string; phone?: string; address?: string }}) => {
  const [statusFeedEnabled, setStatusFeedEnabled] = useState(false);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editableProfile, setEditableProfile] = useState(userProfile);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileType = file.type.startsWith('image/') ? 'photo' : 'video';
      const newStatus: Status = {
        id: Date.now(),
        type: fileType,
        url: URL.createObjectURL(file),
        timestamp: new Date(),
      };
      setStatuses([newStatus, ...statuses]);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="absolute right-4 top-4">
          <Settings2 className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Profile Actions */}
          <div className="space-y-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Eye className="h-4 w-4" /> View Details
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[300px]">
                <DropdownMenuItem className="flex flex-col items-start gap-1">
                  <span className="font-medium text-sm">Name</span>
                  <span className="text-muted-foreground">{userProfile.name}</span>
                </DropdownMenuItem>
                {userProfile.email && (
                  <DropdownMenuItem className="flex flex-col items-start gap-1">
                    <span className="font-medium text-sm">Email</span>
                    <span className="text-muted-foreground">{userProfile.email}</span>
                  </DropdownMenuItem>
                )}
                {userProfile.phone && (
                  <DropdownMenuItem className="flex flex-col items-start gap-1">
                    <span className="font-medium text-sm">Phone</span>
                    <span className="text-muted-foreground">{userProfile.phone}</span>
                  </DropdownMenuItem>
                )}
                {userProfile.address && (
                  <DropdownMenuItem className="flex flex-col items-start gap-1">
                    <span className="font-medium text-sm">Address</span>
                    <span className="text-muted-foreground">{userProfile.address}</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="h-4 w-4" /> Edit Profile
            </Button>
          </div>

          {/* Edit Form */}
          {isEditing && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={editableProfile.name}
                  onChange={(e) => setEditableProfile({ ...editableProfile, name: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              {userProfile.email !== undefined && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <input
                    type="email"
                    value={editableProfile.email}
                    onChange={(e) => setEditableProfile({ ...editableProfile, email: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
              )}
              {userProfile.phone !== undefined && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <input
                    type="tel"
                    value={editableProfile.phone}
                    onChange={(e) => setEditableProfile({ ...editableProfile, phone: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
              )}
              {userProfile.address !== undefined && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Address</label>
                  <input
                    type="text"
                    value={editableProfile.address}
                    onChange={(e) => setEditableProfile({ ...editableProfile, address: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
              )}
              <Button onClick={handleSave} className="w-full">Save Changes</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};