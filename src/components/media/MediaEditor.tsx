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
      if (element) {
        const requestFullscreen = element.requestFullscreen || 
                               (element as any).mozRequestFullScreen || 
                               (element as any).webkitRequestFullscreen || 
                               (element as any).msRequestFullscreen;
        
        if (requestFullscreen) {
          requestFullscreen.call(element);
          setIsFullscreen(true);
        }
      }
    } else {
      const exitFullscreen = document.exitFullscreen || 
                          (document as any).mozCancelFullScreen || 
                          (document as any).webkitExitFullscreen || 
                          (document as any).msExitFullscreen;
      
      if (exitFullscreen) {
        exitFullscreen.call(document);
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(
        document.fullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).msFullscreenElement
      ));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
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
      
      // Calculate scaling to fit the image properly
      const scale = Math.min(
        (fabricCanvas.width || 800) / img.width,
        (fabricCanvas.height || 600) / img.height
      ) * 0.9;
      
      // Fix image orientation
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
        "flex flex-col space-y-6 bg-black text-white transition-all duration-300",
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

      <div className="relative flex-grow rounded-lg overflow-hidden bg-black min-h-[400px]">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      <Tabs defaultValue="adjust" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-neutral-900">
          <TabsTrigger value="adjust" className="text-white data-[state=active]:bg-neutral-800">
            Adjust
          </TabsTrigger>
          <TabsTrigger value="effects" className="text-white data-[state=active]:bg-neutral-800">
            Effects
          </TabsTrigger>
        </TabsList>

        <TabsContent value="adjust" className="bg-neutral-900 rounded-b-lg p-4">
          <AdjustmentPanel />
        </TabsContent>

        <TabsContent value="effects" className="bg-neutral-900 rounded-b-lg p-4">
          <FilterControls
            selectedFilter="none"
            onFilterChange={(filter) => {
              // Filter logic handled by useImageEffects hook
            }}
          />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2 p-4 bg-neutral-900 rounded-lg">
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700"
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
  );
};

export const MediaEditor = (props: MediaEditorProps) => (
  <CanvasProvider>
    <MediaEditorContent {...props} />
  </CanvasProvider>
);