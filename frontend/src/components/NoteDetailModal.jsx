import { X, Calendar, Tag, FileText, Pencil, ArrowLeftRight, Trash2 } from "lucide-react";

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

export default function NoteDetailModal({ note, onClose, onEdit, onTransfer, onDelete }) {
  if (!note) return null;

  const categoryClass = getCategoryStyle(note.category);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const formatTime = (d) =>
    new Date(d).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleEdit = () => {
    onClose();
    onEdit(note);
  };

  const handleTransfer = () => {
    onClose();
    onTransfer(note);
  };

  const handleDelete = () => {
    onClose();
    onDelete(note);
  };

  return (
    <div
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
    >
      <div className="w-full max-w-lg rounded-2xl border border-gray-300 dark:border-white/10 bg-white dark:bg-[#141929] shadow-2xl animate-fade-in flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-300 dark:border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <FileText size={16} className="text-purple-400" />
            </div>
            <div>
              <h2 className="text-gray-900 dark:text-white font-bold text-base leading-tight">
                Note Details
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-xs">View full note</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">

          {/* Category Badge */}
          <div className="flex items-center gap-2">
            <Tag size={13} className="text-gray-400 dark:text-gray-500" />
            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${categoryClass}`}>
              {note.category || "OTHER"}
            </span>
          </div>

          {/* Title */}
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">
              Title
            </p>
            <h3
              className="text-gray-900 dark:text-white font-bold text-xl leading-snug break-words"
              style={{ overflowWrap: "anywhere" }}
            >
              {note.title}
            </h3>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-white/5" />

          {/* Content */}
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
              Content
            </p>
            <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-4 py-4 max-h-64 overflow-y-auto">
              <p
                className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap break-words"
                style={{ overflowWrap: "anywhere" }}
              >
                {note.content}
              </p>
            </div>
          </div>

          {/* Meta — date */}
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 pt-1">
            <Calendar size={13} />
            <span>
              Created on{" "}
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {formatDate(note.createdAt)}
              </span>
              {" "}at{" "}
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {formatTime(note.createdAt)}
              </span>
            </span>
          </div>
        </div>

        {/* Footer — actions */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-gray-300 dark:border-white/10 shrink-0">
          {/* Destructive actions on left */}
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-300 dark:border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 text-sm font-medium transition-all"
          >
            <Trash2 size={14} />
            <span className="hidden sm:inline">Delete</span>
          </button>

          {/* Right-side actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleTransfer}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 text-sm font-medium transition-all"
            >
              <ArrowLeftRight size={14} />
              <span className="hidden sm:inline">Transfer</span>
            </button>

            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white text-sm font-semibold shadow-lg shadow-purple-500/20 transition-all"
            >
              <Pencil size={14} />
              Edit Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}