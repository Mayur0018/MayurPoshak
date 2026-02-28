"use client";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import AnnouncementBar from "@/components/AnnouncementBar";
import CartSidebar from "@/components/CartSidebar";

import SocialProof from "@/components/SocialProof";
import ScratchCard from "@/components/ScratchCard";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const hideLayout = pathname.startsWith("/success") || pathname.startsWith("/admin");

  return (
    <>
      {!hideLayout && <AnnouncementBar />}
      {!hideLayout && <Header />}
      {children}
      {!hideLayout && <Footer />}
      {!hideLayout && <SocialProof />}
      {!hideLayout && <ScratchCard />}
      <ChatBot />
      <CartSidebar />
    </>
  );
}

