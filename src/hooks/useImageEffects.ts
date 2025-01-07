import { useCallback } from 'react';
import { useCanvas } from '../contexts/CanvasContext';
import { Image as FabricImage } from 'fabric';
import { filters } from 'fabric';

export const useImageEffects = () => {
  const { canvas } = useCanvas();

  const adjustBrightness = useCallback((value: number) => {
    if (!canvas) return;
    const objects = canvas.getObjects();
    if (objects.length > 0) {
      const image = objects[0] as FabricImage;
      image.filters = [new filters.Brightness({
        brightness: (value - 100) / 100
      })];
      image.applyFilters();
      canvas.renderAll();
    }
  }, [canvas]);

  const adjustContrast = useCallback((value: number) => {
    if (!canvas) return;
    const objects = canvas.getObjects();
    if (objects.length > 0) {
      const image = objects[0] as FabricImage;
      image.filters = [new filters.Contrast({
        contrast: value / 100
      })];
      image.applyFilters();
      canvas.renderAll();
    }
  }, [canvas]);

  const applyFilter = useCallback((filterName: string) => {
    if (!canvas) return;
    const objects = canvas.getObjects();
    if (objects.length > 0) {
      const image = objects[0] as FabricImage;
      switch (filterName) {
        case 'grayscale':
          image.filters = [new filters.Grayscale()];
          break;
        case 'sepia':
          image.filters = [new filters.Sepia()];
          break;
        default:
          image.filters = [];
      }
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