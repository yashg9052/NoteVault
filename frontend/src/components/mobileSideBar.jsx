import { useEffect } from "react";
import Sidebar from "./Sidebar";

export default function MobileSidebar({ open, onClose, activeCategory, onCategoryChange, refreshTrigger }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      <div
        className={`fixed inset-y-0 left-0 z-50 md:hidden transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <Sidebar
          activeCategory={activeCategory}
          onCategoryChange={(c) => { onCategoryChange(c); onClose(); }}
          refreshTrigger={refreshTrigger}
        />
      </div>
    </>
  );
}