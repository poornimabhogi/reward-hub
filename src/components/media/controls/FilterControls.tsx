import React, { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas, Image as FabricImage } from 'fabric';
import { filters } from 'fabric';
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
  const previewCanvasInstances = useRef<{ [key: string]: FabricCanvas }>({});

  const filtersList = [
    { name: 'Original', value: 'none' },
    { name: 'Grayscale', value: 'grayscale' },
    { name: 'Sepia', value: 'sepia' },
    { name: 'Bright', value: 'brightness' },
    { name: 'Contrast', value: 'contrast' },
  ];

  const createFilter = (filterType: string) => {
    switch (filterType) {
      case 'grayscale':
        return new filters.Grayscale();
      case 'sepia':
        return new filters.Sepia();
      case 'brightness':
        return new filters.Brightness({ brightness: 0.1 });
      case 'contrast':
        return new filters.Contrast({ contrast: 0.1 });
      default:
        return null;
    }
  };

  useEffect(() => {
    if (!canvas) return;

    const mainImage = canvas.getObjects()[0] as FabricImage;
    if (!mainImage) return;

    // Cleanup function to dispose of all preview canvases
    const cleanup = () => {
      Object.values(previewCanvasInstances.current).forEach(canvas => {
        canvas.dispose();
      });
      previewCanvasInstances.current = {};
    };

    // Create preview for each filter
    filtersList.forEach(filter => {
      const previewCanvas = previewRefs.current[filter.value];
      if (!previewCanvas) return;

      // Dispose of existing canvas instance if it exists
      if (previewCanvasInstances.current[filter.value]) {
        previewCanvasInstances.current[filter.value].dispose();
      }

      const fabricPreviewCanvas = new FabricCanvas(previewCanvas, {
        width: 64,
        height: 64,
        backgroundColor: '#000000',
        selection: false,
        renderOnAddRemove: true,
        skipTargetFind: true,
        interactive: false,
        enableRetinaScaling: false,
        preserveObjectStacking: true
      });

      previewCanvasInstances.current[filter.value] = fabricPreviewCanvas;

      const img = new Image();
      img.crossOrigin = "anonymous";
      
      img.onload = () => {
        const fabricImage = new FabricImage(img, {
          selectable: false,
          evented: false,
          lockMovementX: true,
          lockMovementY: true,
          lockRotation: true,
          lockScalingX: true,
          lockScalingY: true,
        });
        
        const scale = Math.min(64 / img.width, 64 / img.height);
        
        fabricImage.set({
          scaleX: scale,
          scaleY: scale,
          left: (64 - (img.width * scale)) / 2,
          top: (64 - (img.height * scale)) / 2,
        });

        if (filter.value !== 'none') {
          const filterInstance = createFilter(filter.value);
          if (filterInstance) {
            fabricImage.filters = [filterInstance];
            fabricImage.applyFilters();
          }
        }

        fabricPreviewCanvas.add(fabricImage);
        fabricPreviewCanvas.renderAll();
      };

      const dataUrl = mainImage.toDataURL();
      img.src = dataUrl;
    });

    return cleanup;
  }, [canvas, filtersList]);

  const handleFilterClick = (filterValue: string) => {
    if (!canvas) return;
    
    const mainImage = canvas.getObjects()[0] as FabricImage;
    if (!mainImage) return;

    // Only reset filters if not selecting brightness
    if (filterValue !== 'brightness') {
      mainImage.filters = [];

      if (filterValue !== 'none') {
        const filterInstance = createFilter(filterValue);
        if (filterInstance) {
          mainImage.filters = [filterInstance];
        }
      }

      mainImage.applyFilters();
      canvas.renderAll();
    }
    
    onFilterChange(filterValue);
  };

  return (
    <ScrollArea className="w-full h-32">
      <div className="flex items-center gap-6 p-4">
        {filtersList.map((filter) => (
          <button
            key={filter.value}
            onClick={() => handleFilterClick(filter.value)}
            onTouchStart={(e) => {
              e.preventDefault();
              handleFilterClick(filter.value);
            }}
            className="flex flex-col items-center gap-2 cursor-pointer flex-shrink-0 focus:outline-none group touch-manipulation"
          >
            <div
              className={`w-16 h-16 rounded-lg overflow-hidden bg-black ${
                selectedFilter === filter.value 
                ? 'ring-2 ring-white' 
                : 'ring-1 ring-white/10 group-hover:ring-white/30'
              }`}
            >
              <canvas
                ref={(el) => (previewRefs.current[filter.value] = el)}
                width="64"
                height="64"
                className="w-full h-full pointer-events-none select-none"
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