import React, { useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Image as FabricImage } from 'fabric';
import { Button } from "@/components/ui/button";
import { X, Check, ArrowLeft, ArrowRight, Sun, ImageIcon, Crop } from "lucide-react";
import { CanvasProvider } from "@/contexts/CanvasContext";
import { useCanvas } from "@/contexts/CanvasContext";

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

    // Get window dimensions
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const fabricCanvas = new FabricCanvas(canvasRef.current, {
      width: windowWidth,
      height: windowHeight - 200, // Leave space for controls
      backgroundColor: '#000000'
    });
    setCanvas(fabricCanvas);

    const img = new Image();
    img.onload = () => {
      const fabricImage = new FabricImage(img);
      
      // Calculate scale to fit the image while maintaining aspect ratio
      const scale = Math.min(
        (fabricCanvas.width || windowWidth) / img.width,
        (fabricCanvas.height || (windowHeight - 200)) / img.height
      ) * 0.9;
      
      fabricImage.set({
        originX: 'center',
        originY: 'center',
        scaleX: scale,
        scaleY: scale,
        selectable: false, // Prevent image manipulation until post
      });

      fabricCanvas.add(fabricImage);
      fabricCanvas.centerObject(fabricImage);
      fabricCanvas.renderAll();
    };
    img.src = URL.createObjectURL(file);

    // Handle window resize
    const handleResize = () => {
      fabricCanvas.setDimensions({
        width: window.innerWidth,
        height: window.innerHeight - 200
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
      <div className="flex justify-between items-center p-4 bg-black/90">
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="text-white hover:bg-transparent"
        >
          <X className="h-6 w-6" />
        </Button>
        <span className="text-xl font-medium text-white">Edit</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSave}
          className="text-white hover:bg-transparent"
        >
          <Check className="h-6 w-6" />
        </Button>
      </div>

      {/* Canvas Container */}
      <div className="flex-grow relative flex items-center justify-center bg-black">
        <canvas ref={canvasRef} className="max-w-full" />
        
        {/* Navigation Controls */}
        <div className="absolute inset-x-0 top-1/2 flex justify-between px-4 -translate-y-1/2">
          <Button 
            variant="ghost" 
            size="icon"
            className="h-12 w-12 rounded-full bg-black/50 text-white hover:bg-black/70"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-12 w-12 rounded-full bg-black/50 text-white hover:bg-black/70"
          >
            <ArrowRight className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="bg-black pt-6 pb-12">
        <div className="flex justify-center gap-16">
          <button className="flex flex-col items-center gap-2">
            <div className="h-16 w-16 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-zinc-800 transition-colors">
              <Sun className="h-8 w-8 text-white" />
            </div>
            <span className="text-sm text-white">Adjust</span>
          </button>
          <button className="flex flex-col items-center gap-2">
            <div className="h-16 w-16 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-zinc-800 transition-colors">
              <ImageIcon className="h-8 w-8 text-white" />
            </div>
            <span className="text-sm text-white">Filters</span>
          </button>
          <button className="flex flex-col items-center gap-2">
            <div className="h-16 w-16 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-zinc-800 transition-colors">
              <Crop className="h-8 w-8 text-white" />
            </div>
            <span className="text-sm text-white">Crop</span>
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