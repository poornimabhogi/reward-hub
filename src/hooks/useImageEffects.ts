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
      image.filters = [brightnessFilter];
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
      image.filters = [contrastFilter];
      image.applyFilters();
      canvas.renderAll();
    }
  }, [canvas]);

  const applyFilter = useCallback((filterName: string) => {
    if (!canvas) return;
    const objects = canvas.getObjects();
    if (objects.length > 0) {
      const image = objects[0] as FabricImage;
      let filter;
      
      switch (filterName) {
        case 'grayscale':
          filter = new filters.Grayscale();
          break;
        case 'sepia':
          filter = new filters.Sepia();
          break;
        default:
          filter = null;
      }

      image.filters = filter ? [filter] : [];
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