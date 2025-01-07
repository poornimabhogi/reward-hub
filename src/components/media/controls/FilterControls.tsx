import React from "react";
import { Button } from "@/components/ui/button";
import { Palette, Brush } from "lucide-react";

interface FilterControlsProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

export const FilterControls = ({ selectedFilter, onFilterChange }: FilterControlsProps) => {
  return (
    <div className="flex gap-2">
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
        className="bg-neutral-800 text-white hover:bg-neutral-700"
      >
        <Brush className="h-4 w-4 mr-2" /> Grayscale
      </Button>
      <Button
        variant={selectedFilter === 'sepia' ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange('sepia')}
        className="bg-neutral-800 text-white hover:bg-neutral-700"
      >
        <Brush className="h-4 w-4 mr-2" /> Sepia
      </Button>
    </div>
  );
};