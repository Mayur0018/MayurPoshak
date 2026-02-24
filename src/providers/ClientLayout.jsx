"use client";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const hideLayout = pathname.startsWith("/success") || pathname.startsWith("/admin");

  return (
    <>
      {!hideLayout && <Header />}
      {children}
      {!hideLayout && <Footer />}
      <ChatBot />
    </>
  );
}
