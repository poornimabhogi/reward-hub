import React from 'react';
import { Filter, Sliders, Crop } from "lucide-react";
import { FilterControls } from "./FilterControls";
import { AdjustmentControls } from "./AdjustmentControls";

interface BottomControlsProps {
  activeControl: "filters" | "adjust" | "crop" | null;
  setActiveControl: (control: "filters" | "adjust" | "crop" | null) => void;
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  activeAdjustment: string;
  setActiveAdjustment: (adjustment: string) => void;
}

export const BottomControls: React.FC<BottomControlsProps> = ({
  activeControl,
  setActiveControl,
  selectedFilter,
  onFilterChange,
  activeAdjustment,
  setActiveAdjustment,
}) => (
  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
    <div className="flex justify-center gap-16">
      <button 
        className="flex flex-col items-center gap-2 cursor-pointer"
        onClick={() => setActiveControl(activeControl === "filters" ? null : "filters")}
      >
        <div className={`h-14 w-14 rounded-full ${activeControl === "filters" ? "bg-white/20" : "bg-black/50"} flex items-center justify-center`}>
          <Filter className="h-6 w-6 text-white" />
        </div>
        <span className="text-xs text-white">Filters</span>
      </button>
      
      <button 
        className="flex flex-col items-center gap-2 cursor-pointer"
        onClick={() => {
          setActiveControl(activeControl === "adjust" ? null : "adjust");
          setActiveAdjustment("brightness");
        }}
      >
        <div className={`h-14 w-14 rounded-full ${activeControl === "adjust" ? "bg-white/20" : "bg-black/50"} flex items-center justify-center`}>
          <Sliders className="h-6 w-6 text-white" />
        </div>
        <span className="text-xs text-white">Adjust</span>
      </button>
      
      <button 
        className="flex flex-col items-center gap-2 cursor-pointer"
        onClick={() => setActiveControl(activeControl === "crop" ? null : "crop")}
      >
        <div className={`h-14 w-14 rounded-full ${activeControl === "crop" ? "bg-white/20" : "bg-black/50"} flex items-center justify-center`}>
          <Crop className="h-6 w-6 text-white" />
        </div>
        <span className="text-xs text-white">Crop</span>
      </button>
    </div>

    {activeControl === "filters" && (
      <div className="absolute bottom-24 left-0 right-0 bg-black/80 border-t border-white/10 p-4">
        <FilterControls
          selectedFilter={selectedFilter}
          onFilterChange={onFilterChange}
        />
      </div>
    )}

    {activeControl === "adjust" && (
      <div className="absolute bottom-24 left-0 right-0 bg-black/80 border-t border-white/10">
        <AdjustmentControls activeAdjustment={activeAdjustment} />
      </div>
    )}
  </div>
);