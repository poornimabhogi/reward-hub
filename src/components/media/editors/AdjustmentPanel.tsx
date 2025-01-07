import { Slider } from "@/components/ui/slider";
import { Sun, Contrast } from "lucide-react";

export const AdjustmentPanel = () => {
  const { adjustBrightness, adjustContrast } = useImageEffects();

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-8">
          <button className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
            <Sun className="h-5 w-5 text-white" />
          </button>
          <button className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
            <Contrast className="h-5 w-5 text-white" />
          </button>
        </div>
        <Slider
          defaultValue={[100]}
          onValueChange={(value) => adjustBrightness(value[0])}
          min={0}
          max={200}
          step={1}
          className="w-full max-w-xs"
        />
      </div>
    </div>
  );
};