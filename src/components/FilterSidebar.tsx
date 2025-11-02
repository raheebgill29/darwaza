"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type FilterSidebarProps = {
  filters: any;
  onFilterChange: (filters: any) => void;
  sortOption: string;
  onSortChange: (option: string) => void;
};

export default function FilterSidebar({
  filters,
  onFilterChange,
  sortOption,
  onSortChange,
}: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "newest", label: "Newest" },
    { value: "price-low-high", label: "Price: Low to High" },
    { value: "price-high-low", label: "Price: High to Low" },
  ];

  const priceRanges = [
    { value: "under-1000", label: "Under Rs 1,000" },
    { value: "1000-3000", label: "Rs 1,000 - Rs 3,000" },
    { value: "3000-5000", label: "Rs 3,000 - Rs 5,000" },
    { value: "over-5000", label: "Over Rs 5,000" },
  ];

  const handlePriceRangeChange = (value: string) => {
    const currentPriceRanges = filters.priceRange || [];
    let newPriceRanges;
    
    if (currentPriceRanges.includes(value)) {
      // Remove the value if it's already selected
      newPriceRanges = currentPriceRanges.filter(range => range !== value);
    } else {
      // Add the value if it's not selected
      newPriceRanges = [...currentPriceRanges, value];
    }
    
    onFilterChange({
      ...filters,
      priceRange: newPriceRanges
    });
  };

  const handleResetFilters = () => {
    onFilterChange({ priceRange: [] });
    onSortChange("featured");
  };

  return (
    <div className="sticky top-24">
      {/* Mobile Filter Toggle */}
      <div className="mb-4 block md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between rounded-lg bg-white p-3 shadow-sm"
        >
          <span className="font-medium text-accent">Filters & Sorting</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 text-accent transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Desktop Filter Content - Always Visible */}
      <div className="hidden md:block rounded-lg bg-white p-5 shadow-sm">
        {/* Sort Options */}
        <div className="mb-6">
          <h3 className="mb-3 text-lg font-semibold text-accent">Sort By</h3>
          <div className="space-y-2">
            {sortOptions.map((option) => (
              <div key={`desktop-${option.value}`} className="flex items-center">
                <input
                  type="radio"
                  id={`desktop-${option.value}`}
                  name="desktop-sort"
                  value={option.value}
                  checked={sortOption === option.value}
                  onChange={() => onSortChange(option.value)}
                  className="h-4 w-4 text-accent focus:ring-accent"
                />
                <label
                  htmlFor={`desktop-${option.value}`}
                  className="ml-2 text-sm text-accent/80"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Filter */}
        <div className="mb-6">
          <h3 className="mb-3 text-lg font-semibold text-accent">Price Range</h3>
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <div key={`desktop-${range.value}`} className="flex items-center">
                <input
                  type="checkbox"
                  id={`desktop-${range.value}`}
                  name={range.value}
                  checked={filters.priceRange?.includes(range.value)}
                  onChange={() => handlePriceRangeChange(range.value)}
                  className="h-4 w-4 rounded text-accent focus:ring-accent"
                />
                <label
                  htmlFor={`desktop-${range.value}`}
                  className="ml-2 text-sm text-accent/80"
                >
                  {range.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Reset Filters Button */}
        <button 
          onClick={handleResetFilters}
          className="mt-4 w-full rounded-full border border-accent px-4 py-2 text-sm text-accent transition-colors hover:bg-accent hover:text-white"
        >
          Reset Filters
        </button>
      </div>

      {/* Mobile Filter Content - Toggleable */}
      <motion.div
        className="md:hidden overflow-hidden rounded-lg bg-white p-5 shadow-sm"
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: isOpen ? 1 : 0,
          height: isOpen ? "auto" : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Sort Options */}
        <div className="mb-6">
          <h3 className="mb-3 text-lg font-semibold text-accent">Sort By</h3>
          <div className="space-y-2">
            {sortOptions.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={option.value}
                  name="sort"
                  value={option.value}
                  checked={sortOption === option.value}
                  onChange={() => onSortChange(option.value)}
                  className="h-4 w-4 text-accent focus:ring-accent"
                />
                <label
                  htmlFor={option.value}
                  className="ml-2 text-sm text-accent/80"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Filter */}
        <div className="mb-6">
          <h3 className="mb-3 text-lg font-semibold text-accent">Price Range</h3>
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <div key={range.value} className="flex items-center">
                <input
                  type="checkbox"
                  id={range.value}
                  name={range.value}
                  checked={filters.priceRange?.includes(range.value)}
                  onChange={() => handlePriceRangeChange(range.value)}
                  className="h-4 w-4 rounded text-accent focus:ring-accent"
                />
                <label
                  htmlFor={range.value}
                  className="ml-2 text-sm text-accent/80"
                >
                  {range.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Reset Filters Button */}
        <button 
          onClick={handleResetFilters}
          className="mt-4 w-full rounded-full border border-accent px-4 py-2 text-sm text-accent transition-colors hover:bg-accent hover:text-white"
        >
          Reset Filters
        </button>
      </motion.div>
    </div>
  );
}