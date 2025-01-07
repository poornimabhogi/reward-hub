import React from 'react';

interface FilterControlsProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  selectedFilter,
  onFilterChange,
}) => {
  const filters = [
    { name: 'Original', value: 'none' },
    { name: 'Grayscale', value: 'grayscale' },
    { name: 'Sepia', value: 'sepia' },
    { name: 'Bright', value: 'brightness' },
    { name: 'Contrast', value: 'contrast' },
  ];

  return (
    <div className="flex items-center gap-6 overflow-x-auto py-2 px-4">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className="flex flex-col items-center gap-2 cursor-pointer"
        >
          <div
            className={`w-16 h-16 rounded-lg bg-zinc-800 ${
              selectedFilter === filter.value ? 'ring-2 ring-white' : ''
            }`}
          />
          <span className="text-xs text-white">
            {filter.name}
          </span>
        </button>
      ))}
    </div>
  );
};