import { Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => onSearch(value), 400);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="flex flex-col flex-1 max-w-lg">
      <div className="flex items-center gap-3 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2.5 shadow-sm">
        <Search size={18} className="text-gray-500 dark:text-gray-400 shrink-0" />
        <input
          type="text"
          placeholder="Search by title or content..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="bg-transparent outline-none text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 w-full text-sm"
        />
        {value && (
          <button
            onClick={() => { setValue(""); onSearch(""); }}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs shrink-0"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}