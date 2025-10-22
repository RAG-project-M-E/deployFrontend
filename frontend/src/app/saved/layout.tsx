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
  const [activePage, setActivePage] = useState("saved");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const startNewChat = () => {
    router.push("/");
  };

  const handleSetActivePage = (page: string) => {
    if (page === "chat") {
      router.push("/");
    } else if (page === "saved") {
      router.push("/saved");
    }
    setActivePage(page);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-1 min-h-screen bg-[#F9F8F6] overflow-hidden">
      <Sidebar
        setActivePage={handleSetActivePage}
        activePage={activePage}
        startNewChat={startNewChat}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <div className="flex-1">{children}</div>
    </div>
  );
}
