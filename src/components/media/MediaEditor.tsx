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
      const element = containerRef.current;
      if (element?.requestFullscreen) {
        element.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    const fabricCanvas = new FabricCanvas(canvasRef.current, {
      width: containerWidth,
      height: containerHeight * 0.8,
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
      className={cn(
        "flex flex-col space-y-4 bg-black text-white min-h-screen",
        isFullscreen ? "fixed inset-0 z-50" : ""
      )}
    >
      <div className="flex justify-between items-center p-4 border-b border-white/10">
        <h2 className="text-xl font-semibold">Edit Media</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleFullscreen}
          className="text-white hover:bg-white/10"
        >
          {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
        </Button>
      </div>

      <div className="flex-grow px-4">
        <div className="relative h-full rounded-lg overflow-hidden bg-black">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>
      </div>

      <div className="border-t border-white/10">
        <Tabs defaultValue="adjust" className="w-full">
          <TabsList className="w-full border-b border-white/10">
            <TabsTrigger 
              value="adjust" 
              className="flex-1 text-white data-[state=active]:bg-white/10 rounded-none border-r border-white/10"
            >
              Adjust
            </TabsTrigger>
            <TabsTrigger 
              value="effects" 
              className="flex-1 text-white data-[state=active]:bg-white/10 rounded-none"
            >
              Effects
            </TabsTrigger>
          </TabsList>

          <TabsContent value="adjust" className="p-4">
            <AdjustmentPanel />
          </TabsContent>

          <TabsContent value="effects" className="p-4">
            <FilterControls
              selectedFilter="none"
              onFilterChange={(filter) => {
                // Filter logic handled by useImageEffects hook
              }}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 p-4 border-t border-white/10">
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="bg-transparent hover:bg-white/10 text-white border-white/20"
          >
            <RotateCcw className="h-4 w-4 mr-2" /> Reset
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-white hover:bg-gray-200 text-black"
          >
            <Check className="h-4 w-4 mr-2" /> Save
          </Button>
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