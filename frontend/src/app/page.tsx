"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";
import SavedPage from "@/components/SavedPage";

export default function Home() {
  const [activePage, setActivePage] = useState("chat");
  const [chatSession, setChatSession] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const startNewChat = () => {
    setChatSession((prev) => prev + 1);
    setActivePage("chat");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-1 min-h-screen bg-[#F9F8F6] overflow-hidden">
      <Sidebar
        setActivePage={setActivePage}
        activePage={activePage}
        startNewChat={startNewChat}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <main className="flex-1 bg-[#F9F8F6] transition-all duration-300">
        {activePage === "chat" && (
          <ChatWindow
            key={chatSession}
            toggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
          />
        )}
        {activePage === "saved" && (
          <SavedPage
            toggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
          />
        )}
      </main>
    </div>
  );
}
