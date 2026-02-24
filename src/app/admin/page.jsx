"use client";
import { useEffect } from "react";
export default function AdminIndex() {
  useEffect(() => {
    window.location.replace("/admin/dashboard");
  }, []);
  return null;
}
