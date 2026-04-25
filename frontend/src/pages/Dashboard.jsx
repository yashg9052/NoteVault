import { useState, useEffect } from "react";
import { Plus, Menu } from "lucide-react";
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";
import NoteCard, { SkeletonCard } from "../components/NoteCard";
import Pagination from "../components/Pagination";
import NoteModal from "../components/NoteModal";
import TransferModal from "../components/TransferModal";
import NoteDetailModal from "../components/NoteDetailModal";
import ThemeToggle from "../components/ThemeToggle";
import MobileSidebar from "../components/MobileSideBar"
import Footer from "../components/Footer";
import api from "../api/axios";

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [refreshCategories, setRefreshCategories] = useState(0);

  const [noteModal, setNoteModal] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [transferModal, setTransferModal] = useState(false);
  const [transferNote, setTransferNote] = useState(null);

  // Detail modal state
  const [detailModal, setDetailModal] = useState(false);
  const [detailNote, setDetailNote] = useState(null);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 6 };
      if (search) params.search = search;
      if (category) params.category = category;

      const res = await api.get("/notes", { params });
      setNotes(res.data.notes);
      setTotalPages(res.data.pagination.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [search, category, page]);

  // View (detail)
  const handleView = (note) => {
    setDetailNote(note);
    setDetailModal(true);
  };
  const handleDetailClose = () => {
    setDetailModal(false);
    setDetailNote(null);
  };

  const handleEdit = (note) => {
    setEditNote(note);
    setNoteModal(true);
  };
  const handleTransfer = (note) => {
    setTransferNote(note);
    setTransferModal(true);
  };

  const handleDelete = async (note) => {
    if (!window.confirm("Delete this note?")) return;
    await api.delete(`/notes/${note.id}`);
    fetchNotes();
    setRefreshCategories((p) => p + 1);
  };

  const handleModalClose = () => {
    setNoteModal(false);
    setEditNote(null);
  };
  const handleModalSave = () => {
    handleModalClose();
    fetchNotes();
    setRefreshCategories((p) => p + 1);
  };

  const handleTransferClose = () => {
    setTransferModal(false);
    setTransferNote(null);
  };
  const handleTransferSuccess = () => {
    handleTransferClose();
    fetchNotes();
    setRefreshCategories((p) => p + 1);
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-[#0b0f1e] transition-colors duration-300">
      {/* Sidebar — desktop only */}
      <div className="hidden md:flex">
        <Sidebar
          activeCategory={category}
          onCategoryChange={(c) => {
            setCategory(c);
            setPage(1);
          }}
          refreshTrigger={refreshCategories}
        />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <div className="flex items-center gap-3 px-4 md:px-6 py-4 border-b border-gray-300 dark:border-white/10 bg-white dark:bg-[#0b0f1e] sticky top-0 z-10">
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl border border-gray-300 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
          >
            <Menu size={20} />
          </button>

          <SearchBar
            onSearch={(v) => {
              setSearch(v);
              setPage(1);
            }}
          />
          <ThemeToggle />
          <button
            onClick={() => {
              setEditNote(null);
              setNoteModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white text-sm font-semibold shadow-lg shadow-purple-500/20 transition-all shrink-0"
          >
            <Plus size={17} />
            <span className="hidden sm:inline">New Note</span>
          </button>
        </div>

        {/* Notes Grid + Pagination wrapper */}
        <div className="p-4 md:p-6 h-[calc(100vh-73px)] overflow-y-auto">
          {/* Notes Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <div className="w-16 h-16 rounded-2xl bg-gray-200 dark:bg-white/5 flex items-center justify-center">
                <Plus size={28} className="text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                No notes yet
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Create your first note!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onView={handleView}
                  onEdit={handleEdit}
                  onTransfer={handleTransfer}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}

          <div className="flex-1" />
        </div>

        {/* Footer */}
        <Footer />
      </div>

      {/* Modals */}
      {noteModal && (
        <NoteModal
          note={editNote}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
      {transferModal && (
        <TransferModal
          note={transferNote}
          onClose={handleTransferClose}
          onSuccess={handleTransferSuccess}
        />
      )}
      {detailModal && (
        <NoteDetailModal
          note={detailNote}
          onClose={handleDetailClose}
          onEdit={handleEdit}
          onTransfer={handleTransfer}
          onDelete={handleDelete}
        />
      )}

      {/* Mobile Sidebar */}
      <MobileSidebar
        open={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        activeCategory={category}
        onCategoryChange={(c) => {
          setCategory(c);
          setPage(1);
        }}
        refreshTrigger={refreshCategories}
      />
    </div>
  );
}