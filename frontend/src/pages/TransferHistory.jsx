import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftRight, ArrowLeft, ArrowRight } from "lucide-react";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

const SkeletonRow = () => (
  <div className="rounded-2xl border border-gray-300 dark:border-white/10 bg-white dark:bg-[#1a2236] p-5 animate-pulse space-y-3">
    <div className="flex justify-between">
      <div className="h-4 w-40 rounded bg-gray-200 dark:bg-white/10" />
      <div className="h-5 w-16 rounded-full bg-gray-200 dark:bg-white/10" />
    </div>
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10" />
      <div className="h-3 w-32 rounded bg-gray-200 dark:bg-white/10" />
      <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10" />
      <div className="h-3 w-32 rounded bg-gray-200 dark:bg-white/10" />
    </div>
    <div className="h-3 w-24 rounded bg-gray-200 dark:bg-white/10" />
  </div>
);

const Avatar = ({ name }) => {
  const initials = name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  return (
    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
      {initials}
    </div>
  );
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  }) + " · " +
  new Date(d).toLocaleTimeString("en-US", {
    hour: "numeric", minute: "2-digit",
  });

export default function TransferHistory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState("All"); // All | Sent | Received

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await api.get("/notes/transfers");
        setTransfers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = transfers.filter((t) => {
    if (filter === "Sent")     return t.fromUserId === user?.id;
    if (filter === "Received") return t.toUserId   === user?.id;
    return true;
  });

  return (
    <div className="flex min-h-screen bg-white dark:bg-[#0b0f1e] transition-colors duration-300">

      {/* Sidebar */}
      <div className="hidden md:flex">
        <Sidebar activeCategory="" onCategoryChange={() => {}} categoryCounts={{}} />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col">

        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-gray-300 dark:border-white/10 bg-white dark:bg-[#0b0f1e] sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all md:hidden"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex items-center gap-2">
              <ArrowLeftRight size={20} className="text-purple-500" />
              <h1 className="text-gray-900 dark:text-white font-bold text-lg">
                Transfer History
              </h1>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Content */}
        <div className="flex-1 px-4 md:px-8 py-6 max-w-3xl w-full mx-auto">

          {/* Subtitle */}
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-5">
            All notes you have sent or received
          </p>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6">
            {["All", "Sent", "Received"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all
                  ${filter === f
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                    : "border border-gray-300 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* List */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => <SkeletonRow key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-52 gap-3 text-gray-500 dark:text-gray-400">
              <div className="w-14 h-14 rounded-2xl bg-gray-200 dark:bg-white/5 flex items-center justify-center">
                <ArrowLeftRight size={24} className="text-gray-400 dark:text-gray-500" />
              </div>
              <p className="font-semibold text-gray-600 dark:text-gray-400">No transfers yet</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">Transfers will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((t) => {
                const isSent = t.fromUserId === user?.id;
                return (
                  <div
                    key={t.id}
                    className="rounded-2xl border border-gray-300 dark:border-white/10 bg-white dark:bg-[#1a2236] p-5 space-y-3 hover:border-purple-500/30 transition-all"
                  >
                    {/* Title + Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-gray-900 dark:text-white font-semibold text-sm">
                        {t.note?.title}
                      </p>
                      <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border
                        ${isSent
                          ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-300 dark:border-red-500/20"
                          : "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-300 dark:border-green-500/20"
                        }`}>
                        {isSent ? "Sent" : "Received"}
                      </span>
                    </div>

                    {/* From → To */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <Avatar name={t.fromUser?.name} />
                      <div className="min-w-0">
                        <p className="text-gray-900 dark:text-white text-xs font-semibold truncate">
                          {t.fromUser?.name}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-xs truncate">{t.fromUser?.email}</p>
                      </div>

                      <ArrowRight size={16} className="text-purple-500 shrink-0 mx-1" />

                      <Avatar name={t.toUser?.name} />
                      <div className="min-w-0">
                        <p className="text-gray-900 dark:text-white text-xs font-semibold truncate">
                          {t.toUser?.name}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-xs truncate">{t.toUser?.email}</p>
                      </div>
                    </div>

                    {/* Date */}
                    <p className="text-gray-500 dark:text-gray-500 text-xs">{formatDate(t.createdAt)}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}