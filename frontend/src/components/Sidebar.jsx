import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FileText, ArrowLeftRight, LogOut, LayoutGrid,
  ChevronDown, User, Mail, Calendar
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import api from "../api/axios";

const categoryMeta = {
  Personal: { color: "text-green-400"  },
  Work:     { color: "text-blue-400"   },
  Study:    { color: "text-yellow-400" },
  Other:    { color: "text-gray-400"   },
};

export default function Sidebar({ activeCategory, onCategoryChange, refreshTrigger }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);

  const [profileOpen, setProfileOpen] = useState(false);
  const [categories, setCategories]   = useState([]);
  const [total, setTotal]             = useState(0);

  const firstName = user?.name?.split(" ")[0];
  const initials  = user?.name
    ?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/notes/categories");
      setCategories(res.data.categories);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchCategories(); }, [activeCategory, refreshTrigger]);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const handleCategoryChange = (cat) => {
    if (location.pathname !== "/") navigate("/");
    onCategoryChange(cat);
    fetchCategories();
  };

  const formatJoined = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "long", year: "numeric",
    });

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 flex flex-col border-r border-gray-300 dark:border-white/10 bg-white dark:bg-[#111827] transition-colors duration-300">

      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow">
          <FileText size={18} className="text-white" />
        </div>
        <span className="text-gray-900 dark:text-white font-bold text-lg">NoteVault</span>
      </div>

      {/* Greeting */}
      <div className="px-5 pt-4 pb-1">
        <p className="text-gray-900 dark:text-white font-bold text-base">
          Welcome back, <span className="text-purple-500">{firstName}</span>
        </p>
      </div>

      {/* Profile Trigger */}
      <div className="relative px-3 py-3 border-b border-gray-300 dark:border-white/10" ref={profileRef}>
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="w-full flex items-center border border-purple-500 gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
        >
          <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
            {initials}
          </div>
          <p className="text-gray-900 dark:text-white text-sm font-semibold truncate">Account</p>
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
          />
        </button>

        {profileOpen && (
          <div className="absolute left-3 right-3 top-full mt-1 z-50 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a2236] shadow-2xl overflow-hidden">

            <div className="bg-gradient-to-br from-purple-600 to-purple-800 px-4 py-4 flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white text-xl font-bold border-2 border-white/30">
                {initials}
              </div>
              <div className="text-center">
                <p className="text-white font-bold text-sm">{user?.name}</p>
                <p className="text-purple-200 text-xs">{user?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 divide-x divide-gray-200 dark:divide-white/10 border-b border-gray-200 dark:border-white/10">
              <div className="flex flex-col items-center py-3">
                <p className="text-gray-900 dark:text-white font-bold text-lg">{total}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">Total Notes</p>
              </div>
              <div className="flex flex-col items-center py-3">
                <p className="text-gray-900 dark:text-white font-bold text-lg">{categories.length}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">Categories</p>
              </div>
            </div>

            <div className="px-4 py-3 space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs text-gray-500 dark:text-gray-400">
                <User size={13} className="text-purple-400 shrink-0" />
                <span className="truncate">{user?.name}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-gray-500 dark:text-gray-400">
                <Mail size={13} className="text-purple-400 shrink-0" />
                <span className="truncate">{user?.email}</span>
              </div>
              {user?.createdAt && (
                <div className="flex items-center gap-2.5 text-xs text-gray-500 dark:text-gray-400">
                  <Calendar size={13} className="text-purple-400 shrink-0" />
                  <span>Joined {formatJoined(user.createdAt)}</span>
                </div>
              )}
            </div>

            <div className="px-4 pb-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold text-red-400 border border-red-400/20 hover:bg-red-500/10 transition-all"
              >
                <LogOut size={13} /> Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Nav Links */}
      <nav className="px-3 pt-4 space-y-1">
        <button
          onClick={() => navigate("/")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
            ${location.pathname === "/"
              ? "bg-purple-600/20 text-purple-400 border border-purple-500/30"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
            }`}
        >
          <FileText size={17} /> All Notes
        </button>

        <button
          onClick={() => navigate("/transfers")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
            ${location.pathname === "/transfers"
              ? "bg-purple-600/20 text-purple-400 border border-purple-500/30"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
            }`}
        >
          <ArrowLeftRight size={17} /> Transfers
        </button>
      </nav>

      {/* Categories */}
      <div className="px-3 pt-6 flex-1 overflow-y-auto">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-3 mb-2">
          Categories
        </p>
        <div className="space-y-1">
          <button
            onClick={() => handleCategoryChange("")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
              ${location.pathname === "/" && activeCategory === ""
                ? "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
              }`}
          >
            <LayoutGrid size={16} className="text-purple-400 shrink-0" />
            <span className="flex-1 text-left">All</span>
            <span className="text-xs bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">
              {total}
            </span>
          </button>

          {categories.length === 0 ? (
            <p className="text-xs text-gray-400 px-3 py-2 italic">No notes yet</p>
          ) : (
            categories.map(({ name, count }) => {
              const meta = categoryMeta[name] || { color: "text-gray-400" };
              return (
                <button
                  key={name}
                  onClick={() => handleCategoryChange(name)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                    ${location.pathname === "/" && activeCategory === name
                      ? "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                    }`}
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${meta.color.replace("text-", "bg-")}`} />
                  <span className="flex-1 text-left">{name}</span>
                  <span className="text-xs bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">
                    {count}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </aside>
  );
}