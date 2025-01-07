import { useCallback } from 'react';
import { useCanvas } from '../contexts/CanvasContext';
import { Image as FabricImage } from 'fabric';

export const useImageEffects = () => {
  const { canvas } = useCanvas();

  const adjustBrightness = useCallback((value: number) => {
    if (!canvas) return;
    const bgImage = canvas.backgroundImage as FabricImage;
    if (bgImage) {
      bgImage.filters = [{ type: 'Brightness', brightness: value / 100 }];
      bgImage.applyFilters();
      canvas.renderAll();
    }
  }, [canvas]);

  const adjustContrast = useCallback((value: number) => {
    if (!canvas) return;
    const bgImage = canvas.backgroundImage as FabricImage;
    if (bgImage) {
      bgImage.filters = [{ type: 'Contrast', contrast: value / 100 }];
      bgImage.applyFilters();
      canvas.renderAll();
    }
  }, [canvas]);

  const applyFilter = useCallback((filterName: string) => {
    if (!canvas) return;
    const bgImage = canvas.backgroundImage as FabricImage;
    if (bgImage) {
      switch (filterName) {
        case 'grayscale':
          bgImage.filters = [{ type: 'Grayscale' }];
          break;
        case 'sepia':
          bgImage.filters = [{ type: 'Sepia' }];
          break;
        default:
          bgImage.filters = [];
      }
      bgImage.applyFilters();
      canvas.renderAll();
    }
  }, [canvas]);

  return {
    adjustBrightness,
    adjustContrast,
    applyFilter
  };
};