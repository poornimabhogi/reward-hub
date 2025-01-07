import React, { useRef, useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { 
  Sun, 
  Contrast, 
  Crop, 
  RotateCcw, 
  Check,
  RefreshCw
} from "lucide-react";

interface MediaEditorProps {
  file: File;
  onSave: (editedFile: File) => void;
  onCancel: () => void;
}

export const MediaEditor = ({ file, onSave, onCancel }: MediaEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isVideo, setIsVideo] = useState(false);

  useEffect(() => {
    const setupMedia = async () => {
      const isVideoFile = file.type.startsWith('video/');
      setIsVideo(isVideoFile);

      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        if (isVideoFile && videoRef.current) {
          videoRef.current.src = URL.createObjectURL(file);
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current && canvasRef.current) {
              canvasRef.current.width = videoRef.current.videoWidth;
              canvasRef.current.height = videoRef.current.videoHeight;
              applyEffects();
            }
          };
        } else {
          const img = new Image();
          img.onload = () => {
            if (canvasRef.current) {
              canvasRef.current.width = img.width;
              canvasRef.current.height = img.height;
              ctx.drawImage(img, 0, 0);
              applyEffects();
            }
          };
          img.src = URL.createObjectURL(file);
        }
      }
    };

    setupMedia();
  }, [file]);

  const applyEffects = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Apply rotation
    ctx.save();
    ctx.translate(canvasRef.current.width / 2, canvasRef.current.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-canvasRef.current.width / 2, -canvasRef.current.height / 2);

    // Draw media
    if (isVideo && videoRef.current) {
      ctx.drawImage(videoRef.current, 0, 0);
    } else {
      const img = new Image();
      img.onload = () => {
        if (canvasRef.current && ctx) {
          ctx.drawImage(img, 0, 0);
          // Apply filters
          ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
          ctx.drawImage(canvasRef.current, 0, 0);
        }
      };
      img.src = URL.createObjectURL(file);
    }

    ctx.restore();
  };

  const handleSave = async () => {
    if (!canvasRef.current) return;
    
    const blob = await new Promise<Blob>((resolve) => {
      canvasRef.current?.toBlob((blob) => {
        if (blob) resolve(blob);
      }, file.type);
    });

    const editedFile = new File([blob], file.name, { type: file.type });
    onSave(editedFile);
  };

  useEffect(() => {
    applyEffects();
  }, [brightness, contrast, rotation]);

  return (
    <div className="space-y-6 p-4">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full object-contain"
        />
        {isVideo && (
          <video
            ref={videoRef}
            className="hidden"
            loop
            muted
            playsInline
          />
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Sun className="h-4 w-4" />
          <Slider
            value={[brightness]}
            onValueChange={(value) => setBrightness(value[0])}
            min={0}
            max={200}
            step={1}
            className="flex-1"
          />
        </div>

        <div className="flex items-center gap-4">
          <Contrast className="h-4 w-4" />
          <Slider
            value={[contrast]}
            onValueChange={(value) => setContrast(value[0])}
            min={0}
            max={200}
            step={1}
            className="flex-1"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setRotation((prev) => (prev + 90) % 360)}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            setBrightness(100);
            setContrast(100);
            setRotation(0);
          }}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          <Check className="mr-2 h-4 w-4" /> Save
        </Button>
      </div>
    </div>
  );
};