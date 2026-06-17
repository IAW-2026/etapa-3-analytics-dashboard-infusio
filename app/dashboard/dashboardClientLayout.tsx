"use client";

import React, { useState } from "react";
import Sidebar from "@/app/ui/Sidebar";
import Header from "@/app/ui/Header";

export default function DashboardClientLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-cream">
      {/* Mobile sidebar overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen w-full">
        <Header onMenuToggle={() => setSidebarOpen(true)} />
        <main className="flex-1 px-4 sm:px-8 py-8 w-full overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
