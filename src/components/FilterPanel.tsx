import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import Select, {type StylesConfig} from "react-select";
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
        : [{value: 'all', label: 'Всички категории'}],
    [categories],
  );


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
            styles={getSelectStyles(isDark)}
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




const getSelectStyles = (isDark: boolean): StylesConfig => ({
  control: (base, state) => ({
    ...base,
    minHeight: 36,
    backgroundColor: isDark ? "#1f2937" : "#ffffff",
    borderColor: state.isFocused
      ? "#3b82f6"
      : isDark
      ? "#374151"
      : "#d1d5db",
    boxShadow: state.isFocused
      ? "0 0 0 2px rgba(59,130,246,0.4)"
      : "none",
    "&:hover": {
      borderColor: "#3b82f6",
    },
  }),

  valueContainer: (base) => ({
    ...base,
    padding: "0 8px",
  }),

  singleValue: (base) => ({
    ...base,
    color: isDark ? "#f9fafb" : "#111827",
  }),

  placeholder: (base) => ({
    ...base,
    color: isDark ? "#9ca3af" : "#6b7280",
  }),

  indicatorsContainer: (base) => ({
    ...base,
    color: isDark ? "#9ca3af" : "#6b7280",
  }),

  dropdownIndicator: (base) => ({
    ...base,
    padding: 4,
    "&:hover": {
      color: isDark ? "#e5e7eb" : "#111827",
    },
  }),

  menuPortal: (base) => ({
    ...base,
    zIndex: 50,
  }),

  menu: (base) => ({
    ...base,
    backgroundColor: isDark ? "#1f2937" : "#ffffff",
    border: `1px solid ${isDark ? "#374151" : "#d1d5db"}`,
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
    marginTop: 4,
  }),

  menuList: (base) => ({
    ...base,
    maxHeight: 240,
    overflowY: "auto",
    padding: 4,
  }),

  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused
      ? isDark
        ? "#374151"
        : "#e5e7eb"
      : "transparent",
    color: isDark ? "#f9fafb" : "#111827",
    cursor: "pointer",
    padding: "6px 8px",
  }),
});
