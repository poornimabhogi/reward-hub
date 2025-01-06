import { useState, useEffect, useRef } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getTimeCapsules, TimeCapsule } from "@/utils/timeCapsuleUtils";
import { toast } from "sonner";

interface SocialTimeCapsuleProps {
  followedUsers: { username: string; isFollowing: boolean; }[];
}

export const SocialTimeCapsules = ({ followedUsers }: SocialTimeCapsuleProps) => {
  const [timeCapsules, setTimeCapsules] = useState<TimeCapsule[]>([]);
  const currentUser = "John Doe";
  const clickTimestamps = useRef<{ [key: number]: number }>({});

  useEffect(() => {
    const loadTimeCapsules = () => {
      const capsules = getTimeCapsules().filter(capsule => {
        try {
          new URL(capsule.url);
          return capsule.url && 
                 capsule.username && 
                 capsule.postType === 'timeCapsule' &&
                 (capsule.type === 'photo' || capsule.type === 'video');
        } catch {
          return false;
        }
      });
      console.log('Loaded valid time capsules in social:', capsules);
      setTimeCapsules(capsules);
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

  const filteredCapsules = timeCapsules
    .filter(capsule => 
      capsule.postType === 'timeCapsule' &&
      (capsule.username === currentUser || 
       followedUsers.some(user => user.username === capsule.username && user.isFollowing))
    )
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const handleDelete = (capsuleId: number, username: string) => {
    if (username !== currentUser) {
      toast.error("You can only delete your own time capsules!");
      return;
    }

    const now = Date.now();
    const lastClick = clickTimestamps.current[capsuleId] || 0;
    
    if (now - lastClick < 300) { // Double click within 300ms
      const updatedCapsules = getTimeCapsules().filter(tc => tc.id !== capsuleId);
      localStorage.setItem('timeCapsules', JSON.stringify(updatedCapsules));
      setTimeCapsules(prev => prev.filter(tc => tc.id !== capsuleId));
      toast.success("Time capsule deleted!");
      clickTimestamps.current[capsuleId] = 0; // Reset timestamp
    } else {
      clickTimestamps.current[capsuleId] = now;
    }
  };

  const handleMediaError = (capsuleId: number) => {
    setTimeCapsules(prev => prev.filter(tc => tc.id !== capsuleId));
    const storedCapsules = getTimeCapsules();
    localStorage.setItem('timeCapsules', JSON.stringify(
      storedCapsules.filter(tc => tc.id !== capsuleId)
    ));
  };

  return (
    <div className="mb-8 bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-sm font-medium mb-3">Today's Time Capsules</h3>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-4">
          {filteredCapsules.map((capsule) => (
            <div 
              key={capsule.id} 
              className="flex-none cursor-pointer"
              onClick={() => handleDelete(capsule.id, capsule.username)}
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary p-0.5 bg-neutral">
                  {capsule.type === 'photo' ? (
                    <img
                      src={capsule.url}
                      alt={`Time Capsule by ${capsule.username}`}
                      className="w-full h-full object-cover rounded-full"
                      onError={() => handleMediaError(capsule.id)}
                    />
                  ) : (
                    <video
                      src={capsule.url}
                      className="w-full h-full object-cover rounded-full"
                      autoPlay
                      muted
                      loop
                      playsInline
                      onError={() => handleMediaError(capsule.id)}
                    />
                  )}
                </div>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-full text-center">
                  <span className="text-xs font-medium text-gray-600 truncate block">
                    {capsule.username === currentUser ? "You" : capsule.username}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};