import { useState, useEffect } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getTimeCapsules, TimeCapsule } from "@/utils/timeCapsuleUtils";
import { Button } from "@/components/ui/button";

interface SocialTimeCapsuleProps {
  followedUsers: { username: string; isFollowing: boolean; }[];
}

export const SocialTimeCapsules = ({ followedUsers }: SocialTimeCapsuleProps) => {
  const [timeCapsules, setTimeCapsules] = useState<TimeCapsule[]>([]);
  const currentUser = "John Doe";

  useEffect(() => {
    // Load initial time capsules
    setTimeCapsules(getTimeCapsules());

    // Handle new time capsule events
    const handleNewTimeCapsule = (event: CustomEvent<TimeCapsule>) => {
      console.log('New time capsule received in Social:', event.detail);
      setTimeCapsules(prev => [event.detail, ...prev]);
    };

    window.addEventListener('newTimeCapsule', handleNewTimeCapsule as EventListener);
    return () => {
      window.removeEventListener('newTimeCapsule', handleNewTimeCapsule as EventListener);
    };
  }, []);

  // Filter and sort time capsules
  const filteredCapsules = timeCapsules
    .filter(capsule => 
      capsule.postType === 'timeCapsule' &&
      (capsule.username === currentUser || 
       followedUsers.some(user => user.username === capsule.username && user.isFollowing))
    )
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="mb-8 bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-sm font-medium mb-3">Today's Time Capsules</h3>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-4">
          {filteredCapsules.map((capsule) => (
            <div key={capsule.id} className="flex-none">
              <div className="relative">
                <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary p-0.5 bg-neutral">
                  {capsule.type === 'photo' ? (
                    <img
                      src={capsule.url}
                      alt={`Time Capsule by ${capsule.username}`}
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