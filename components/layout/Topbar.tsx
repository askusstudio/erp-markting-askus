"use client";
import { Bell, Search, User } from "lucide-react";
export default function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md">
      {" "}
      <div className="flex items-center gap-4 flex-1">
        {" "}
        <div className="relative w-full max-w-md hidden md:block">
          {" "}
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />{" "}
          <input
            type="text"
            placeholder="Search clients, invoices..."
            className="w-full rounded-full border border-slate-200 bg-[#fdfbf7] py-2 pl-10 pr-4 text-sm focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-400"
          />{" "}
        </div>{" "}
      </div>{" "}
      <div className="flex items-center gap-4">
        {" "}
        <button className="relative rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100">
          {" "}
          <Bell className="h-5 w-5" />{" "}
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
            {" "}
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>{" "}
            <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500"></span>{" "}
          </span>{" "}
        </button>{" "}
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-zinc-200">
          {" "}
          <User className="h-5 w-5" />{" "}
        </button>{" "}
      </div>{" "}
    </header>
  );
}
