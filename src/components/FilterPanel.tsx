import { X } from "lucide-react"
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import { Label } from "./ui/label"
import { Slider } from "./ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { useState } from "react"
import { api } from "../../axiosSetup"
import { useQuery } from "@tanstack/react-query"
import { Category, Supermarket } from "../types"

function toTitleCase(value: string) {
  if (!value) return value
  return value[0].toUpperCase() + value.slice(1).toLowerCase()
}

interface FilterPanelProps {
  selectedStore: string
  selectedCategory: string
  priceRange: [number, number]
  onStoreToggle: (store: string) => void
  onCategoryToggle: (category: string) => void
  onPriceRangeChange: (range: [number, number]) => void
  onReset: () => void
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
      const { data } = await api.get("/categories")
      return data?.data as Category[]
    },
  })

  const { data: supermarkets } = useQuery({
    retry: false,
    queryKey: ["supermarkets"],
    queryFn: async () => {
      const { data } = await api.get("/supermarkets")
      return data?.data as Supermarket[]
    },
  })

  const hasActiveFilters =
    selectedStore.length > 0 ||
    selectedCategory.length > 0 ||
    priceRange[0] > 1 ||
    priceRange[1] < 20

  const [innerSliderValue, setInnerSliderValue] =
    useState<[number, number]>(priceRange)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow-sm border dark:border-gray-700 space-y-5 transition-colors">
      {/* Header */}
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

      {/* Supermarkets */}
      {Array.isArray(supermarkets) && (
        <div>
          <h3 className="font-medium mb-3 text-sm sm:text-base dark:text-white">
            Supermarkets
          </h3>

          <div className="space-y-2.5">
            {supermarkets.map((store) => {
              const isChecked = selectedStore === store.slug

              return (
                <div key={store.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`store-${store.id}`}
                    checked={isChecked}
                    onCheckedChange={() =>
                      onStoreToggle(isChecked ? "" : store.slug)
                    }
                  />
                  <Label
                    htmlFor={`store-${store.id}`}
                    className="cursor-pointer flex items-center gap-2 text-sm sm:text-base dark:text-gray-300"
                  >
                    {store.name}
                  </Label>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Categories (Select) */}
      {Array.isArray(categories) && (
        <div>
          <h3 className="font-medium mb-3 text-sm sm:text-base dark:text-white">
            Category
          </h3>

          <Select
            value={selectedCategory || "all"}
            onValueChange={(value: string) =>
              onCategoryToggle(value === "all" ? "" : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>

              {categories.map((category) => (
                <SelectItem
                  key={category.name}
                  value={category.name}
                >
                  {toTitleCase(category.name)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Price Range */}
      <div>
        <h3 className="font-medium mb-3 text-sm sm:text-base dark:text-white">
          Price range: €{priceRange[0]} – €{priceRange[1]}
        </h3>

        <Slider
          min={0}
          max={100}
          step={1}
          value={innerSliderValue}
          onValueChange={(value: [number, number]) =>
            setInnerSliderValue(value)
          }
          onValueCommit={(value: [number, number]) =>
            onPriceRangeChange(value)
          }
          className="mt-2"
        />
      </div>
    </div>
  )
}
