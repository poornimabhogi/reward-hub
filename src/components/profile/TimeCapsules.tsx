import { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import { getTimeCapsules, TimeCapsule, addTimeCapsule } from "@/utils/timeCapsuleUtils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface TimeCapsuleProps {
  timeCapsules: TimeCapsule[];
}

export const TimeCapsules = ({ timeCapsules: propTimeCapsules }: TimeCapsuleProps) => {
  const [localTimeCapsules, setLocalTimeCapsules] = useState<TimeCapsule[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const clickTimestamps = useRef<{ [key: number]: number }>({});
  const { user } = useAuth();

  useEffect(() => {
    const loadTimeCapsules = () => {
      const capsules = getTimeCapsules().filter(capsule => {
        return capsule.url && 
               capsule.username && 
               capsule.postType === 'timeCapsule' &&
               (capsule.type === 'photo' || capsule.type === 'video');
      });
      console.log('Loaded valid time capsules in profile:', capsules);
      setLocalTimeCapsules(capsules);
    };

    loadTimeCapsules();

    const handleNewTimeCapsule = () => {
      loadTimeCapsules();
    };

    window.addEventListener('newTimeCapsule', handleNewTimeCapsule);
    return () => {
      window.removeEventListener('newTimeCapsule', handleNewTimeCapsule);
    };
  }, []);

  const handleDelete = (capsuleId: number, capsuleUsername: string) => {
    // Check if the capsule belongs to the current user
    if (capsuleUsername !== user?.name) {
      toast.error("You can only delete your own time capsules!");
      return;
    }

    const now = Date.now();
    const lastClick = clickTimestamps.current[capsuleId] || 0;
    
    if (now - lastClick < 300) { // Double click within 300ms
      const updatedCapsules = getTimeCapsules().filter(tc => tc.id !== capsuleId);
      localStorage.setItem('timeCapsules', JSON.stringify(updatedCapsules));
      setLocalTimeCapsules(prev => prev.filter(tc => tc.id !== capsuleId));
      toast.success("Time capsule deleted!");
      clickTimestamps.current[capsuleId] = 0; // Reset timestamp
    } else {
      clickTimestamps.current[capsuleId] = now;
    }
  };

  const todaysCapsules = localTimeCapsules.filter(capsule => capsule.postType === 'timeCapsule');

  const handleAddClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && user) {
      const newCapsule: TimeCapsule = {
        id: Date.now(),
        type: file.type.startsWith('image/') ? 'photo' : 'video',
        url: URL.createObjectURL(file),
        timestamp: new Date().toISOString(),
        postType: 'timeCapsule',
        username: user.name
      };

      addTimeCapsule(newCapsule);
      toast.success("Time capsule added!");
      
      event.target.value = '';
    }
  };

  return (
    <div className="mb-8 bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-sm font-medium mb-3">Today's Time Capsules</h3>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={handleFileSelect}
      />
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-4">
          {todaysCapsules.map((capsule) => (
            <div 
              key={capsule.id} 
              className="flex-none cursor-pointer"
              onClick={() => handleDelete(capsule.id, capsule.username)}
            >
              <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary p-0.5 bg-neutral">
                {capsule.type === 'photo' ? (
                  <img
                    src={capsule.url}
                    alt="Time Capsule"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      setLocalTimeCapsules(prev => 
                        prev.filter(tc => tc.id !== capsule.id)
                      );
                    }}
                  />
                ) : (
                  <video
                    src={capsule.url}
                    className="w-full h-full object-cover rounded-full"
                    autoPlay
                    muted
                    loop
                    playsInline
                    onError={(e) => {
                      setLocalTimeCapsules(prev => 
                        prev.filter(tc => tc.id !== capsule.id)
                      );
                    }}
                  />
                )}
              </div>
            </div>
          ))}

          <div className="flex-none">
            <Button
              variant="outline"
              className="w-16 h-16 rounded-full p-0 border-2 border-dashed border-primary hover:border-primary/80"
              onClick={handleAddClick}
            >
              <Plus className="h-6 w-6 text-primary" />
            </Button>
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};