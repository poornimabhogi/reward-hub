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
    { name: 'Original', class: '' },
    { name: 'Mono', class: 'grayscale' },
    { name: 'Fade', class: 'brightness-125 contrast-75' },
    { name: 'Chrome', class: 'contrast-125 saturate-150' },
    { name: 'Noir', class: 'grayscale contrast-150 brightness-75' },
    { name: 'Vivid', class: 'saturate-150 contrast-110' },
    { name: 'Warm', class: 'sepia brightness-110' },
    { name: 'Cool', class: 'hue-rotate-30 brightness-105' }
  ];

  return (
    <div className="flex gap-4 overflow-x-auto py-2 px-2 scrollbar-hide">
      {filters.map((filter) => (
        <button
          key={filter.name}
          onClick={() => onFilterChange(filter.name.toLowerCase())}
          className="flex flex-col items-center gap-2 min-w-[72px]"
        >
          <div
            className={`w-16 h-16 rounded-lg bg-zinc-800 ${filter.class} ${
              selectedFilter === filter.name.toLowerCase()
                ? 'ring-2 ring-white'
                : ''
            }`}
          />
          <span className="text-xs text-white whitespace-nowrap">
            {filter.name}
          </span>
        </button>
      ))}
    </div>
  );
};