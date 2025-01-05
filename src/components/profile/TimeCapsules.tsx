import { Status } from "@/types/profile";

interface TimeCapsuleProps {
  timeCapsules: Status[];
}

export const TimeCapsules = ({ timeCapsules }: TimeCapsuleProps) => {
  const todaysCapsules = timeCapsules.filter(capsule => capsule.postType === 'timeCapsule');

  if (todaysCapsules.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-sm font-medium mb-3">Today's Time Capsules</h3>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {todaysCapsules.map((capsule) => (
          <div key={capsule.id} className="flex-none w-16 h-16">
            <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary p-0.5">
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
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};