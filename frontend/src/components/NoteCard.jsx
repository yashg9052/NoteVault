import { Calendar, Pencil, ArrowLeftRight, Trash2 } from "lucide-react";

const dotColors = [
  "bg-green-500/20 text-green-400 border-green-500/30",
  "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "bg-pink-500/20 text-pink-400 border-pink-500/30",
  "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "bg-teal-500/20 text-teal-400 border-teal-500/30",
  "bg-red-500/20 text-red-400 border-red-500/30",
];

const getCategoryStyle = (category = "") =>
  dotColors[
    [...category.toUpperCase()].reduce((acc, c) => acc + c.charCodeAt(0), 0) % dotColors.length
  ];

const SkeletonCard = () => (
  <div className="rounded-2xl border border-gray-300 dark:border-white/10 bg-white dark:bg-[#1a2236] p-5 animate-pulse space-y-3">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10" />
      <div className="h-4 w-32 rounded bg-gray-200 dark:bg-white/10" />
    </div>
    <div className="h-3 w-full rounded bg-gray-200 dark:bg-white/10" />
    <div className="h-3 w-4/5 rounded bg-gray-200 dark:bg-white/10" />
    <div className="h-3 w-3/5 rounded bg-gray-200 dark:bg-white/10" />
    <div className="flex justify-between items-center pt-2">
      <div className="h-3 w-24 rounded bg-gray-200 dark:bg-white/10" />
      <div className="flex gap-2">
        <div className="w-7 h-7 rounded bg-gray-200 dark:bg-white/10" />
        <div className="w-7 h-7 rounded bg-gray-200 dark:bg-white/10" />
        <div className="w-7 h-7 rounded bg-gray-200 dark:bg-white/10" />
      </div>
    </div>
  </div>
);

export { SkeletonCard };

export default function NoteCard({ note, onView, onEdit, onTransfer, onDelete }) {
  const categoryClass = getCategoryStyle(note.category);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });

  return (
    <div
      onClick={() => onView(note)}
      className="group rounded-2xl border border-gray-300 dark:border-white/10 bg-white dark:bg-[#1a2236] p-5 flex flex-col gap-3 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${categoryClass}`}>
          {note.category || "OTHER"}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-gray-900 dark:text-white font-bold text-lg leading-snug line-clamp-1">
        {note.title}
      </h3>

      {/* Content preview */}
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2 flex-1">
        {note.content}
      </p>

      {/* Bottom row — date + actions */}
      <div className="flex items-center justify-between pt-1 border-t border-gray-200 dark:border-white/5 mt-auto">
        <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs">
          <Calendar size={13} />
          <span>{formatDate(note.createdAt)}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(note); }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
            title="Edit note"
          >
            <Pencil size={14} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); onTransfer(note); }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
            title="Transfer note"
          >
            <ArrowLeftRight size={14} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); onDelete(note); }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
            title="Delete note"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}