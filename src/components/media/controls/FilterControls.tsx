import React from 'react';
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";

interface FilterControlsProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  selectedFilter,
  onFilterChange,
}) => {
  const filters = ['Original', 'Mono', 'Fade', 'Chrome', 'Noir'];

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-4">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter.toLowerCase())}
            className={`w-12 h-12 rounded-full border flex items-center justify-center ${
              selectedFilter === filter.toLowerCase()
                ? 'border-white'
                : 'border-white/20'
            }`}
          >
            <ImageIcon className="h-5 w-5 text-white" />
          </button>
        ))}
      </div>
      <span className="text-sm text-white/80">{selectedFilter === 'none' ? 'Original' : selectedFilter}</span>
    </div>
  );
};