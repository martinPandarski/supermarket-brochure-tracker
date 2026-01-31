import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import Select from "react-select";
import { useMemo, useState } from "react";
import { api } from "../../axiosSetup";
import { useQuery } from "@tanstack/react-query";
import { Category, Supermarket } from "../types";
import { useTheme } from "next-themes";

function toTitleCase(value: string) {
  if (!value) return value;
  return value[0].toUpperCase() + value.slice(1).toLowerCase();
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
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { data: categories } = useQuery({
    retry: false,
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.get("/categories");
      return data?.data as Category[];
    },
  });

  const { data: supermarkets } = useQuery({
    retry: false,
    queryKey: ["supermarkets"],
    queryFn: async () => {
      const { data } = await api.get("/supermarkets");
      return data?.data as Supermarket[];
    },
  });

  const hasActiveFilters =
    selectedStore.length > 0 ||
    selectedCategory.length > 0 ||
    priceRange[0] > 1 ||
    priceRange[1] < 20;

  const [innerSliderValue, setInnerSliderValue] =
    useState<[number, number]>(priceRange);

  const options = useMemo(
    () =>
      Array.isArray(categories)
        ? [
            { value: "all", label: "Всички категории" },
            ...categories.map((category) => ({
              value: category.name,
              label: toTitleCase(category.name),
            })),
          ]
        : [],
    [categories],
  );

  const selectClassNames = useMemo(() => ({
    control: ({ isFocused }: {isFocused: boolean}) =>
      [
        "flex min-h-9 w-full rounded-md border px-3 py-1 text-sm",
        "transition focus:outline-none",
        isFocused ? "border-ring ring-2 ring-ring/50" : "border-input",
        "bg-input-background text-foreground",
      ].join(" "),

    menu: () =>
      isDark
        ? "mt-1 rounded-md border bg-gray-800 text-gray-100 shadow-md"
        : "mt-1 rounded-md border bg-white text-gray-900 shadow-md",

    menuList: () =>
      "max-h-60 overflow-y-auto overscroll-contain scrollbar-thin p-1",

    option: ({ isFocused, isSelected }: {isFocused: boolean, isSelected: boolean}) =>
      [
        "cursor-pointer rounded-sm px-2 py-1.5 text-sm",
        isFocused &&
          (isDark
            ? "bg-gray-700 text-gray-100"
            : "bg-accent text-accent-foreground"),
        isSelected && "font-medium",
      ]
        .filter(Boolean)
        .join(" "),
  }), [isDark]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow-sm border dark:border-gray-700 space-y-5 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-base sm:text-lg dark:text-white">
          Филтри
        </h2>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 px-2 text-xs sm:text-sm"
          >
            <X className="size-4 mr-1" />
            Нулиране
          </Button>
        )}
      </div>

      {/* Supermarkets */}
      {Array.isArray(supermarkets) && (
        <div>
          <h3 className="font-medium mb-3 text-sm sm:text-base dark:text-white">
            Магазини
          </h3>

          <div className="space-y-2.5">
            {supermarkets.map((store) => {
              const isChecked = selectedStore === store.slug;

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
              );
            })}
          </div>
        </div>
      )}

      {/* Categories (Select) */}
      {Array.isArray(categories) && (
        <div style={{ marginBottom: 10, marginTop: 10 }}>
          <h3 className="font-medium mb-3 text-sm sm:text-base dark:text-white">
            Категория
          </h3>

          <Select
            value={
              options.find(
                (opt) => opt.value === (selectedCategory || "all"),
              ) || options[0]
            }
            onChange={(option) =>
              onCategoryToggle(
                option?.value === "all" ? "" : (option?.value ?? ""),
              )
            }
            options={options}
            placeholder="Всички категории"
            isSearchable={false}
            menuPlacement="auto"
            menuShouldScrollIntoView
            classNames={selectClassNames}
          />
        </div>
      )}

      {/* Price Range */}
      <div>
        <h3 className="font-medium mb-3 text-sm sm:text-base dark:text-white">
          Ценови диапазон: €{priceRange[0]} – €{priceRange[1]}
        </h3>

        <Slider
          min={0}
          max={100}
          step={1}
          value={innerSliderValue}
          onValueChange={(value: [number, number]) =>
            setInnerSliderValue(value)
          }
          onValueCommit={(value: [number, number]) => onPriceRangeChange(value)}
          className="mt-2"
        />
      </div>
    </div>
  );
}

