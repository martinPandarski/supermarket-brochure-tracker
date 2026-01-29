import { Search } from "lucide-react";
import { Input } from "./ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 sm:size-5 text-gray-400 dark:text-gray-500" />
      <Input
        type="text"
        placeholder="Search for products..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 sm:pl-10 h-12 text-sm sm:text-base dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
      />
    </div>
  );
}