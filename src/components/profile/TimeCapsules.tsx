import { Status } from "@/types/profile";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface TimeCapsuleProps {
  timeCapsules: Status[];
}

export const TimeCapsules = ({ timeCapsules }: TimeCapsuleProps) => {
  const todaysCapsules = timeCapsules.filter(capsule => capsule.postType === 'timeCapsule');

  // Always show the component, even when empty
  return (
    <div className="mb-8 bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-sm font-medium mb-3">Today's Time Capsules</h3>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-4">
          {todaysCapsules.length > 0 ? (
            todaysCapsules.map((capsule) => (
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
            ))
          ) : (
            // Show empty gray circles when no capsules exist
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex-none">
                <div className="w-16 h-16 rounded-full bg-gray-200 ring-2 ring-primary p-0.5" />
              </div>
            ))
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};