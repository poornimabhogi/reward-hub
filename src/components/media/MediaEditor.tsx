import React, { useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Image as FabricImage } from 'fabric';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { X, Check, ArrowLeft, ArrowRight, Sun, Image as ImageIcon, Crop } from "lucide-react";
import { CanvasProvider } from "@/contexts/CanvasContext";
import { AdjustmentPanel } from "./editors/AdjustmentPanel";
import { FilterControls } from "./controls/FilterControls";
import { useCanvas } from "@/contexts/CanvasContext";
import { cn } from "@/lib/utils";

interface MediaEditorProps {
  file: File;
  onSave: (editedFile: File) => void;
  onCancel: () => void;
}

const MediaEditorContent = ({ file, onSave, onCancel }: MediaEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { setCanvas, canvas } = useCanvas();

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    const fabricCanvas = new FabricCanvas(canvasRef.current, {
      width: containerWidth,
      height: containerHeight * 0.7,
      backgroundColor: '#000000'
    });
    setCanvas(fabricCanvas);

    const img = new Image();
    img.onload = () => {
      const fabricImage = new FabricImage(img);
      
      const scale = Math.min(
        (fabricCanvas.width || 800) / img.width,
        (fabricCanvas.height || 600) / img.height
      ) * 0.9;
      
      fabricImage.set({
        originX: 'center',
        originY: 'center',
        scaleX: scale,
        scaleY: scale,
      });

      fabricCanvas.add(fabricImage);
      fabricCanvas.centerObject(fabricImage);
      fabricCanvas.renderAll();
    };
    img.src = URL.createObjectURL(file);

    return () => {
      fabricCanvas.dispose();
      URL.revokeObjectURL(img.src);
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
    <div 
      ref={containerRef}
      className="flex flex-col h-screen bg-black text-white"
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-white/10">
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="text-white hover:bg-white/10"
        >
          <X className="h-5 w-5" />
        </Button>
        <span className="text-lg font-medium">Edit</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSave}
          className="text-white hover:bg-white/10"
        >
          <Check className="h-5 w-5" />
        </Button>
      </div>

      {/* Canvas */}
      <div className="flex-grow relative">
        <canvas ref={canvasRef} className="w-full h-full" />
        
        {/* Top Controls */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-4">
          <Button variant="ghost" size="icon" className="rounded-full bg-black/50 text-white">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full bg-black/50 text-white">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="p-4 border-t border-white/10">
        <Tabs defaultValue="adjust" className="w-full">
          <div className="flex justify-center mb-6">
            <div className="flex gap-12">
              <button className="flex flex-col items-center gap-2 text-white/80 hover:text-white">
                <Sun className="h-6 w-6" />
                <span className="text-xs">Adjust</span>
              </button>
              <button className="flex flex-col items-center gap-2 text-white/80 hover:text-white">
                <ImageIcon className="h-6 w-6" />
                <span className="text-xs">Filters</span>
              </button>
              <button className="flex flex-col items-center gap-2 text-white/80 hover:text-white">
                <Crop className="h-6 w-6" />
                <span className="text-xs">Crop</span>
              </button>
            </div>
          </div>

          <TabsContent value="adjust" className="mt-0">
            <AdjustmentPanel />
          </TabsContent>

          <TabsContent value="filters" className="mt-0">
            <FilterControls
              selectedFilter="none"
              onFilterChange={() => {}}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export const MediaEditor = (props: MediaEditorProps) => (
  <CanvasProvider>
    <MediaEditorContent {...props} />
  </CanvasProvider>
);