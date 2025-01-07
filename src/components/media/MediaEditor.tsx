import React, { useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Image as FabricImage } from 'fabric';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Check, RotateCcw } from "lucide-react";
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
  const { setCanvas, canvas } = useCanvas();

  useEffect(() => {
    if (!canvasRef.current) return;

    // Create a new Fabric canvas with proper dimensions
    const fabricCanvas = new FabricCanvas(canvasRef.current, {
      width: canvasRef.current.offsetWidth,
      height: canvasRef.current.offsetHeight,
      backgroundColor: '#000000'
    });
    setCanvas(fabricCanvas);

    // Load and set up the image
    const img = new Image();
    img.onload = () => {
      const fabricImage = new FabricImage(img);
      fabricImage.scaleToWidth(fabricCanvas.width || 800);
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
    <div className="space-y-6 p-4">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      <Tabs defaultValue="adjust" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="adjust">Adjust</TabsTrigger>
          <TabsTrigger value="effects">Effects</TabsTrigger>
        </TabsList>

        <TabsContent value="adjust">
          <AdjustmentPanel />
        </TabsContent>

        <TabsContent value="effects">
          <FilterControls
            selectedFilter="none"
            onFilterChange={(filter) => {
              // Filter logic handled by useImageEffects hook
            }}
          />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          <RotateCcw className="h-4 w-4 mr-2" /> Reset
        </Button>
        <Button onClick={handleSave}>
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