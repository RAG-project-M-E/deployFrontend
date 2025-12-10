"use client";
import { useEffect, useRef, useState } from "react";
import { Bot, Loader2, Menu, Send, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import wsClient from "@/api/socket";
import { useWebSocket } from "@/hooks/useWebSocket";
import { monitor } from "@/lib/monitoring";

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

  const { sendMessage: wsSendMessage, isConnected } = useWebSocket();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    monitor.trackPageView("/chat");
  }, []);

  useEffect(() => {
    type IncomingPayload = {
      message?: string;
      response?: string;
      text?: string;
      [key: string]: unknown;
    };

    const handleMessage = (data: IncomingPayload | string) => {
      const messageText =
        typeof data === "string"
          ? data
          : data.message || data.response || data.text || JSON.stringify(data);
      const trimmedText = String(messageText).trim();

      const statusMarkers = [
        "⚠️",
        "⏱️",
        "🤖",
        "✅",
        "🔄",
        "⌛",
        "📊",
        "belge bulundu",
        "Yanıt tamamlandı",
        "Yanıt süresi",
      ];

      const isStatusMessage = statusMarkers.some((marker) => trimmedText.includes(marker));

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

      if (trimmedText.includes("Yanıt tamamlandı")) {
        setIsLoading(false);
        inputRef.current?.focus();
      }
    };

    const unsubscribe = wsClient.onMessage(handleMessage);
    return () => {
      unsubscribe();
    };
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    if (messages.length === 0) setShowChat(true);

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
      const success = wsSendMessage(userMsg.text);
      if (!success) {
        monitor.warn("WebSocket not connected, message not sent");
        throw new Error("WebSocket not connected");
      }
      monitor.info("Message sent via WebSocket", { text: userMsg.text });
      endTimer();
    } catch (error) {
      monitor.error("Failed to send message", { error });
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

  if (!showChat && messages.length === 0) {
    return (
      <div className="relative flex flex-col h-screen bg-gradient-to-br from-[#050C1D] via-[#0B1B38] to-[#0E2F5A] text-slate-100 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 -top-32 h-72 w-72 rounded-full bg-[#1F4C8F]/30 blur-[120px]" />
          <div className="absolute right-0 top-20 h-64 w-64 rounded-full bg-[#123769]/40 blur-[110px]" />
          <div className="absolute bottom-10 left-12 h-48 w-48 rounded-full bg-[#0A89B7]/25 blur-[120px]" />
        </div>

        <header className="relative bg-white/5 backdrop-blur-lg border-b border-white/10 px-6 py-4 flex items-center justify-between shadow-lg shadow-black/20">
          <div className="flex items-center gap-3">
            {!isSidebarOpen && (
              <button
                onClick={toggleSidebar}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors border border-white/10"
                aria-label="Menüyü aç"
              >
                <Menu className="text-white" size={20} />
              </button>
            )}
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-[#2F5FA7] to-[#0E2F5A] p-[2px] shadow-lg shadow-black/30">
                <div className="relative h-full w-full rounded-[1rem] bg-[#050C1D] grid place-items-center text-white font-semibold tracking-tight">
                  Lx
                </div>
              </div>
              <div>
                <h2 className="text-xl font-playfair font-semibold leading-tight">LexAI</h2>
                <p className="text-xs text-slate-300/80">Yeni nesil hukuk asistanınız</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-100">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Hazır
            </span>
          </div>
        </header>

        <div className="relative flex-1 flex flex-col items-center justify-center px-6 pb-32 animate-fade-in">
          <div className="max-w-5xl w-full grid gap-10 lg:grid-cols-[1.2fr_1fr] items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-200">
                Hukuk odaklı yapay zeka
              </div>
              <h1 className="text-4xl sm:text-5xl font-playfair font-bold leading-[1.1] drop-shadow-lg">
                Yalnızca hukuk için eğitilmiş LexAI ile tanışın
              </h1>
              <p className="text-lg text-slate-200/80 leading-relaxed max-w-2xl">
                Karar destek, mevzuat yorumu ve dilekçe taslakları için güvenilir asistana hoş geldiniz.
                Sorularınızı dinler, kaynak sunar, size zaman kazandırır.
              </p>
              <div className="flex flex-wrap gap-3">
                {["Ceza Hukuku", "Borçlar Hukuku", "İdare Hukuku"].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 shadow-lg shadow-black/20"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-white/10 via-transparent to-[#2F5FA7]/20 blur-3xl" />
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#2F5FA7] to-[#0E2F5A] grid place-items-center text-white font-semibold">
                    L
                  </div>
                  <div>
                    <p className="text-sm text-slate-300">Kısa yoldan</p>
                    <p className="text-lg font-semibold text-white">Hemen başlayın</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    "Dava stratejisi için ilk bakış analizi yap",
                    "Son Yargıtay kararlarındaki eğilimleri özetle",
                    "Sözleşme taslağı için riskli maddeleri işaretle",
                  ].map((tip) => (
                    <div
                      key={tip}
                      className="flex items-start gap-3 rounded-2xl border border-white/10 bg-[#0B1B38]/40 px-4 py-3"
                    >
                      <span className="mt-1 h-2 w-2 rounded-full bg-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.65)]" />
                      <p className="text-sm text-slate-100">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-[#050C1D]/80 backdrop-blur-2xl border-t border-white/10 px-6 py-6">
          <div className="max-w-4xl mx-auto">
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
                className="w-full border border-white/15 bg-white/5 text-white rounded-full px-6 py-4 pr-16 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/70 placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_20px_60px_-35px_rgba(0,0,0,0.8)] text-lg"
                aria-label="Mesaj girişi"
                autoFocus
              />
              <button
                type="submit"
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-br from-[#D4AF37] to-[#b6881f] text-white rounded-full p-3 hover:opacity-95 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:opacity-50 disabled:active:scale-100 shadow-lg shadow-black/40"
                aria-label="Mesaj gönder"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-screen bg-gradient-to-br from-[#050C1D] via-[#0B1B38] to-[#0E2F5A] text-slate-100 animate-fade-in overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#123769]/30 blur-[120px]" />
        <div className="absolute right-0 -top-10 h-64 w-64 rounded-full bg-[#2F5FA7]/30 blur-[110px]" />
        <div className="absolute bottom-4 left-10 h-52 w-52 rounded-full bg-[#0A89B7]/25 blur-[120px]" />
      </div>

      <header className="relative bg-white/5 backdrop-blur-lg border-b border-white/10 px-4 sm:px-6 py-4 flex items-center justify-between shadow-lg shadow-black/20">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors border border-white/10 md:hidden"
            aria-label="Menüyü aç"
          >
            <Menu className="text-white" size={20} />
          </button>
          <div className="flex items-center gap-2">
            <h2 className="text-white font-playfair font-semibold text-lg">LexAI Hukuki Asistan</h2>
            <div className="flex items-center gap-1 text-sm text-slate-300" role="status" aria-label="Bağlantı durumu">
              <span
                className={`h-2 w-2 rounded-full ${
                  isConnected ? "bg-emerald-400 animate-pulse" : "bg-red-500"
                }`}
                aria-hidden="true"
              />
              <span>{isConnected ? "Çevrimiçi" : "Bağlantı kesildi"}</span>
            </div>
          </div>
        </div>
      </header>

      <main
        className="relative flex-1 overflow-y-auto p-6 sm:p-8 space-y-5"
        role="log"
        aria-live="polite"
        aria-label="Sohbet mesajları"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
            role="article"
            aria-label={`${msg.sender === "user" ? "Sizin mesajınız" : "LexAI yanıtı"}`}
          >
            <div className="flex items-start gap-3 max-w-2xl">
              {msg.sender === "bot" && (
                <div
                  className="w-10 h-10 bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center shadow-lg shadow-black/30"
                  aria-hidden="true"
                >
                  <Bot className="text-[#D4AF37]" size={20} />
                </div>
              )}
              <div
                className={`rounded-2xl px-4 py-3 shadow-lg shadow-black/20 border ${
                  msg.sender === "user"
                    ? "bg-gradient-to-br from-[#163763] to-[#0E2F5A] text-white border-white/10"
                    : "bg-white/5 text-slate-100 border-white/10 backdrop-blur-md"
                }`}
              >
                {msg.sender === "bot" ? (
                  <div className="prose prose-sm max-w-none leading-relaxed prose-invert">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                        ol: ({ children }) => <ol className="list-decimal list-inside space-y-2 my-2">{children}</ol>,
                        ul: ({ children }) => <ul className="list-disc list-inside space-y-2 my-2">{children}</ul>,
                        li: ({ children }) => <li className="ml-2">{children}</li>,
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="leading-relaxed">{msg.text}</p>
                )}
                <time className="block text-xs mt-2 text-slate-300/70 text-right" dateTime={msg.time}>
                  {msg.time}
                </time>
              </div>
              {msg.sender === "user" && (
                <div
                  className="w-10 h-10 bg-gradient-to-br from-[#2F5FA7] to-[#0E2F5A] rounded-2xl flex items-center justify-center shadow-lg shadow-black/30"
                  aria-hidden="true"
                >
                  <User className="text-white" size={18} />
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-fade-in" role="status" aria-label="Yanıt bekleniyor">
            <div className="flex items-start gap-3 max-w-lg">
              <div className="w-10 h-10 bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center shadow-lg shadow-black/30">
                <Bot className="text-[#D4AF37]" size={20} />
              </div>
              <div className="bg-white/5 rounded-2xl px-4 py-3 border border-white/10 shadow-lg shadow-black/20">
                <Loader2 className="animate-spin text-[#D4AF37]" size={20} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="relative bg-[#050C1D]/80 backdrop-blur-2xl border-t border-white/10 px-5 sm:px-6 py-4 flex items-center gap-3"
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
          className="flex-1 border border-white/15 bg-white/5 text-white rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/70 placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_20px_60px_-35px_rgba(0,0,0,0.8)]"
          aria-label="Mesaj girişi"
        />
        <button
          type="submit"
          onClick={sendMessage}
          disabled={!input.trim() || isLoading}
          className="bg-gradient-to-br from-[#D4AF37] to-[#b6881f] text-white rounded-full p-3.5 hover:opacity-95 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:opacity-50 disabled:active:scale-100 shadow-lg shadow-black/40"
          aria-label="Mesaj gönder"
        >
          {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
