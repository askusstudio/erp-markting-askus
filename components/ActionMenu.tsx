import { useState, useRef, useEffect } from "react";
import { MoreVertical, Pencil, Trash2, LucideIcon } from "lucide-react";
import { createPortal } from "react-dom";

interface ActionMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  icon?: LucideIcon;
}

export default function ActionMenu({ onEdit, onDelete, icon: Icon = MoreVertical }: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [coords, setCoords] = useState({ top: 0, right: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    function handleScroll() {
      setIsOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      });
    }
  }, [isOpen]);

  const menu = isOpen ? (
    <div 
      ref={menuRef}
      className="fixed mt-1 w-32 rounded-lg border border-slate-200 bg-white shadow-lg z-[9999] overflow-hidden text-left"
      style={{ top: coords.top, right: coords.right }}
    >
      <button 
        onClick={(e) => { e.stopPropagation(); setIsOpen(false); onEdit(); }} 
        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
      >
        <Pencil className="h-4 w-4" /> Edit
      </button>
      <button 
        onClick={(e) => { e.stopPropagation(); setIsOpen(false); onDelete(); }} 
        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
      >
        <Trash2 className="h-4 w-4" /> Delete
      </button>
    </div>
  ) : null;

  return (
    <div className="relative inline-block">
      <button 
        ref={buttonRef}
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-500"
      >
        <Icon className="h-4 w-4" />
      </button>
      {mounted && createPortal(menu, document.body)}
    </div>
  );
}
