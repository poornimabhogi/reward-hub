import { Status } from "@/types/profile";

interface TimeCapsuleProps {
  timeCapsules: Status[];
}

export const TimeCapsules = ({ timeCapsules }: TimeCapsuleProps) => {
  if (timeCapsules.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">Today's Time Capsules</h3>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {timeCapsules.map((capsule) => (
          <div key={capsule.id} className="flex-none w-48 h-48 relative rounded-lg overflow-hidden">
            {capsule.type === 'photo' ? (
              <img
                src={capsule.url}
                alt="Time Capsule"
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                src={capsule.url}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};