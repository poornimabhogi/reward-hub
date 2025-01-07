import React, { useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Image as FabricImage } from 'fabric';
import { Button } from "@/components/ui/button";
import { 
  Sun, 
  SunMedium, 
  Crop, 
  Filter, 
  Contrast, 
  ImagePlus,
  Sparkles,
  Palette,
  Type
} from "lucide-react";
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
  const [activeControl, setActiveControl] = React.useState<"filters" | "adjust" | "crop" | "text" | "stickers" | null>(null);
  const [brightness, setBrightness] = React.useState(100);
  const [contrast, setContrast] = React.useState(100);

  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new FabricCanvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight - 180, // Account for header and footer
      backgroundColor: '#000000'
    });
    setCanvas(fabricCanvas);

    const img = new Image();
    img.onload = () => {
      const fabricImage = new FabricImage(img);
      
      const scale = Math.min(
        window.innerWidth / img.width,
        (window.innerHeight - 180) / img.height
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

  const editingControls = [
    { 
      id: 'filters',
      icon: <Filter className="h-6 w-6" />,
      label: 'Filters'
    },
    {
      id: 'adjust',
      icon: <SunMedium className="h-6 w-6" />,
      label: 'Adjust'
    },
    {
      id: 'crop',
      icon: <Crop className="h-6 w-6" />,
      label: 'Crop'
    },
    {
      id: 'text',
      icon: <Type className="h-6 w-6" />,
      label: 'Text'
    },
    {
      id: 'stickers',
      icon: <Sparkles className="h-6 w-6" />,
      label: 'Stickers'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="h-[60px] flex justify-between items-center px-4 bg-black/90 border-b border-white/10">
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
          Done
        </Button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative bg-black">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-contain" />
      </div>

      {/* Bottom Controls */}
      <div className="h-[120px] bg-black/90 border-t border-white/10">
        <div className="flex justify-around items-center h-full px-4">
          {editingControls.map((control) => (
            <button
              key={control.id}
              className="flex flex-col items-center gap-2"
              onClick={() => setActiveControl(control.id as any)}
            >
              <div className={`h-12 w-12 rounded-full ${
                activeControl === control.id ? 'bg-white/20' : 'bg-black/40'
              } flex items-center justify-center`}>
                {control.icon}
              </div>
              <span className="text-xs text-white">{control.label}</span>
            </button>
          ))}
        </div>

        {/* Filter Controls Panel */}
        {activeControl === "filters" && (
          <div className="absolute bottom-[120px] left-0 right-0 bg-black/90 border-t border-white/10 p-4">
            <FilterControls
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
            />
          </div>
        )}

        {/* Adjustment Controls */}
        {activeControl === "adjust" && (
          <div className="absolute bottom-[120px] left-0 right-0 bg-black/90 border-t border-white/10 p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white text-sm">Brightness</span>
                <input 
                  type="range" 
                  min="0" 
                  max="200" 
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-2/3"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white text-sm">Contrast</span>
                <input 
                  type="range" 
                  min="0" 
                  max="200" 
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-2/3"
                />
              </div>
            </div>
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