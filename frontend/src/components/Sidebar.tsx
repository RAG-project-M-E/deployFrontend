"use client";
import { Home, MessageSquarePlus, ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarProps {
  startNewChat: () => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

/**
 * Fresh, responsive sidebar:
 * - Mobile: slides in/out; overlay handled by page.tsx.
 * - Desktop: collapses to a compact rail when closed, expands when open.
 * - Keeps a simple text monogram (no external logo).
 */
const Sidebar = ({ startNewChat, isOpen, toggleSidebar }: SidebarProps) => {
  const navItems = [
    { icon: Home, label: "Ana Sayfa", onClick: () => undefined, page: "chat" },
    { icon: MessageSquarePlus, label: "Yeni Sohbet", onClick: startNewChat, page: "new" },
  ];

  const baseWidth = "w-[260px] md:w-[280px]";
  const translateClass = isOpen ? "translate-x-0" : "-translate-x-full";

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 h-full bg-[#0C1A33]/70 backdrop-blur-xl border-r border-white/10 flex flex-col justify-between transition-all duration-300 ease-in-out ${baseWidth} ${translateClass} text-slate-100 shadow-[10px_0_40px_-30px_rgba(0,0,0,0.6)]`}
        role="complementary"
        aria-label="Ana navigasyon"
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3 px-4 md:px-5 py-5 border-b border-white/10">
            <div className="relative h-11 w-11 rounded-2xl bg-gradient-to-br from-[#2F5FA7] to-[#0E2F5A] p-[2px] shadow-lg shadow-black/30">
              <div className="relative h-full w-full rounded-[0.95rem] bg-[#050C1D] grid place-items-center text-white font-semibold tracking-tight">
                Lx
              </div>
            </div>
            <div className={`${isOpen ? "opacity-100" : "opacity-0 md:opacity-100"} transition-opacity duration-200`}>
              <h1 className="text-white font-playfair font-bold text-lg leading-tight tracking-wide">LexAI</h1>
              <p className="text-xs text-slate-300/80">Hukuki asistan</p>
            </div>
          </div>

          <nav className="flex flex-col gap-2 px-3 md:px-4" aria-label="Ana menü">
            {navItems.map(({ icon: Icon, label, onClick, page }) => {
              const isPrimary = page === "chat";
              return (
                <button
                  key={label}
                  onClick={onClick}
                  className={`group relative flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all ${
                    isPrimary
                      ? "bg-white/10 text-white border border-white/15 shadow-lg shadow-black/30"
                      : "text-slate-200 hover:bg-white/5 border border-transparent"
                  }`}
                  aria-current={isPrimary ? "page" : undefined}
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                    <Icon size={18} aria-hidden />
                  </span>
                  <span className={`${isOpen ? "opacity-100" : "opacity-0 md:opacity-100"} transition-opacity duration-200`}>
                    {label}
                  </span>
                  {isPrimary && (
                    <span
                      className="absolute right-3 h-2 w-2 rounded-full bg-emerald-400/90 shadow-[0_0_12px_rgba(16,185,129,0.7)]"
                      aria-hidden
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <footer className="px-4 md:px-5 py-5 text-xs text-slate-300/80 border-t border-white/10">
          <p className={`${isOpen ? "opacity-100" : "opacity-0 md:opacity-100"} transition-opacity duration-200`}>
            <span className="font-playfair italic text-[#D4AF37]">Lex est ratio summa</span>
            <br />
            © 2025 LexAI Hukuki Asistan
          </p>
        </footer>
      </aside>

      <button
        onClick={toggleSidebar}
        className={`fixed top-4 left-4 md:top-5 z-50 bg-[#0E1D35] border border-white/15 text-slate-100 rounded-full p-2 shadow-lg shadow-black/30 hover:shadow-xl hover:border-white/25 transition-all duration-300 hover:scale-110 ${
          isOpen ? "md:left-[300px]" : "md:left-5"
        }`}
        aria-label={isOpen ? "Menüyü gizle" : "Menüyü aç"}
        aria-expanded={isOpen}
      >
        {isOpen ? <ChevronLeft className="text-white" size={20} /> : <ChevronRight className="text-white" size={20} />}
      </button>
    </>
  );
};

export default Sidebar;
