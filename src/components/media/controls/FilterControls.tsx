import React from 'react';
import { Filter } from "lucide-react";

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
            className={`w-14 h-14 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-zinc-800 transition-colors ${
              selectedFilter === filter.toLowerCase()
                ? 'border-2 border-white'
                : ''
            }`}
          >
            <Filter className="h-6 w-6 text-white" />
          </button>
        ))}
      </div>
      <span className="text-sm text-white/80">
        {selectedFilter === 'none' ? 'Original' : selectedFilter}
      </span>
    </div>
  );
};