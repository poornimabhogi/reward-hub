import { useState } from "react";
import { User, Settings2, Edit, Eye, Plus, Image, Video } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Status {
  id: number;
  type: 'photo' | 'video';
  url: string;
  timestamp: Date;
}

export const ProfileSettings = ({ userProfile }: { userProfile: { name: string; email?: string; }}) => {
  const [statusFeedEnabled, setStatusFeedEnabled] = useState(false);
  const [statuses, setStatuses] = useState<Status[]>([]);

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
            <Button variant="outline" className="w-full justify-start gap-2">
              <Eye className="h-4 w-4" /> View Details
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Edit className="h-4 w-4" /> Edit Profile
            </Button>
          </div>

          {/* Daily Status Feed */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Daily Status Feed</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStatusFeedEnabled(!statusFeedEnabled)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {statusFeedEnabled && (
              <>
                <div className="flex gap-2">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <Image className="h-5 w-5" />
                    </div>
                  </label>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <Video className="h-5 w-5" />
                    </div>
                  </label>
                </div>

                {/* Status Feed Display */}
                {statuses.length > 0 && (
                  <div className="overflow-x-auto">
                    <div className="flex gap-4 pb-2">
                      {statuses.map((status) => (
                        <div key={status.id} className="flex-shrink-0 w-24">
                          {status.type === 'photo' ? (
                            <img
                              src={status.url}
                              alt="Status"
                              className="w-24 h-24 rounded-lg object-cover"
                            />
                          ) : (
                            <video
                              src={status.url}
                              className="w-24 h-24 rounded-lg object-cover"
                              autoPlay
                              muted
                              loop
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};