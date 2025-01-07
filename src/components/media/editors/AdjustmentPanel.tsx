import { Slider } from "@/components/ui/slider";
import { Sun, Contrast } from "lucide-react";
import { useImageEffects } from "@/hooks/useImageEffects";

export const AdjustmentPanel = () => {
  const { adjustBrightness, adjustContrast } = useImageEffects();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Sun className="h-4 w-4" />
        <Slider
          defaultValue={[100]}
          onValueChange={(value) => adjustBrightness(value[0])}
          min={0}
          max={200}
          step={1}
          className="flex-1"
        />
      </div>
      <div className="flex items-center gap-4">
        <Contrast className="h-4 w-4" />
        <Slider
          defaultValue={[100]}
          onValueChange={(value) => adjustContrast(value[0])}
          min={0}
          max={200}
          step={1}
          className="flex-1"
        />
      </div>
    </div>
  );
};