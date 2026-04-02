"use client";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChatBot from "@/components/shared/ChatBot";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import CartSidebar from "@/features/cart/components/CartSidebar";

import SocialProof from "@/features/home/components/SocialProof";
import ScratchCard from "@/features/cart/components/ScratchCard";

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

