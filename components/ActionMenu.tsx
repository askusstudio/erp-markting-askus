import { useState, useRef, useEffect } from "react";
import { MoreVertical, Pencil, Trash2, LucideIcon } from "lucide-react";

interface ActionMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  icon?: LucideIcon;
}

export default function ActionMenu({ onEdit, onDelete, icon: Icon = MoreVertical }: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-500"
      >
        <Icon className="h-4 w-4" />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-32 rounded-lg border border-slate-200 bg-white shadow-lg z-50 overflow-hidden text-left">
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
      )}
    </div>
  );
}
