import React, { useRef, useEffect } from "react";

interface VideoEditorProps {
  file: File;
  brightness: number;
  contrast: number;
  rotation: number;
  selectedFilter: string;
  audioVolume: number;
}

export const VideoEditor = ({
  file,
  brightness,
  contrast,
  rotation,
  selectedFilter,
  audioVolume
}: VideoEditorProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    video.src = URL.createObjectURL(file);
    video.volume = audioVolume / 100;

    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      video.play();
    };

    const drawFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();

      // Apply rotation
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      // Apply filters
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
      if (selectedFilter === 'grayscale') {
        ctx.filter += ' grayscale(100%)';
      } else if (selectedFilter === 'sepia') {
        ctx.filter += ' sepia(100%)';
      }

      ctx.drawImage(video, 0, 0);
      ctx.restore();

      requestAnimationFrame(drawFrame);
    };

    video.onplay = () => {
      drawFrame();
    };

    return () => {
      video.pause();
      URL.revokeObjectURL(video.src);
    };
  }, [file, brightness, contrast, rotation, selectedFilter, audioVolume]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain"
      />
      <video
        ref={videoRef}
        className="hidden"
        loop
        muted
        playsInline
      />
    </>
  );
};