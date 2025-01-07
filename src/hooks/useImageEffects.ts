import { useCallback } from 'react';
import { useCanvas } from '../contexts/CanvasContext';
import { Image as FabricImage, filters } from 'fabric';

export const useImageEffects = () => {
  const { canvas } = useCanvas();

  const adjustBrightness = useCallback((value: number) => {
    if (!canvas) return;

    const objects = canvas.getObjects();
    if (objects.length > 0) {
      const image = objects[0] as FabricImage;
      const brightnessFilter = new filters.Brightness({
        brightness: (value - 100) / 100
      });
      
      // Preserve other filters if they exist
      const existingFilters = image.filters || [];
      const otherFilters = existingFilters.filter(f => !(f instanceof filters.Brightness));
      image.filters = [...otherFilters, brightnessFilter];
      
      image.applyFilters();
      canvas.renderAll();
    }
  }, [canvas]);

  const adjustContrast = useCallback((value: number) => {
    if (!canvas) return;

    const objects = canvas.getObjects();
    if (objects.length > 0) {
      const image = objects[0] as FabricImage;
      const contrastFilter = new filters.Contrast({
        contrast: value / 100
      });
      
      // Preserve other filters if they exist
      const existingFilters = image.filters || [];
      const otherFilters = existingFilters.filter(f => !(f instanceof filters.Contrast));
      image.filters = [...otherFilters, contrastFilter];
      
      image.applyFilters();
      canvas.renderAll();
    }
  }, [canvas]);

  const applyFilter = useCallback((filterName: string) => {
    if (!canvas) return;

    const objects = canvas.getObjects();
    if (objects.length > 0) {
      const image = objects[0] as FabricImage;
      let newFilter;
      
      switch (filterName) {
        case 'grayscale':
          newFilter = new filters.Grayscale();
          break;
        case 'sepia':
          newFilter = new filters.Sepia();
          break;
        default:
          newFilter = null;
      }

      // Keep brightness and contrast filters if they exist
      const existingFilters = image.filters || [];
      const adjustmentFilters = existingFilters.filter(
        f => f instanceof filters.Brightness || f instanceof filters.Contrast
      );
      
      image.filters = newFilter 
        ? [...adjustmentFilters, newFilter]
        : adjustmentFilters;
        
      image.applyFilters();
      canvas.renderAll();
    }
  }, [canvas]);

  return {
    adjustBrightness,
    adjustContrast,
    applyFilter
  };
};
