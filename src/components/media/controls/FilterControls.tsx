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
      >
        <Palette className="h-4 w-4 mr-2" /> Normal
      </Button>
      <Button
        variant={selectedFilter === 'grayscale' ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange('grayscale')}
      >
        <Brush className="h-4 w-4 mr-2" /> Grayscale
      </Button>
      <Button
        variant={selectedFilter === 'sepia' ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange('sepia')}
      >
        <Brush className="h-4 w-4 mr-2" /> Sepia
      </Button>
    </div>
  );
};