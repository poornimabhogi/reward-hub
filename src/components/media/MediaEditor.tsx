import React, { useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Image as FabricImage } from 'fabric';
import { Button } from "@/components/ui/button";
import { X, Check, ArrowLeft, ArrowRight, Sun, ImageIcon, Crop, Filter } from "lucide-react";
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

  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new FabricCanvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight - 160, // Account for header and controls
      backgroundColor: '#000000'
    });
    setCanvas(fabricCanvas);

    const img = new Image();
    img.onload = () => {
      const fabricImage = new FabricImage(img);
      
      // Calculate scale to fit the image while maintaining aspect ratio
      const scale = Math.min(
        window.innerWidth / img.width,
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
          className="text-white hover:bg-transparent"
        >
          Cancel
        </Button>
        <span className="text-xl font-medium text-white">Edit</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSave}
          className="text-white hover:bg-transparent"
        >
          Post
        </Button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative">
        {/* Canvas Container */}
        <div className="absolute inset-0 flex items-center justify-center">
          <canvas ref={canvasRef} className="max-w-full max-h-full" />
        </div>
        
        {/* Navigation Controls */}
        <div className="absolute inset-x-0 top-1/2 flex justify-between px-4 -translate-y-1/2 pointer-events-none">
          <Button 
            variant="ghost" 
            size="icon"
            className="h-12 w-12 rounded-full bg-black/50 text-white hover:bg-black/70 pointer-events-auto"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-12 w-12 rounded-full bg-black/50 text-white hover:bg-black/70 pointer-events-auto"
          >
            <ArrowRight className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="h-[100px] bg-black/90 border-t border-white/10">
        <div className="flex justify-center gap-16 h-full items-center">
          <button className="flex flex-col items-center gap-2">
            <div className="h-14 w-14 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-zinc-800 transition-colors">
              <Sun className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs text-white">Adjust</span>
          </button>
          <button className="flex flex-col items-center gap-2">
            <div className="h-14 w-14 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-zinc-800 transition-colors">
              <Filter className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs text-white">Filters</span>
          </button>
          <button className="flex flex-col items-center gap-2">
            <div className="h-14 w-14 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-zinc-800 transition-colors">
              <Crop className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs text-white">Crop</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const MediaEditor = (props: MediaEditorProps) => (
  <CanvasProvider>
    <MediaEditorContent {...props} />
  </CanvasProvider>
);