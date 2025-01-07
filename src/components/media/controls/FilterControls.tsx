import React from 'react';
import { Button } from "@/components/ui/button";
import { Palette, Brush } from "lucide-react";

interface FilterControlsProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  selectedFilter,
  onFilterChange,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selectedFilter === 'none' ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange('none')}
        className="bg-white text-black hover:bg-gray-200"
      >
        <Palette className="h-4 w-4 mr-2" /> Normal
      </Button>
      <Button
        variant={selectedFilter === 'grayscale' ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange('grayscale')}
        className="bg-transparent hover:bg-white/10 text-white border-white/20"
      >
        <Brush className="h-4 w-4 mr-2" /> Grayscale
      </Button>
      <Button
        variant={selectedFilter === 'sepia' ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange('sepia')}
        className="bg-transparent hover:bg-white/10 text-white border-white/20"
      >
        <Brush className="h-4 w-4 mr-2" /> Sepia
      </Button>
    </div>
  );
};