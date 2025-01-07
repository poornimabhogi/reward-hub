import { useCallback } from 'react';
import { useCanvas } from '@/contexts/CanvasContext';
import { filters, Image as FabricImage } from 'fabric';

export const useImageEffects = () => {
  const { canvas } = useCanvas();

  const adjustBrightness = useCallback((value: number) => {
    if (!canvas) return;
    
    const objects = canvas.getObjects();
    if (objects.length === 0) return;

    const image = objects[0] as FabricImage;
    if (!image) return;

    const brightnessFilter = new filters.Brightness({
      brightness: (value - 100) / 100
    });

    const existingFilters = image.filters || [];
    const otherFilters = existingFilters.filter(f => !(f instanceof filters.Brightness));
    
    image.filters = [...otherFilters, brightnessFilter];
    image.applyFilters();
    canvas.renderAll();
  }, [canvas]);

  const adjustContrast = useCallback((value: number) => {
    if (!canvas) return;
    
    const objects = canvas.getObjects();
    if (objects.length === 0) return;

    const image = objects[0] as FabricImage;
    if (!image) return;

    const contrastFilter = new filters.Contrast({
      contrast: value / 100
    });

    const existingFilters = image.filters || [];
    const otherFilters = existingFilters.filter(f => !(f instanceof filters.Contrast));
    
    image.filters = [...otherFilters, contrastFilter];
    image.applyFilters();
    canvas.renderAll();
  }, [canvas]);

  return {
    adjustBrightness,
    adjustContrast
  };
};