import { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import { getTimeCapsules, TimeCapsule } from "@/utils/timeCapsuleUtils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface TimeCapsuleProps {
  timeCapsules: TimeCapsule[];
}

export const TimeCapsules = ({ timeCapsules: propTimeCapsules }: TimeCapsuleProps) => {
  const [localTimeCapsules, setLocalTimeCapsules] = useState<TimeCapsule[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load initial time capsules from localStorage
    const loadTimeCapsules = () => {
      const capsules = getTimeCapsules();
      console.log('Loaded time capsules in profile:', capsules);
      setLocalTimeCapsules(capsules);
    };

    loadTimeCapsules();

    // Handle new time capsule events
    const handleNewTimeCapsule = () => {
      loadTimeCapsules(); // Reload from localStorage when new capsule is added
    };

    window.addEventListener('newTimeCapsule', handleNewTimeCapsule);
    return () => {
      window.removeEventListener('newTimeCapsule', handleNewTimeCapsule);
    };
  }, []);

  const todaysCapsules = localTimeCapsules.filter(capsule => capsule.postType === 'timeCapsule');

  const handleAddClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newStatus = {
        id: Date.now(),
        type: file.type.startsWith('image/') ? 'photo' as const : 'video' as const,
        url: URL.createObjectURL(file),
        timestamp: new Date().toISOString(),
        postType: 'timeCapsule' as const,
        username: "John Doe" // Using hardcoded username for now
      };

      // Dispatch a custom event to notify the parent component
      const customEvent = new CustomEvent('newTimeCapsule', { 
        detail: newStatus 
      });
      window.dispatchEvent(customEvent);
      
      // Reset the input value so the same file can be selected again
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
            <div key={capsule.id} className="flex-none">
              <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary p-0.5 bg-neutral">
                {capsule.type === 'photo' ? (
                  <img
                    src={capsule.url}
                    alt="Time Capsule"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <video
                    src={capsule.url}
                    className="w-full h-full object-cover rounded-full"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                )}
              </div>
            </div>
          ))}

          {/* Add button circle */}
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