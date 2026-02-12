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
            "Sorry, something went wrong 😕 Please call +91 88008 70709 📞",
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
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 bg-black text-white rounded-full shadow-lg flex items-center justify-center text-xl"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open chat"
      >
        {isOpen ? "✕" : "💬"}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="
              fixed z-50 bg-white shadow-2xl flex flex-col overflow-hidden
              inset-x-0 bottom-0 h-[90dvh] rounded-t-3xl
              sm:inset-auto sm:bottom-20 sm:right-6
              sm:w-96 sm:h-[600px] sm:rounded-2xl
            "
          >
            {/* Drag Handle (Mobile Only) */}
            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.3}
              onDragEnd={(e, info) => {
                if (info.offset.y > 120) setIsOpen(false);
              }}
              className="sm:hidden w-12 h-1.5 bg-gray-400 rounded-full mx-auto mt-3 mb-2 cursor-grab active:cursor-grabbing"
            />

            {/* Header with Close Button */}
            <div className="bg-gradient-to-r from-black to-gray-800 text-white p-4 flex justify-between items-start">
              <div>
                <h2 className="text-base sm:text-lg font-semibold">
                  Mayur Poshak Support
                </h2>
                <p className="text-xs sm:text-sm text-gray-300">
                  Always here to help 🌟
                </p>
              </div>

              {/* Mobile Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="sm:hidden text-white text-xl leading-none px-2 active:scale-90 transition"
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 bg-gray-50">
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

            {/* Input */}
            <form
              onSubmit={handleSendMessage}
              className="border-t p-3 sm:p-4 bg-white"
            >
              <div className="flex gap-2">
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type a message..."
                  disabled={loading}
                  className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black outline-none"
                />
                <button
                  disabled={loading || !inputValue.trim()}
                  className="bg-black text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
                >
                  Send
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                💡 Ask about products, shipping & returns
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
