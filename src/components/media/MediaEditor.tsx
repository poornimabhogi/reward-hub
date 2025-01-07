import React, { useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Image as FabricImage } from 'fabric';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Check, RotateCcw, Maximize2, Minimize2 } from "lucide-react";
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
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    // Create a new Fabric canvas with container dimensions
    const fabricCanvas = new FabricCanvas(canvasRef.current, {
      width: containerWidth,
      height: containerHeight * 0.6, // Adjust height to prevent cropping
      backgroundColor: '#1a1a1a' // Dark background
    });
    setCanvas(fabricCanvas);

    // Load and set up the image
    const img = new Image();
    img.onload = () => {
      const fabricImage = new FabricImage(img);
      
      // Calculate scaling to fit the image properly
      const scale = Math.min(
        (fabricCanvas.width || 800) / img.width,
        (fabricCanvas.height || 600) / img.height
      );
      
      fabricImage.scale(scale);
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
      className={cn(
        "flex flex-col space-y-6 bg-zinc-900 text-white transition-all duration-300",
        isFullscreen ? "fixed inset-0 z-50 p-6" : "p-4"
      )}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Edit Media</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleFullscreen}
          className="text-white hover:text-white/80"
        >
          {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
        </Button>
      </div>

      <div className="relative flex-grow rounded-lg overflow-hidden bg-black">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      <Tabs defaultValue="adjust" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-zinc-800">
          <TabsTrigger value="adjust" className="data-[state=active]:bg-zinc-700">Adjust</TabsTrigger>
          <TabsTrigger value="effects" className="data-[state=active]:bg-zinc-700">Effects</TabsTrigger>
        </TabsList>

        <TabsContent value="adjust" className="bg-zinc-800 rounded-b-lg p-4">
          <AdjustmentPanel />
        </TabsContent>

        <TabsContent value="effects" className="bg-zinc-800 rounded-b-lg p-4">
          <FilterControls
            selectedFilter="none"
            onFilterChange={(filter) => {
              // Filter logic handled by useImageEffects hook
            }}
          />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700"
        >
          <RotateCcw className="h-4 w-4 mr-2" /> Reset
        </Button>
        <Button 
          onClick={handleSave}
          className="bg-violet-600 hover:bg-violet-700 text-white"
        >
          <Check className="h-4 w-4 mr-2" /> Save
        </Button>
      </div>
    </div>
  );
};

export const MediaEditor = (props: MediaEditorProps) => (
  <CanvasProvider>
    <MediaEditorContent {...props} />
  </CanvasProvider>
);