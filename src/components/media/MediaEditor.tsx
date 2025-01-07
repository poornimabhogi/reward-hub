import React, { useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Image as FabricImage } from 'fabric';
import { Button } from "@/components/ui/button";
import { Filter, Sliders, Crop, Send } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CanvasProvider } from "@/contexts/CanvasContext";
import { useCanvas } from "@/contexts/CanvasContext";
import { FilterControls } from "./controls/FilterControls";

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
      height: window.innerHeight - 160,
      backgroundColor: '#000000'
    });
    setCanvas(fabricCanvas);

    const img = new Image();
    img.onload = () => {
      const fabricImage = new FabricImage(img);
      
      const scale = Math.min(
        (window.innerWidth) / img.width,
        (window.innerHeight - 160) / img.height
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
        height: window.innerHeight - 160
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
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="h-[60px] flex justify-between items-center px-6 bg-black/90 border-b border-white/10">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="text-white hover:bg-white/10"
        >
          Cancel
        </Button>
        <span className="text-xl font-medium text-white">Edit</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSave}
          className="text-white hover:bg-white/10"
        >
          <Send className="h-4 w-4 mr-2" />
          Post
        </Button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      {/* Bottom Controls */}
      <div className="h-[100px] bg-black/90 border-t border-white/10">
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

        {/* Filter Controls Panel */}
        {activeControl === "filters" && (
          <div className="absolute bottom-[100px] left-0 right-0 bg-black/90 border-t border-white/10 p-4">
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

export const MediaEditor = (props: MediaEditorProps) => (
  <CanvasProvider>
    <MediaEditorContent {...props} />
  </CanvasProvider>
);