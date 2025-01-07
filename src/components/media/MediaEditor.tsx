import React, { useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Image as FabricImage } from 'fabric';
import { Button } from "@/components/ui/button";
import { Filter, Sliders, Crop, Send } from "lucide-react";
import { useCanvas } from "@/contexts/CanvasContext";
import { FilterControls } from "./controls/FilterControls";
import { CanvasProvider } from "@/contexts/CanvasContext";

interface MediaEditorProps {
  file: File;
  onSave: (editedFile: File) => void;
  onCancel: () => void;
}

const MediaEditorContent = ({ file, onSave, onCancel }: MediaEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setCanvas, canvas } = useCanvas();
  const [selectedFilter, setSelectedFilter] = React.useState("none");
  const [activeControl, setActiveControl] = React.useState<"filters" | "adjust" | "crop" | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Calculate dimensions to match mobile viewport ratio (9:16)
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const baseWidth = Math.min(viewportWidth, 430); // Max width for mobile view
    const canvasHeight = (baseWidth * 16) / 9; // Maintain 9:16 ratio

    const fabricCanvas = new FabricCanvas(canvasRef.current, {
      width: baseWidth,
      height: canvasHeight,
      backgroundColor: '#000000',
      centeredScaling: true,
    });
    setCanvas(fabricCanvas);

    const img = new Image();
    img.onload = () => {
      const fabricImage = new FabricImage(img);
      
      // Calculate scale to fit the image while maintaining aspect ratio
      const imageAspectRatio = img.width / img.height;
      const canvasAspectRatio = baseWidth / canvasHeight;
      let scale;

      if (imageAspectRatio > canvasAspectRatio) {
        // Image is wider than canvas ratio
        scale = baseWidth / img.width;
      } else {
        // Image is taller than canvas ratio
        scale = canvasHeight / img.height;
      }
      
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
      const newWidth = Math.min(window.innerWidth, 430);
      const newHeight = (newWidth * 16) / 9;
      
      fabricCanvas.setDimensions({
        width: newWidth,
        height: newHeight
      });
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

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col min-h-screen">
      {/* Mobile-style header */}
      <div className="h-14 flex justify-between items-center px-4 bg-transparent text-white">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="text-white hover:bg-white/10"
        >
          Cancel
        </Button>
        <span className="text-base font-medium">1 Photo Selected</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSave}
          className="text-white hover:bg-white/10"
        >
          Done
        </Button>
      </div>

      {/* Main Content Area - Full height with black background */}
      <div className="flex-1 relative bg-black flex items-center justify-center">
        <canvas ref={canvasRef} className="max-h-full w-auto object-contain" />
      </div>

      {/* Bottom Controls */}
      <div className="h-24 bg-black/90">
        <div className="flex justify-center gap-16 h-full items-center">
          <button 
            className="flex flex-col items-center gap-2"
            onClick={() => setActiveControl(activeControl === "filters" ? null : "filters")}
          >
            <div className={`h-14 w-14 rounded-full ${activeControl === "filters" ? "bg-white/20" : "bg-zinc-900"} flex items-center justify-center hover:bg-zinc-800 transition-colors`}>
              <Filter className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs text-white">Filters</span>
          </button>
          
          <button 
            className="flex flex-col items-center gap-2"
            onClick={() => setActiveControl(activeControl === "adjust" ? null : "adjust")}
          >
            <div className={`h-14 w-14 rounded-full ${activeControl === "adjust" ? "bg-white/20" : "bg-zinc-900"} flex items-center justify-center hover:bg-zinc-800 transition-colors`}>
              <Sliders className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs text-white">Adjust</span>
          </button>
          
          <button 
            className="flex flex-col items-center gap-2"
            onClick={() => setActiveControl(activeControl === "crop" ? null : "crop")}
          >
            <div className={`h-14 w-14 rounded-full ${activeControl === "crop" ? "bg-white/20" : "bg-zinc-900"} flex items-center justify-center hover:bg-zinc-800 transition-colors`}>
              <Crop className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs text-white">Crop</span>
          </button>
        </div>

        {activeControl === "filters" && (
          <div className="absolute bottom-24 left-0 right-0 bg-black/90 border-t border-white/10 p-4">
            <FilterControls
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Export the wrapped component
export const MediaEditor = (props: MediaEditorProps) => (
  <CanvasProvider>
    <MediaEditorContent {...props} />
  </CanvasProvider>
);