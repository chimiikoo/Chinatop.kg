import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

export function ThemeSwitcher() {
  const { theme, toggleTheme, switchable } = useTheme();

  if (!switchable || !toggleTheme) return null;

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="w-8 h-8 md:w-10 md:h-10 rounded-full transition-all duration-300"
      title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4 md:h-5 md:w-5 text-gray-700" />
      ) : (
        <Sun className="h-4 w-4 md:h-5 md:w-5 text-yellow-400" />
      )}
    </Button>
  );
}
