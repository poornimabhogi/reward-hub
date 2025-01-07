import React, { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Image as FabricImage } from 'fabric';
import { useCanvas } from "@/contexts/CanvasContext";
import { CanvasProvider } from "@/contexts/CanvasContext";
import { TopControls } from "./controls/TopControls";
import { BottomControls } from "./controls/BottomControls";

interface MediaEditorProps {
  file: File;
  onSave: (editedFile: File) => void;
  onCancel: () => void;
}

const MediaEditorContent = ({ file, onSave, onCancel }: MediaEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setCanvas, canvas } = useCanvas();
  const [selectedFilter, setSelectedFilter] = useState("none");
  const [activeControl, setActiveControl] = useState<"filters" | "adjust" | "crop" | null>(null);
  const [activeAdjustment, setActiveAdjustment] = useState<string>("brightness");

  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new FabricCanvas(canvasRef.current);
    setCanvas(fabricCanvas);

    // Set initial canvas size
    const updateCanvasSize = () => {
      const container = canvasRef.current?.parentElement;
      if (!container) return;

      const padding = 32; // 16px padding on each side
      const maxWidth = container.clientWidth - padding;
      const maxHeight = container.clientHeight - padding;

      fabricCanvas.setDimensions({
        width: maxWidth,
        height: maxHeight
      });
    };

    updateCanvasSize();

    const img = new Image();
    img.onload = () => {
      const fabricImage = new FabricImage(img);
      
      // Calculate scale to fit the image while maintaining aspect ratio
      const containerWidth = fabricCanvas.width || 0;
      const containerHeight = fabricCanvas.height || 0;
      
      const scale = Math.min(
        containerWidth / img.width,
        containerHeight / img.height
      );
      
      fabricImage.set({
        originX: 'center',
        originY: 'center',
        scaleX: scale,
        scaleY: scale,
        selectable: false,
      });

      fabricCanvas.add(fabricImage);
      fabricCanvas.centerObject(fabricImage);
      fabricCanvas.renderAll();
    };
    img.src = URL.createObjectURL(file);

    const handleResize = () => {
      updateCanvasSize();
      fabricCanvas.renderAll();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      fabricCanvas.dispose();
      URL.revokeObjectURL(img.src);
      window.removeEventListener('resize', handleResize);
    };
  }, [file, setCanvas]);

  const handleSave = () => {
    if (!canvas || !canvasRef.current) return;
    canvasRef.current.toBlob((blob) => {
      if (blob) {
        const editedFile = new File([blob], file.name, { type: file.type });
        onSave(editedFile);
      }
    }, file.type);
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    if (!canvas) return;

    const objects = canvas.getObjects();
    if (objects.length === 0) return;

    const image = objects[0] as FabricImage;
    if (!image) return;

    // Reset filters array
    image.filters = [];

    switch (filter) {
      case 'grayscale':
        image.filters.push(new fabric.filters.Grayscale());
        break;
      case 'sepia':
        image.filters.push(new fabric.filters.Sepia());
        break;
      case 'brightness':
        image.filters.push(new fabric.filters.Brightness({ brightness: 0.2 }));
        break;
      case 'contrast':
        image.filters.push(new fabric.filters.Contrast({ contrast: 0.2 }));
        break;
      default:
        // No filter
        break;
    }
    
    image.applyFilters();
    canvas.renderAll();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <TopControls onCancel={onCancel} onSave={handleSave} />
      
      <div className="flex-1 relative flex items-center justify-center p-4">
        <canvas ref={canvasRef} className="max-w-full max-h-full object-contain" />
      </div>

      <BottomControls
        activeControl={activeControl}
        setActiveControl={setActiveControl}
        selectedFilter={selectedFilter}
        onFilterChange={handleFilterChange}
        activeAdjustment={activeAdjustment}
        setActiveAdjustment={setActiveAdjustment}
      />
    </div>
  );
};

export const MediaEditor = (props: MediaEditorProps) => (
  <CanvasProvider>
    <MediaEditorContent {...props} />
  </CanvasProvider>
);
