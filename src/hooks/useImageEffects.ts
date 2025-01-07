import { useCallback } from 'react';
import { useCanvas } from '../contexts/CanvasContext';

export const useImageEffects = () => {
  const { canvas } = useCanvas();

  const adjustBrightness = useCallback((value: number) => {
    if (!canvas) return;
    canvas.getObjects().forEach((obj) => {
      obj.filters = [{ brightness: value / 100 }];
      obj.applyFilters();
    });
    canvas.renderAll();
  }, [canvas]);

  const adjustContrast = useCallback((value: number) => {
    if (!canvas) return;
    canvas.getObjects().forEach((obj) => {
      obj.filters = [{ contrast: value / 100 }];
      obj.applyFilters();
    });
    canvas.renderAll();
  }, [canvas]);

  const applyFilter = useCallback((filterName: string) => {
    if (!canvas) return;
    canvas.getObjects().forEach((obj) => {
      switch (filterName) {
        case 'grayscale':
          obj.filters = [{ grayscale: true }];
          break;
        case 'sepia':
          obj.filters = [{ sepia: true }];
          break;
        default:
          obj.filters = [];
      }
      obj.applyFilters();
    });
    canvas.renderAll();
  }, [canvas]);

  return {
    adjustBrightness,
    adjustContrast,
    applyFilter
  };
};