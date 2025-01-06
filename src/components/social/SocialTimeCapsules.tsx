import { useState, useEffect } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface TimeCapsule {
  id: number;
  username: string;
  type: 'photo' | 'video';
  url: string;
  timestamp: Date;
}

interface SocialTimeCapsuleProps {
  followedUsers: { username: string; isFollowing: boolean; }[];
}

export const SocialTimeCapsules = ({ followedUsers }: SocialTimeCapsuleProps) => {
  const [timeCapsules, setTimeCapsules] = useState<TimeCapsule[]>([]);
  const currentUser = "John Doe"; // This should match the current user's name

  useEffect(() => {
    const handleNewTimeCapsule = (event: CustomEvent<any>) => {
      console.log('New time capsule event received:', event.detail); // Debug log
      const newCapsule = event.detail;
      
      setTimeCapsules(prev => {
        console.log('Previous capsules:', prev); // Debug log
        return [{
          id: newCapsule.id,
          username: newCapsule.username || currentUser,
          type: newCapsule.type,
          url: newCapsule.url,
          timestamp: new Date(newCapsule.timestamp)
        }, ...prev];
      });
    };

    window.addEventListener('newTimeCapsule', handleNewTimeCapsule as EventListener);
    
    // Load existing time capsules from localStorage
    const storedCapsules = localStorage.getItem('socialTimeCapsules');
    if (storedCapsules) {
      setTimeCapsules(JSON.parse(storedCapsules));
    }

    return () => {
      window.removeEventListener('newTimeCapsule', handleNewTimeCapsule as EventListener);
    };
  }, [currentUser]);

  // Save to localStorage whenever timeCapsules changes
  useEffect(() => {
    console.log('Saving time capsules:', timeCapsules); // Debug log
    localStorage.setItem('socialTimeCapsules', JSON.stringify(timeCapsules));
  }, [timeCapsules]);

  // Filter and sort time capsules
  const sortedTimeCapsules = timeCapsules
    .filter(capsule => 
      capsule.username === currentUser || 
      followedUsers.some(user => user.username === capsule.username && user.isFollowing)
    )
    .sort((a, b) => {
      // Current user's capsules always come first
      if (a.username === currentUser && b.username !== currentUser) return -1;
      if (b.username === currentUser && a.username !== currentUser) return 1;
      // For other cases, sort by timestamp (newest first)
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

  return (
    <div className="mb-8 bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-sm font-medium mb-3">Today's Time Capsules</h3>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-4">
          {sortedTimeCapsules.map((capsule) => (
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