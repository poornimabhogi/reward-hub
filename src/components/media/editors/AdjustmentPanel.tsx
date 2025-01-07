import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Sun, Contrast } from "lucide-react";

export const AdjustmentPanel = () => {
  const [activeControl, setActiveControl] = useState<'brightness' | 'contrast'>('brightness');

  return (
    <div className="space-y-6 w-full px-4">
      <div className="flex justify-center gap-16 mb-8">
        <button 
          onClick={() => setActiveControl('brightness')}
          className={`flex flex-col items-center gap-2 ${activeControl === 'brightness' ? 'text-primary' : 'text-white'}`}
        >
          <div className="h-16 w-16 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-zinc-800 transition-colors">
            <Sun className="h-8 w-8" />
          </div>
          <span className="text-sm">Brightness</span>
        </button>
        <button 
          onClick={() => setActiveControl('contrast')}
          className={`flex flex-col items-center gap-2 ${activeControl === 'contrast' ? 'text-primary' : 'text-white'}`}
        >
          <div className="h-16 w-16 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-zinc-800 transition-colors">
            <Contrast className="h-8 w-8" />
          </div>
          <span className="text-sm">Contrast</span>
        </button>
      </div>

      <div className="w-full px-4">
        <Slider
          defaultValue={[100]}
          min={0}
          max={200}
          step={1}
          className="w-full"
        />
      </div>
    </div>
  );
};