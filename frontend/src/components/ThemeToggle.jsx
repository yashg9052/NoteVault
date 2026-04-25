import { useTheme } from "../context/ThemeContext";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:scale-105 transition-all shadow"
    >
      {isDark ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}