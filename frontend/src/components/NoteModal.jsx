import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import api from "../api/axios";

export default function NoteModal({ note, onClose, onSave }) {
  const [form, setForm]     = useState({ title: "", content: "", category: "PERSONAL" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (note) {
      setForm({
        title:    note.title,
        content:  note.content,
        category: (note.category || "PERSONAL").toUpperCase(),
      });
    }
  }, [note]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim())   errs.title   = "Title is required";
    if (!form.content.trim()) errs.content = "Content is required";
    if (!form.category.trim()) errs.category = "Category is required";
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) return setErrors(errs);
    setLoading(true);
    setApiError("");
    try {
      const payload = {
        ...form,
        category: form.category.trim().toUpperCase(),
      };
      if (note) {
        await api.put(`/notes/${note.id}`, payload);
      } else {
        await api.post("/notes", payload);
      }
      onSave();
    } catch (err) {
      setApiError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
    >
      <div className="w-full max-w-lg rounded-2xl border border-gray-300 dark:border-white/10 bg-white dark:bg-[#141929] shadow-2xl animate-fade-in">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-300 dark:border-white/10">
          <h2 className="text-gray-900 dark:text-white font-bold text-lg">
            {note ? "Edit Note" : "Create Note"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">

          {/* API Error */}
          {apiError && (
            <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-500/10 border border-red-300 dark:border-red-500/20 rounded-xl px-4 py-3">
              {apiError}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-white mb-1 block">
              Title
            </label>
            <input
              type="text"
              placeholder="Note title..."
              value={form.title}
              onChange={(e) => { setForm({ ...form, title: e.target.value }); setErrors({ ...errors, title: "" }); }}
              className={`w-full rounded-xl border px-4 py-3 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none text-sm transition-all
                ${errors.title ? "border-red-500" : "border-gray-300 dark:border-white/10 focus:border-purple-500"}`}
            />
            {errors.title && <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-white mb-1 block">
              Category
            </label>
            <input
              type="text"
              placeholder="e.g. PERSONAL, WORK, GYM..."
              value={form.category}
              onChange={(e) => { setForm({ ...form, category: e.target.value.toUpperCase() }); setErrors({ ...errors, category: "" }); }}
              className={`w-full rounded-xl border px-4 py-3 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none text-sm transition-all
                ${errors.category ? "border-red-500" : "border-gray-300 dark:border-white/10 focus:border-purple-500"}`}
            />
            {errors.category && <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errors.category}</p>}
          </div>

          {/* Content */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-white mb-1 block">
              Content
            </label>
            <textarea
              rows={6}
              placeholder="Write your note here..."
              value={form.content}
              onChange={(e) => { setForm({ ...form, content: e.target.value }); setErrors({ ...errors, content: "" }); }}
              className={`w-full rounded-xl border px-4 py-3 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none text-sm resize-none transition-all
                ${errors.content ? "border-red-500" : "border-gray-300 dark:border-white/10 focus:border-purple-500"}`}
            />
            <div className="flex items-center justify-between mt-1">
              {errors.content
                ? <p className="text-red-600 dark:text-red-400 text-xs">{errors.content}</p>
                : <span />
              }
              <p className="text-gray-500 dark:text-gray-400 text-xs ml-auto">{form.content.length} characters</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-300 dark:border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-300 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm font-medium transition-all hover:bg-gray-100 dark:hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white text-sm font-semibold shadow-lg shadow-purple-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            {loading ? "Saving..." : "Save Note"}
          </button>
        </div>
      </div>
    </div>
  );
}