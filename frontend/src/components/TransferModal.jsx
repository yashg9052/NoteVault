import { useState } from "react";
import { X, ArrowLeftRight, Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import api from "../api/axios";

const categoryStyles = {
  Personal: "bg-green-500/20 text-green-400 border-green-500/30",
  Work:     "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Study:    "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Other:    "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

export default function TransferModal({ note, onClose, onSuccess }) {
  const [email, setEmail]       = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);

  const validate = () => {
    if (!email.trim()) return "Recipient email is required";
    if (!/\S+@\S+\.\S+/.test(email)) return "Enter a valid email address";
    return "";
  };

  const handleTransfer = async () => {
    const err = validate();
    if (err) return setError(err);
    setLoading(true);
    setError("");
    try {
      await api.post(`/notes/${note.id}/transfer`, { email });
      setSuccess(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Transfer failed");
    } finally {
      setLoading(false);
    }
  };

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const categoryClass = categoryStyles[note?.category] || categoryStyles.Other;

  return (
    <div
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
    >
      <div className="w-full max-w-md rounded-2xl border border-gray-300 dark:border-white/10 bg-white dark:bg-[#141929] shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-300 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center">
              <ArrowLeftRight size={16} className="text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-gray-900 dark:text-white font-bold text-base">
                Transfer Note
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-xs">Transfer ownership to another user</p>
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
        <div className="px-6 py-5 space-y-4">

          {success ? (
            /* Success State */
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-500/10 flex items-center justify-center">
                <CheckCircle size={36} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-gray-900 dark:text-white font-bold text-lg">
                  Transfer Successful!
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  Note successfully transferred to{" "}
                  <span className="text-purple-600 dark:text-purple-400 font-medium">{email}</span>
                </p>
              </div>
              <button
                onClick={onSuccess}
                className="mt-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white text-sm font-semibold hover:from-purple-500 hover:to-purple-400 transition-all"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              {/* Note Preview */}
              <div className="rounded-xl border border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-white/5 p-4 space-y-2">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${categoryClass}`}>
                  {note?.category || "Other"}
                </span>
                <p className="text-gray-900 dark:text-white font-semibold text-sm mt-1">
                  {note?.title}
                </p>
              </div>

              {/* Warning */}
              <div className="flex items-start gap-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/20 px-4 py-3">
                <AlertTriangle size={16} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-amber-700 dark:text-amber-300 text-xs leading-relaxed">
                  Once transferred, you will permanently lose access to this note.
                </p>
              </div>

              {/* Email Input */}
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-white mb-1 block">
                  Recipient Email
                </label>
                <input
                  type="email"
                  placeholder="Enter recipient's email address"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  className={`w-full rounded-xl border px-4 py-3 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none text-sm transition-all
                    ${error ? "border-red-500" : "border-gray-300 dark:border-white/10 focus:border-amber-500"}`}
                />
                {error && <p className="text-red-600 dark:text-red-400 text-xs mt-1">{error}</p>}
              </div>
            </>
          )}
        </div>

        {/* Footer — hidden on success */}
        {!success && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-300 dark:border-white/10">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-300 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm font-medium transition-all hover:bg-gray-100 dark:hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              onClick={handleTransfer}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-sm font-semibold shadow-lg shadow-amber-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 size={15} className="animate-spin" />}
              {loading ? "Transferring..." : "Transfer"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}