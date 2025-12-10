"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";

export default function SavedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const startNewChat = () => {
    router.push("/");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const shellPadding = isSidebarOpen ? "md:pl-[300px]" : "md:pl-0";

  return (
    <div className={`flex flex-1 min-h-screen bg-gradient-to-br from-[#050C1D] via-[#0B1B38] to-[#0E2F5A] text-slate-50 overflow-hidden ${shellPadding}`}>
      <Sidebar
        startNewChat={startNewChat}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      {isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-[2px] md:hidden"
          aria-label="Menüyü kapat"
        />
      )}
      <div className="flex-1">{children}</div>
    </div>
  );
}
