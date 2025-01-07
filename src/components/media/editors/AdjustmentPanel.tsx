import { Slider } from "@/components/ui/slider";
import { Sun, Contrast } from "lucide-react";

export const AdjustmentPanel = () => {
  const { adjustBrightness, adjustContrast } = useImageEffects();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex gap-4">
          <div className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center">
            <Sun className="h-5 w-5 text-white" />
          </div>
          <div className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center">
            <Contrast className="h-5 w-5 text-white" />
          </div>
        </div>
        <Slider
          defaultValue={[100]}
          onValueChange={(value) => adjustBrightness(value[0])}
          min={0}
          max={200}
          step={1}
          className="flex-1"
        />
      </div>
    </div>
  );
};