import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "../contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9 sm:h-10 sm:w-10"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="size-4 sm:size-5" />
      ) : (
        <Sun className="size-4 sm:size-5" />
      )}
    </Button>
  );
}
