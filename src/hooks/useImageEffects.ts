import { useCallback } from 'react';
import { useCanvas } from '../contexts/CanvasContext';
import { Image as FabricImage } from 'fabric';

export const useImageEffects = () => {
  const { canvas } = useCanvas();

  const adjustBrightness = useCallback((value: number) => {
    if (!canvas) return;
    const objects = canvas.getObjects();
    if (objects.length > 0) {
      const image = objects[0] as FabricImage;
      image.filters = [{
        type: 'Brightness',
        value: (value - 100) / 100
      }];
      image.applyFilters();
      canvas.renderAll();
    }
  }, [canvas]);

  const adjustContrast = useCallback((value: number) => {
    if (!canvas) return;
    const objects = canvas.getObjects();
    if (objects.length > 0) {
      const image = objects[0] as FabricImage;
      image.filters = [{
        type: 'Contrast',
        value: value / 100
      }];
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
          image.filters = [{ type: 'Grayscale' }];
          break;
        case 'sepia':
          image.filters = [{ type: 'Sepia' }];
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