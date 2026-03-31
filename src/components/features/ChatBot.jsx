"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Hello! Welcome to Mayur Poshak! How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.text }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: data.reply,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          text:
            "Sorry, something went wrong 😕 Please call 9106481092 📞",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-16 right-4 sm:bottom-6 sm:right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 bg-black text-white rounded-full shadow-lg flex items-center justify-center text-xl"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open chat"
      >
        {isOpen ? "✕" : "💬"}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="
              fixed z-[100] bg-white shadow-2xl flex flex-col overflow-hidden
              inset-x-0 bottom-0 h-[85vh] sm:h-[600px] rounded-t-3xl border border-gray-100
              sm:inset-auto sm:bottom-24 sm:right-6 sm:w-[380px] sm:rounded-2xl
            "
          >
            {/* Drag Handle (Mobile Only) */}
            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.3}
              onDragEnd={(e, info) => {
                if (info.offset.y > 100) setIsOpen(false);
              }}
              className="sm:hidden w-12 h-1.5 bg-gray-300 hover:bg-gray-400 rounded-full mx-auto mt-3 mb-2 cursor-grab active:cursor-grabbing transition-colors"
            />

            {/* Header with Close Button */}
            <div className="bg-black text-white p-4 flex justify-between items-center sm:rounded-t-2xl">
              <div>
                <h2 className="text-sm sm:text-base font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  Mayur Poshak Support
                </h2>
                <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5 font-medium">
                  We typically reply in a few minutes
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all active:scale-90"
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>

            {/* Messages Area - Ensure flexible height taking remaining space */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 relative hide-scrollbar">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] sm:max-w-xs px-4 py-2 rounded-lg text-sm ${
                      msg.sender === "user"
                        ? "bg-black text-white rounded-br-none"
                        : "bg-white border rounded-bl-none"
                    }`}
                  >
                    <p className="break-words">{msg.text}</p>
                    <p className="text-[10px] mt-1 opacity-60">
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="flex gap-2 px-4 py-2 bg-white border rounded-lg">
                    <span className="w-2 h-2 bg-black rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-black rounded-full animate-bounce delay-100" />
                    <span className="w-2 h-2 bg-black rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area (Fixed at bottom of chatbot) */}
            <div className="p-3 sm:p-4 bg-white border-t border-gray-100 shadow-[0_-10px_20px_rgba(0,0,0,0.02)] shrink-0">
              <form
                onSubmit={handleSendMessage}
                className="flex gap-2"
              >
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  disabled={loading}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:outline-none focus:border-black transition-all"
                />
                <button
                  disabled={loading || !inputValue.trim()}
                  className="bg-black text-white px-5 py-3 rounded-xl text-sm font-bold disabled:opacity-50 disabled:bg-gray-300 hover:bg-gray-800 transition-colors shadow-sm"
                >
                  Send
                </button>
              </form>
              <div className="flex justify-center gap-2 mt-3 overflow-x-auto hide-scrollbar pb-1">
                 <button onClick={() => setInputValue("Where is my order?")} className="text-[10px] font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg whitespace-nowrap hover:bg-gray-200 transition-colors">Track Order</button>
                 <button onClick={() => setInputValue("What is your return policy?")} className="text-[10px] font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg whitespace-nowrap hover:bg-gray-200 transition-colors">Return Policy</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}
