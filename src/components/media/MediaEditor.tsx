import React, { useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Image as FabricImage } from 'fabric';
import { Button } from "@/components/ui/button";
import { X, Send, Filter, Sliders, Crop } from "lucide-react";
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

    const fabricCanvas = new FabricCanvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: '#000000',
    });
    setCanvas(fabricCanvas);

    const img = new Image();
    img.onload = () => {
      const fabricImage = new FabricImage(img);
      
      // Calculate scale to fit the image while maintaining aspect ratio
      const scale = Math.min(
        window.innerWidth / img.width,
        window.innerHeight / img.height
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
      fabricCanvas.setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
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
    <div className="fixed inset-0 z-50 bg-black">
      {/* Top Controls */}
      <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="text-white hover:bg-black/20 rounded-full"
        >
          <X className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSave}
          className="text-white hover:bg-black/20 rounded-full"
        >
          <Send className="h-6 w-6" />
        </Button>
      </div>

      {/* Canvas */}
      <canvas ref={canvasRef} className="w-full h-full" />

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
        <div className="flex justify-center gap-16">
          <button 
            className="flex flex-col items-center gap-2"
            onClick={() => setActiveControl(activeControl === "filters" ? null : "filters")}
          >
            <div className={`h-14 w-14 rounded-full ${activeControl === "filters" ? "bg-white/20" : "bg-black/50"} flex items-center justify-center`}>
              <Filter className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs text-white">Filters</span>
          </button>
          
          <button 
            className="flex flex-col items-center gap-2"
            onClick={() => setActiveControl(activeControl === "adjust" ? null : "adjust")}
          >
            <div className={`h-14 w-14 rounded-full ${activeControl === "adjust" ? "bg-white/20" : "bg-black/50"} flex items-center justify-center`}>
              <Sliders className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs text-white">Adjust</span>
          </button>
          
          <button 
            className="flex flex-col items-center gap-2"
            onClick={() => setActiveControl(activeControl === "crop" ? null : "crop")}
          >
            <div className={`h-14 w-14 rounded-full ${activeControl === "crop" ? "bg-white/20" : "bg-black/50"} flex items-center justify-center`}>
              <Crop className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs text-white">Crop</span>
          </button>
        </div>

        {activeControl === "filters" && (
          <div className="absolute bottom-24 left-0 right-0 bg-black/80 border-t border-white/10 p-4">
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