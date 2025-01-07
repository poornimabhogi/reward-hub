import React, { useRef, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Sun, Contrast } from "lucide-react";

interface ImageEditorProps {
  file: File;
  brightness: number;
  contrast: number;
  rotation: number;
  selectedFilter: string;
  stickers: Array<{ id: string; x: number; y: number; content: string }>;
  notes: Array<{ id: string; x: number; y: number; text: string }>;
  onImageLoad?: () => void;
}

export const ImageEditor = ({
  file,
  brightness,
  contrast,
  rotation,
  selectedFilter,
  stickers,
  notes,
  onImageLoad
}: ImageEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      if (!canvas) return;
      
      // Set canvas dimensions to match image
      canvas.width = img.width;
      canvas.height = img.height;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Save the context state
      ctx.save();

      // Apply rotation
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      // Draw image with filters
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
      
      // Apply additional filters
      if (selectedFilter === 'grayscale') {
        ctx.filter += ' grayscale(100%)';
      } else if (selectedFilter === 'sepia') {
        ctx.filter += ' sepia(100%)';
      }

      // Draw the image
      ctx.drawImage(img, 0, 0);

      // Draw stickers
      stickers.forEach(sticker => {
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText(sticker.content, sticker.x, sticker.y);
      });

      // Draw notes
      notes.forEach(note => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(note.x, note.y, 150, 30);
        ctx.fillStyle = 'black';
        ctx.font = '16px Arial';
        ctx.fillText(note.text, note.x + 5, note.y + 20);
      });

      // Restore the context state
      ctx.restore();

      onImageLoad?.();
    };

    img.src = URL.createObjectURL(file);

    return () => {
      URL.revokeObjectURL(img.src);
    };
  }, [file, brightness, contrast, rotation, selectedFilter, stickers, notes]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full object-contain"
    />
  );
};