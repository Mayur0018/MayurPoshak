"use client";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChatBot from "@/components/features/ChatBot";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import CartSidebar from "@/components/features/CartSidebar";

import SocialProof from "@/components/features/SocialProof";
import ScratchCard from "@/components/features/ScratchCard";

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

