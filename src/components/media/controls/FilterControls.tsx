import React, { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas, Image as FabricImage, filters } from 'fabric';
import { useCanvas } from '@/contexts/CanvasContext';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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

  const filtersList = [
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

    filtersList.forEach(filter => {
      const previewCanvas = previewRefs.current[filter.value];
      if (!previewCanvas) return;

      // Create a new Fabric canvas for the preview
      const previewFabricCanvas = new FabricCanvas(previewCanvas, {
        width: 64,
        height: 64,
        backgroundColor: '#000000',
        selection: false,
        renderOnAddRemove: true,
      });

      const img = new Image();
      img.onload = () => {
        const fabricImage = new FabricImage(img, {
          selectable: false,
          evented: false,
        });
        
        const scale = Math.min(
          64 / img.width,
          64 / img.height
        );

        fabricImage.set({
          scaleX: scale,
          scaleY: scale,
          left: (64 - (img.width * scale)) / 2,
          top: (64 - (img.height * scale)) / 2,
        });

        // Apply appropriate filter
        if (filter.value === 'grayscale') {
          fabricImage.filters = [new filters.Grayscale()];
        } else if (filter.value === 'sepia') {
          fabricImage.filters = [new filters.Sepia()];
        } else if (filter.value === 'brightness') {
          fabricImage.filters = [new filters.Brightness({ brightness: 0.2 })];
        } else if (filter.value === 'contrast') {
          fabricImage.filters = [new filters.Contrast({ contrast: 0.2 })];
        }

        if (fabricImage.filters && fabricImage.filters.length > 0) {
          fabricImage.applyFilters();
        }

        previewFabricCanvas.add(fabricImage);
        previewFabricCanvas.centerObject(fabricImage);
        previewFabricCanvas.renderAll();
      };

      const dataUrl = mainImage.toDataURL();
      img.src = dataUrl;

      return () => {
        previewFabricCanvas.dispose();
      };
    });

    return () => {
      filtersList.forEach(filter => {
        const previewCanvas = previewRefs.current[filter.value];
        if (previewCanvas) {
          const fabricCanvas = new FabricCanvas(previewCanvas);
          fabricCanvas.dispose();
        }
      });
    };
  }, [canvas]);

  const handleFilterClick = (filterValue: string) => {
    onFilterChange(filterValue);
  };

  return (
    <ScrollArea className="w-full h-32">
      <div className="flex items-center gap-6 p-4">
        {filtersList.map((filter) => (
          <button
            key={filter.value}
            onClick={() => handleFilterClick(filter.value)}
            className="flex flex-col items-center gap-2 cursor-pointer flex-shrink-0"
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
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};