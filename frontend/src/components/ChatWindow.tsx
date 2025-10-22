"use client";
import { useState, useRef, useEffect } from "react";
import { Send, User, Bot, Loader2, Menu } from "lucide-react";
import { monitor } from "@/lib/monitoring";
import { useWebSocket } from "@/hooks/useWebSocket";
import wsClient from "@/api/socket";
import ReactMarkdown from "react-markdown";

interface Message {
  sender: "user" | "bot";
  text: string;
  time: string;
}

interface ChatWindowProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const ChatWindow = ({ toggleSidebar, isSidebarOpen }: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // WebSocket connection
  const { sendMessage: wsSendMessage, isConnected } = useWebSocket();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Track page view
  useEffect(() => {
    monitor.trackPageView("/chat");
  }, []);

  // Handle incoming WebSocket messages - Subscribe directly to avoid React batching
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleMessage = (data: any) => {
      // Extract message text from various possible formats
      const messageText = data.message || data.response || data.text || JSON.stringify(data);
      const trimmedText = messageText.trim();

      // Check if this is a status message that should be filtered out
      const isStatusMessage =
        trimmedText.startsWith("⚠️") ||  // Warning
        trimmedText.startsWith("⏱️") ||  // Timer
        trimmedText.startsWith("🤖") ||  // Robot
        trimmedText.startsWith("✅") ||  // Checkmark
        trimmedText.startsWith("🔄") ||  // Reload
        trimmedText.startsWith("⏳") ||  // Hourglass
        trimmedText.startsWith("📊") ||  // Chart
        trimmedText.includes("belge bulundu") || // Document count
        trimmedText.includes("Yanıt tamamlandı") || // Completion
        trimmedText.includes("Yanıt süresi"); // Response time

      // Only add substantial final responses (not status messages)
      if (!isStatusMessage && trimmedText.length > 10) {
        const botMsg: Message = {
          sender: "bot",
          text: messageText,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        setMessages((prev) => [...prev, botMsg]);
        setIsLoading(false);
        inputRef.current?.focus();
      }

      // Stop loading when response is complete
      if (trimmedText.includes("✅ Yanıt tamamlandı") || trimmedText.includes("Yanıt tamamlandı")) {
        setIsLoading(false);
        inputRef.current?.focus();
      }
    };

    // Subscribe directly to WebSocket messages
    const unsubscribe = wsClient.onMessage(handleMessage);

    // Cleanup on unmount
    return () => {
      unsubscribe();
    };
  }, []); // Empty dependency array - only run once on mount

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    // First message triggers the chat screen animation
    if (messages.length === 0) {
      setShowChat(true);
    }

    const endTimer = monitor.startTimer("send-message");
    monitor.trackUserAction("send-message", { messageLength: input.length });

    const userMsg: Message = {
      sender: "user",
      text: input,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // Send message via WebSocket
      const success = wsSendMessage(userMsg.text);

      if (!success) {
        monitor.warn("WebSocket not connected, message not sent");
        throw new Error("WebSocket not connected");
      }

      monitor.info("Message sent via WebSocket", { text: userMsg.text });
      endTimer();
    } catch (error) {
      monitor.error("Failed to send message", { error });

      // Show error message to user
      const errorMsg: Message = {
        sender: "bot",
        text: "Üzgünüm, mesajınız gönderilemedi. Lütfen bağlantınızı kontrol edin ve tekrar deneyin.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, errorMsg]);
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  // Welcome screen (before first message)
  if (!showChat && messages.length === 0) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-[#F9F8F6] to-[#FFF7E0]">
        {/* Header with menu button */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {!isSidebarOpen && (
              <button
                onClick={toggleSidebar}
                className="p-2 hover:bg-[#F9F8F6] rounded-lg transition-colors"
                aria-label="Menüyü aç"
              >
                <Menu className="text-[#0A1F44]" size={20} />
              </button>
            )}
            <div className="flex items-center gap-2">
              <span className="text-2xl" aria-hidden="true">⚖︎</span>
              <h2 className="text-[#0A1F44] font-playfair font-semibold text-lg">
                LexAI
              </h2>
            </div>
          </div>
        </header>

        {/* Welcome content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-32 animate-fade-in">
          <div className="max-w-2xl w-full text-center space-y-8">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-[#D4AF37] blur-3xl opacity-20 rounded-full"></div>
                <div className="relative bg-gradient-to-br from-[#0A1F44] to-[#1a3a6e] p-8 rounded-full shadow-2xl">
                  <span className="text-6xl text-[#D4AF37]" aria-hidden="true">⚖︎</span>
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-3">
              <h1 className="text-5xl font-playfair font-bold text-[#0A1F44] tracking-tight">
                LexAI&apos;a Hoş Geldiniz
              </h1>
              <p className="text-sm font-playfair italic text-[#D4AF37] tracking-wide mt-2">
                Lex est ratio summa
              </p>
              <p className="text-xl text-gray-600 max-w-xl mx-auto leading-relaxed">
                Türk hukuku konusunda size yardımcı olmak için tasarlanmış yapay zekâ asistanınız
              </p>
            </div>

            {/* Quick start cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
              {[
                { title: "Ceza Hukuku", icon: "⚖️" },
                { title: "Borçlar Hukuku", icon: "📋" },
                { title: "İş Hukuku", icon: "💼" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200 hover:border-[#D4AF37] hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <div className="text-sm font-medium text-[#0A1F44]">{item.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Input area at bottom */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 px-6 py-6">
          <div className="max-w-3xl mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="relative"
            >
              <label htmlFor="welcome-input" className="sr-only">
                Sorunuzu yazın
              </label>
              <input
                id="welcome-input"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Hukuki sorunuzu yazın..."
                disabled={isLoading}
                className="w-full border-2 border-[#D4AF37] rounded-full px-6 py-4 pr-14 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/70 text-gray-800 placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-lg"
                aria-label="Mesaj girişi"
                autoFocus
              />
              <button
                type="submit"
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#D4AF37] text-white rounded-full p-3 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:opacity-50 disabled:active:scale-100 shadow-lg"
                aria-label="Mesaj gönder"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Send size={20} />
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Chat interface
  return (
    <div className="flex flex-col h-screen bg-[#F9F8F6] animate-fade-in">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {!isSidebarOpen && (
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-[#F9F8F6] rounded-lg transition-colors"
              aria-label="Menüyü aç"
            >
              <Menu className="text-[#0A1F44]" size={20} />
            </button>
          )}
          <div className="flex items-center gap-2">
            <h2 className="text-[#0A1F44] font-playfair font-semibold text-lg">
              LexAI Hukuki Asistan
            </h2>
            <div
              className="flex items-center gap-1 text-sm text-gray-500"
              role="status"
              aria-label="Bağlantı durumu"
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  isConnected
                    ? "bg-green-500 animate-pulse"
                    : "bg-red-500"
                }`}
                aria-hidden="true"
              ></span>
              <span>{isConnected ? "Çevrimiçi" : "Bağlantı Kesildi"}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Messages area */}
      <main
        className="flex-1 overflow-y-auto p-8 space-y-5"
        role="log"
        aria-live="polite"
        aria-label="Sohbet mesajları"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            } animate-fade-in`}
            role="article"
            aria-label={`${msg.sender === "user" ? "Sizin mesajınız" : "LexAI yanıtı"}`}
          >
            <div className="flex items-start gap-3 max-w-lg">
              {msg.sender === "bot" && (
                <div
                  className="w-8 h-8 bg-[#FFF7E0] rounded-full flex items-center justify-center shadow-sm"
                  aria-hidden="true"
                >
                  <Bot className="text-[#D4AF37]" size={18} />
                </div>
              )}
              <div
                className={`rounded-xl px-4 py-3 shadow-sm ${
                  msg.sender === "user"
                    ? "bg-[#0A1F44] text-white"
                    : "bg-white text-gray-800"
                }`}
              >
                {msg.sender === "bot" ? (
                  <div className="prose prose-sm max-w-none leading-relaxed">
                    <ReactMarkdown
                      components={{
                        p: ({children}) => <p className="mb-2">{children}</p>,
                        strong: ({children}) => <strong className="font-semibold text-[#0A1F44]">{children}</strong>,
                        ol: ({children}) => <ol className="list-decimal list-inside space-y-2 my-2">{children}</ol>,
                        ul: ({children}) => <ul className="list-disc list-inside space-y-2 my-2">{children}</ul>,
                        li: ({children}) => <li className="ml-2">{children}</li>,
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="leading-relaxed">{msg.text}</p>
                )}
                <time
                  className="block text-xs mt-1 text-gray-400 text-right"
                  dateTime={msg.time}
                >
                  {msg.time}
                </time>
              </div>
              {msg.sender === "user" && (
                <div
                  className="w-8 h-8 bg-[#0A1F44]/90 rounded-full flex items-center justify-center shadow-sm"
                  aria-hidden="true"
                >
                  <User className="text-white" size={16} />
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-fade-in" role="status" aria-label="Yanıt bekleniyor">
            <div className="flex items-start gap-3 max-w-lg">
              <div className="w-8 h-8 bg-[#FFF7E0] rounded-full flex items-center justify-center shadow-sm">
                <Bot className="text-[#D4AF37]" size={18} />
              </div>
              <div className="bg-white rounded-xl px-4 py-3 shadow-sm">
                <Loader2 className="animate-spin text-[#D4AF37]" size={20} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input area */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="bg-white border-t border-gray-200 px-5 py-4 flex items-center gap-3"
      >
        <label htmlFor="chat-input" className="sr-only">
          Sorunuzu yazın
        </label>
        <input
          id="chat-input"
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Sorunuzu yazın..."
          disabled={isLoading}
          className="flex-1 border border-[#D4AF37] rounded-full px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/70 text-gray-800 placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Mesaj girişi"
        />
        <button
          type="submit"
          onClick={sendMessage}
          disabled={!input.trim() || isLoading}
          className="bg-[#D4AF37] text-white rounded-full p-3.5 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:opacity-50 disabled:active:scale-100"
          aria-label="Mesaj gönder"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Send size={18} />
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
