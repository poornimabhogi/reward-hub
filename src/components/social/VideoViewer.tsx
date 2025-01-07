import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface VideoViewerProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  allVideos: { id: number; content: string }[];
  currentVideoId: number;
}

export const VideoViewer = ({ 
  isOpen, 
  onClose, 
  videoUrl, 
  allVideos,
  currentVideoId 
}: VideoViewerProps) => {
  const currentIndex = allVideos.findIndex(v => v.id === currentVideoId);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-screen max-h-screen w-screen h-screen p-0 bg-black/95 border-none">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-50 rounded-full bg-black/50 p-2 hover:bg-black/70 transition-colors"
        >
          <X className="h-6 w-6 text-white" />
        </button>
        <Carousel
          className="w-full h-full"
          opts={{
            align: "center",
            containScroll: false,
            startIndex: currentIndex
          }}
        >
          <CarouselContent className="h-full">
            {allVideos.map((video) => (
              <CarouselItem key={video.id} className="h-full flex items-center justify-center">
                <video
                  src={video.content}
                  className="max-h-[90vh] max-w-[90vw] rounded-lg"
                  controls
                  autoPlay
                  playsInline
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </DialogContent>
    </Dialog>
  );
};