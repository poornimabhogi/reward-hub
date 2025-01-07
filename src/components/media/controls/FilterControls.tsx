import React, { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas, Image as FabricImage } from 'fabric';
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

      // Create a new image for preview
      const img = new Image();
      img.onload = () => {
        const fabricImage = new FabricImage(img);
        
        // Scale to fit preview
        const scale = Math.min(
          64 / img.width,
          64 / img.height
        );

        fabricImage.set({
          scaleX: scale,
          scaleY: scale,
          left: (64 - img.width * scale) / 2,
          top: (64 - img.height * scale) / 2,
          selectable: false,
        });

        // Apply filter based on type
        if (filter.value === 'grayscale') {
          fabricImage.filters?.push(new FabricImage.filters.Grayscale());
        } else if (filter.value === 'sepia') {
          fabricImage.filters?.push(new FabricImage.filters.Sepia());
        } else if (filter.value === 'brightness') {
          fabricImage.filters?.push(new FabricImage.filters.Brightness({ brightness: 0.2 }));
        } else if (filter.value === 'contrast') {
          fabricImage.filters?.push(new FabricImage.filters.Contrast({ contrast: 0.2 }));
        }

        if (fabricImage.filters && fabricImage.filters.length > 0) {
          fabricImage.applyFilters();
        }

        previewFabricCanvas.add(fabricImage);
        previewFabricCanvas.renderAll();
      };

      // Get the current state of the main canvas as a data URL
      const dataUrl = mainImage.toDataURL();
      img.src = dataUrl;
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