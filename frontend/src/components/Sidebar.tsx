"use client";
import { Home, MessageSquarePlus, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarProps {
  setActivePage: (page: string) => void;
  activePage: string;
  startNewChat: () => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ setActivePage, activePage, startNewChat, isOpen, toggleSidebar }: SidebarProps) => {
  const items = [
    { icon: Home, label: "Ana Sayfa", onClick: () => setActivePage("chat"), page: "chat", disabled: false },
    {
      icon: MessageSquarePlus,
      label: "Yeni Sohbet",
      onClick: () => startNewChat(),
      page: "new",
      disabled: false,
    },
    {
      icon: BookOpen,
      label: "Kaydedilen Cevaplar",
      onClick: () => setActivePage("saved"),
      page: "saved",
      disabled: true, // Deactivated
    },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-gray-200 flex flex-col justify-between transition-all duration-300 ease-in-out ${
          isOpen ? "w-64" : "w-0"
        } overflow-hidden`}
        role="complementary"
        aria-label="Ana navigasyon"
      >
        <div>
          <div className="flex items-center gap-2 px-6 py-6 border-b border-gray-100 min-w-[256px]">
            <span className="text-3xl text-[#0A1F44]" aria-hidden="true">⚖︎</span>
            <h1 className="text-[#0A1F44] font-playfair font-bold text-2xl whitespace-nowrap">
              LexAI
            </h1>
          </div>

          <nav className="flex flex-col mt-4 min-w-[256px]" aria-label="Ana menü">
            {items.map(({ icon: Icon, label, onClick, page, disabled }) => {
              const isActive = activePage === page;
              return (
                <button
                  key={label}
                  onClick={disabled ? undefined : onClick}
                  disabled={disabled}
                  className={`flex items-center gap-3 px-6 py-3 text-[15px] font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-[#F9F8F6] text-[#0A1F44] border-r-4 border-[#D4AF37]"
                      : disabled
                      ? "text-gray-400 cursor-not-allowed opacity-50"
                      : "text-gray-700 hover:bg-[#F9F8F6] hover:text-[#0A1F44]"
                  }`}
                  aria-label={label}
                  aria-current={isActive ? "page" : undefined}
                  aria-disabled={disabled}
                >
                  <Icon size={18} aria-hidden="true" />
                  {label}
                  {disabled && (
                    <span className="ml-auto text-[10px] bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
                      Yakında
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <footer className="p-4 text-xs text-gray-400 text-center min-w-[256px]">
          <p className="font-playfair italic text-[#D4AF37] mb-1">Lex est ratio summa</p>
          <p>© 2025 LexAI Hukuki Asistan</p>
        </footer>
      </aside>

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-6 z-50 bg-white border border-gray-200 rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 ${
          isOpen ? "left-[248px]" : "left-4"
        }`}
        aria-label={isOpen ? "Kenar çubuğunu gizle" : "Kenar çubuğunu göster"}
      >
        {isOpen ? (
          <ChevronLeft className="text-[#0A1F44]" size={20} />
        ) : (
          <ChevronRight className="text-[#0A1F44]" size={20} />
        )}
      </button>
    </>
  );
};

export default Sidebar;
