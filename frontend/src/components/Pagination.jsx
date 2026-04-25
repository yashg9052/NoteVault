import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, onPageChange }) {
  return (
    <div className="flex items-center justify-center gap-4 py-5">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 text-sm text-gray-600 dark:text-gray-400 disabled:opacity-40 disabled:cursor-not-allowed hover:border-purple-500 transition-all"
      >
        <ChevronLeft size={16} /> Previous
      </button>

      <span className="text-sm text-gray-600 dark:text-gray-400">
        Page <span className="text-gray-900 dark:text-white font-bold">{page}</span> of{" "}
        <span className="text-gray-900 dark:text-white font-bold">{totalPages}</span>
      </span>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-transparent bg-gradient-to-r from-purple-600 to-purple-500 text-white text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:from-purple-500 hover:to-purple-400 transition-all"
      >
        Next <ChevronRight size={16} />
      </button>
    </div>
  );
}