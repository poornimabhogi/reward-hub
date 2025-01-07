import React, { useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Image as FabricImage } from 'fabric';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { X, Check, ArrowLeft, ArrowRight, Sun, ImageIcon, Crop } from "lucide-react";
import { CanvasProvider } from "@/contexts/CanvasContext";
import { AdjustmentPanel } from "./editors/AdjustmentPanel";
import { FilterControls } from "./controls/FilterControls";
import { useCanvas } from "@/contexts/CanvasContext";

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
      className="fixed inset-0 z-50 flex flex-col bg-black text-white"
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-white/10">
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="text-white hover:bg-white/10"
        >
          <X className="h-6 w-6" />
        </Button>
        <span className="text-lg font-medium">Edit</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSave}
          className="text-white hover:bg-white/10"
        >
          <Check className="h-6 w-6" />
        </Button>
      </div>

      {/* Canvas */}
      <div className="flex-grow relative">
        <canvas ref={canvasRef} className="w-full h-full" />
        
        {/* Navigation Controls */}
        <div className="absolute top-1/2 left-0 right-0 flex justify-between px-4 -translate-y-1/2 pointer-events-none">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-black/50 text-white hover:bg-black/70 pointer-events-auto"
          >
            <ArrowLeft className="h-8 w-8" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-black/50 text-white hover:bg-black/70 pointer-events-auto"
          >
            <ArrowRight className="h-8 w-8" />
          </Button>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="p-6 border-t border-white/10 bg-black/95">
        <Tabs defaultValue="adjust" className="w-full">
          <div className="flex justify-center mb-6">
            <div className="flex gap-12">
              <button className="flex flex-col items-center gap-2 text-white group">
                <div className="p-4 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                  <Sun className="h-8 w-8" />
                </div>
                <span className="text-sm font-medium">Adjust</span>
              </button>
              <button className="flex flex-col items-center gap-2 text-white group">
                <div className="p-4 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                  <ImageIcon className="h-8 w-8" />
                </div>
                <span className="text-sm font-medium">Filters</span>
              </button>
              <button className="flex flex-col items-center gap-2 text-white group">
                <div className="p-4 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                  <Crop className="h-8 w-8" />
                </div>
                <span className="text-sm font-medium">Crop</span>
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