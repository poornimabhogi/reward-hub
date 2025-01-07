import React from 'react';
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useImageEffects } from '@/hooks/useImageEffects';

interface AdjustmentControlsProps {
  activeAdjustment: string;
}

export const AdjustmentControls: React.FC<AdjustmentControlsProps> = ({
  activeAdjustment,
}) => {
  const { adjustBrightness, adjustContrast } = useImageEffects();

  const handleValueChange = (value: number[]) => {
    const adjustmentValue = value[0];
    
    switch (activeAdjustment) {
      case 'brightness':
        adjustBrightness(adjustmentValue);
        break;
      case 'contrast':
        adjustContrast(adjustmentValue);
        break;
      default:
        break;
    }
  };

  return (
    <ScrollArea className="w-full">
      <div className="flex flex-col gap-4 p-4">
        <div className="text-white text-sm font-medium uppercase">
          {activeAdjustment}
        </div>
        <Slider
          defaultValue={[100]}
          min={0}
          max={200}
          step={1}
          onValueChange={handleValueChange}
          className="w-full"
        />
      </div>
    </ScrollArea>
  );
};