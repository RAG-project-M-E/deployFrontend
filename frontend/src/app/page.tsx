"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";

export default function Home() {
  const [chatSession, setChatSession] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const startNewChat = () => {
    setChatSession((prev) => prev + 1);
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
      <main className="flex-1 transition-all duration-300">
        <ChatWindow
          key={chatSession}
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />
      </main>
    </div>
  );
}
