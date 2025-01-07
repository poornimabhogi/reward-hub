import React from 'react';
import { Button } from "@/components/ui/button";
import { X, Send } from "lucide-react";

interface TopControlsProps {
  onCancel: () => void;
  onSave: () => void;
}

export const TopControls: React.FC<TopControlsProps> = ({ onCancel, onSave }) => (
  <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4">
    <Button
      variant="ghost"
      size="icon"
      onClick={onCancel}
      className="text-white hover:bg-black/20 rounded-full"
    >
      <X className="h-6 w-6" />
    </Button>
    <Button
      variant="ghost"
      size="icon"
      onClick={onSave}
      className="text-white hover:bg-black/20 rounded-full"
    >
      <Send className="h-6 w-6" />
    </Button>
  </div>
);