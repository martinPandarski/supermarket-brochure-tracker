import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { useState } from "react";
import { api } from "../../axiosSetup";
import { useQuery } from "@tanstack/react-query";
import { Category, Supermarket } from "../types";

function toTitleCase(value: string) {
  return value
    .replace(/[-_]/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

interface FilterPanelProps {
  selectedStore: string;
  selectedCategory: string;
  priceRange: [number, number];
  onStoreToggle: (store: string) => void;
  onCategoryToggle: (category: string) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onReset: () => void;
}

export function FilterPanel({
  selectedStore,
  selectedCategory,
  priceRange,
  onStoreToggle,
  onCategoryToggle,
  onPriceRangeChange,
  onReset,
}: FilterPanelProps) {
  const { data: categories } = useQuery({
    retry: false,
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.get(`/categories`);

      return data?.data as Category[];
    },
  });

  const { data: supermarkets } = useQuery({
    retry: false,
    queryKey: ["supermarkets"],
    queryFn: async () => {
      const { data } = await api.get(`/supermarkets`);

      return data?.data as Supermarket[];
    },
  });

  const hasActiveFilters =
    selectedStore.length > 0 ||
    selectedCategory.length > 0 ||
    priceRange[0] > 1 ||
    priceRange[1] < 20;

  const [innnerSliderValue, setInnerSliderValue] = useState(priceRange);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow-sm border dark:border-gray-700 space-y-4 sm:space-y-6 transition-colors">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-base sm:text-lg dark:text-white">
          Filters
        </h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 px-2 text-xs sm:text-sm"
          >
            <X className="size-4 mr-1" />
            Reset
          </Button>
        )}
      </div>

      {/* Stores */}
      {Array.isArray(supermarkets) && (
        <div>
          <h3 className="font-medium mb-3 text-sm sm:text-base dark:text-white">
            Supermarkets
          </h3>
          <div className="space-y-2.5">
            {supermarkets.map((store) => (
              <div key={store.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`store-${store.id}`}
                  checked={selectedStore = store.slug}
                  onCheckedChange={() => onStoreToggle(store.slug)}
                />
                <Label
                  htmlFor={`store-${store.id}`}
                  className="cursor-pointer flex items-center gap-2 text-sm sm:text-base dark:text-gray-300"
                >
                  <span>{store.name}</span>
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      {Array.isArray(categories) && (
        <div>
          <h3 className="font-medium mb-3 text-sm sm:text-base dark:text-white">
            Categories
          </h3>

          <div
            className="
      space-y-2.5
      max-h-[50vh]
      overflow-y-auto
      pr-1
      sm:max-h-none
      sm:overflow-visible
    "
          >
            {categories.map((category) => (
              <div key={category.name} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.name}`}
                  checked={selectedCategory === category.name}
                  onCheckedChange={() => onCategoryToggle(category.name)}
                />
                <Label
                  htmlFor={`category-${category.name}`}
                  className="cursor-pointer text-sm sm:text-base dark:text-gray-300"
                >
                  {toTitleCase(category.name)}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div>
        <h3 className="font-medium mb-3 text-sm sm:text-base dark:text-white">
          Price Range: €{priceRange[0]} - €{priceRange[1]}
        </h3>
        <Slider
          min={0}
          max={100}
          step={1}
          value={innnerSliderValue}
          onValueCommit={(value: [number, number]) => onPriceRangeChange(value)}
          onValueChange={(value: [number, number]) =>
            setInnerSliderValue(value)
          }
          className="mt-2"
        />
      </div>
    </div>
  );
}
