import React, { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas, Image as FabricImage, filters } from 'fabric';
import { useCanvas } from '@/contexts/CanvasContext';

interface FilterControlsProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  selectedFilter,
  onFilterChange,
}) => {
  const { canvas } = useCanvas();
  const previewRefs = useRef<{ [key: string]: HTMLCanvasElement | null }>({});

  const filters = [
    { name: 'Original', value: 'none' },
    { name: 'Grayscale', value: 'grayscale' },
    { name: 'Sepia', value: 'sepia' },
    { name: 'Bright', value: 'brightness' },
    { name: 'Contrast', value: 'contrast' },
  ];

  useEffect(() => {
    if (!canvas) return;

    const mainImage = canvas.getObjects()[0] as FabricImage;
    if (!mainImage) return;

    // Create preview for each filter
    filters.forEach(filter => {
      const previewCanvas = previewRefs.current[filter.value];
      if (!previewCanvas) return;

      const previewFabricCanvas = new FabricCanvas(previewCanvas, {
        width: 64,
        height: 64,
        backgroundColor: '#000000',
      });

      // Clone the main image for preview
      mainImage.clone((clonedImg: FabricImage) => {
        if (!clonedImg) return;

        // Reset filters
        clonedImg.filters = [];

        // Apply the specific filter
        switch (filter.value) {
          case 'grayscale':
            clonedImg.filters.push(new filters.Grayscale());
            break;
          case 'sepia':
            clonedImg.filters.push(new filters.Sepia());
            break;
          case 'brightness':
            clonedImg.filters.push(new filters.Brightness({ brightness: 0.2 }));
            break;
          case 'contrast':
            clonedImg.filters.push(new filters.Contrast({ contrast: 0.2 }));
            break;
        }

        // Scale to fit preview
        const scale = Math.min(
          64 / clonedImg.width!,
          64 / clonedImg.height!
        );

        clonedImg.scale(scale);
        clonedImg.applyFilters();

        // Center in preview
        clonedImg.set({
          left: (64 - clonedImg.width! * scale) / 2,
          top: (64 - clonedImg.height! * scale) / 2,
          selectable: false,
        });

        previewFabricCanvas.add(clonedImg);
        previewFabricCanvas.renderAll();
      });
    });

    // Cleanup
    return () => {
      filters.forEach(filter => {
        const previewCanvas = previewRefs.current[filter.value];
        if (previewCanvas) {
          const fabricCanvas = new FabricCanvas(previewCanvas);
          fabricCanvas.dispose();
        }
      });
    };
  }, [canvas]);

  return (
    <div className="flex items-center gap-6 overflow-x-auto py-2 px-4">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className="flex flex-col items-center gap-2 cursor-pointer"
        >
          <div
            className={`w-16 h-16 rounded-lg overflow-hidden ${
              selectedFilter === filter.value ? 'ring-2 ring-white' : ''
            }`}
          >
            <canvas
              ref={(el) => (previewRefs.current[filter.value] = el)}
              width="64"
              height="64"
              className="w-full h-full"
            />
          </div>
          <span className="text-xs text-white">
            {filter.name}
          </span>
        </button>
      ))}
    </div>
  );
};