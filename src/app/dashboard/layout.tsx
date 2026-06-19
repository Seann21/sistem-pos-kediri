"use client";

import { useState } from "react";
import AuthProvider from "@/components/AuthProvider";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />

        <div className={`transition-all duration-300 ${isCollapsed ? "lg:ml-20" : "lg:ml-64"}`}>
          <Navbar onMenuClick={() => setSidebarOpen(true)} />

          <main className="p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </AuthProvider>
  );
}
