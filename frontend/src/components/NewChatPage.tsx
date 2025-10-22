"use client";
import { MessageSquare } from "lucide-react";

interface NewChatProps {
  setActivePage: (page: string) => void;
}

export default function NewChatPage({ setActivePage }: NewChatProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center bg-[#F9F8F6]">
      <div className="flex flex-col items-center space-y-4">
        <div className="p-6 bg-white rounded-full shadow-md">
          <MessageSquare className="text-[#D4AF37]" size={36} />
        </div>
        <h1 className="text-3xl font-playfair font-bold text-[#0A1F44]">
          Yeni Sohbet Başlat
        </h1>
        <p className="text-gray-600 max-w-md text-sm">
          Yeni bir hukuki sorunuz mu var? LexAI sizin için en uygun yanıtı
          getirebilir. Aşağıdaki butona tıklayarak yeni bir konuşma
          başlatabilirsiniz.
        </p>
        <button
          onClick={() => setActivePage("chat")}
          className="mt-4 px-5 py-2.5 bg-[#D4AF37] text-white rounded-full hover:opacity-90 active:scale-95 transition-all"
        >
          Sohbeti Başlat
        </button>
      </div>
    </div>
  );
}
