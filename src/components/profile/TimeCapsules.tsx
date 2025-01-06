import { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import { Status } from "@/types/profile";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface TimeCapsuleProps {
  timeCapsules: Status[];
}

export const TimeCapsules = ({ timeCapsules }: TimeCapsuleProps) => {
  const todaysCapsules = timeCapsules.filter(capsule => capsule.postType === 'timeCapsule');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load time capsules from localStorage on component mount
    const storedCapsules = localStorage.getItem('timeCapsules');
    if (storedCapsules) {
      const parsedCapsules = JSON.parse(storedCapsules);
      // Only show capsules from today
      const today = new Date().toDateString();
      const todaysCapsules = parsedCapsules.filter((capsule: Status) => 
        new Date(capsule.timestamp).toDateString() === today
      );
      // Dispatch event to update Social screen
      todaysCapsules.forEach((capsule: Status) => {
        const event = new CustomEvent('newTimeCapsule', { detail: capsule });
        window.dispatchEvent(event);
      });
    }
  }, []);

  const handleAddClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newStatus: Status = {
        id: Date.now(),
        type: file.type.startsWith('image/') ? 'photo' : 'video',
        url: URL.createObjectURL(file),
        timestamp: new Date(),
        postType: 'timeCapsule'
      };

      // Save to localStorage
      const storedCapsules = localStorage.getItem('timeCapsules');
      const capsules = storedCapsules ? JSON.parse(storedCapsules) : [];
      capsules.unshift(newStatus);
      localStorage.setItem('timeCapsules', JSON.stringify(capsules));

      // Dispatch event to notify both Profile and Social components
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