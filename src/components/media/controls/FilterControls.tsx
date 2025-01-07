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

    const cleanupFunctions = filtersList.map(filter => {
      const previewCanvas = previewRefs.current[filter.value];
      if (!previewCanvas) return;

      const previewFabricCanvas = new FabricCanvas(previewCanvas, {
        width: 64,
        height: 64,
        backgroundColor: '#000000',
        selection: false,
        renderOnAddRemove: true,
        isDrawingMode: false,
        skipTargetFind: true,
      });

      const img = new Image();
      img.crossOrigin = "anonymous";
      
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

        // Initialize filters with default parameters
        if (filter.value !== 'none') {
          try {
            let filterInstance;
            switch (filter.value) {
              case 'grayscale':
                filterInstance = new filters.Grayscale();
                break;
              case 'sepia':
                filterInstance = new filters.Sepia();
                break;
              case 'brightness':
                filterInstance = new filters.Brightness({ brightness: 0.1 });
                break;
              case 'contrast':
                filterInstance = new filters.Contrast({ contrast: 0.1 });
                break;
            }
            
            if (filterInstance) {
              fabricImage.filters = [filterInstance];
              fabricImage.applyFilters();
            }
          } catch (error) {
            console.error(`Error applying filter ${filter.value}:`, error);
          }
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
      cleanupFunctions.forEach(cleanup => cleanup && cleanup());
    };
  }, [canvas, filtersList]);

  const handleFilterClick = (filterValue: string) => {
    if (!canvas) return;
    
    const mainImage = canvas.getObjects()[0] as FabricImage;
    if (!mainImage) return;

    mainImage.filters = [];

    if (filterValue !== 'none') {
      try {
        let filterInstance;
        switch (filterValue) {
          case 'grayscale':
            filterInstance = new filters.Grayscale();
            break;
          case 'sepia':
            filterInstance = new filters.Sepia();
            break;
          case 'brightness':
            filterInstance = new filters.Brightness({ brightness: 0.1 });
            break;
          case 'contrast':
            filterInstance = new filters.Contrast({ contrast: 0.1 });
            break;
        }
        
        if (filterInstance) {
          mainImage.filters = [filterInstance];
        }
      } catch (error) {
        console.error(`Error applying filter ${filterValue}:`, error);
        return;
      }
    }

    mainImage.applyFilters();
    canvas.renderAll();
    onFilterChange(filterValue);
  };

  return (
    <ScrollArea className="w-full h-32">
      <div className="flex items-center gap-6 p-4">
        {filtersList.map((filter) => (
          <button
            key={filter.value}
            onClick={() => handleFilterClick(filter.value)}
            className="flex flex-col items-center gap-2 cursor-pointer flex-shrink-0 focus:outline-none"
          >
            <div
              className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                selectedFilter === filter.value ? 'border-white' : 'border-transparent'
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