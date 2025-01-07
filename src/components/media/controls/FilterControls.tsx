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
  ];

  return (
    <div className="flex items-center gap-6 overflow-x-auto py-2 px-4">
      {filters.map((filter) => (
        <button
          key={filter.name}
          onClick={() => onFilterChange(filter.name.toLowerCase())}
          className="flex flex-col items-center gap-2"
        >
          <div
            className={`w-16 h-16 rounded-lg bg-zinc-800 ${filter.class} ${
              selectedFilter === filter.name.toLowerCase()
                ? 'ring-2 ring-white'
                : ''
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