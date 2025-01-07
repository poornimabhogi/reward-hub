import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface VideoViewerProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
}

export const VideoViewer = ({ isOpen, onClose, videoUrl }: VideoViewerProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-screen max-h-screen w-screen h-screen p-0 bg-black/95 border-none">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-50 rounded-full bg-black/50 p-2 hover:bg-black/70 transition-colors"
        >
          <X className="h-6 w-6 text-white" />
        </button>
        <div className="w-full h-full flex items-center justify-center">
          <video
            src={videoUrl}
            className="max-h-[90vh] max-w-[90vw] rounded-lg"
            controls
            autoPlay
            playsInline
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};