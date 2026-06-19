"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Search,
  FileText,
  Package2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Daftar Pengiriman",
    href: "/dashboard/pengiriman",
    icon: Package,
  },
  {
    label: "Tambah Pengiriman",
    href: "/dashboard/pengiriman/tambah",
    icon: PlusCircle,
  },
  {
    label: "Tracking",
    href: "/dashboard/tracking",
    icon: Search,
  },
  {
    label: "Laporan",
    href: "/dashboard/laporan",
    icon: FileText,
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-slate-200 z-50 transform transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"
        } ${isCollapsed ? "lg:w-20" : "lg:w-64"}`}
      >
        {/* Toggle Button */}
        <button
          onClick={onToggleCollapse}
          className="absolute -right-3.5 top-7 cursor-pointer bg-white border border-slate-200 rounded-full p-1.5 shadow-sm hidden lg:flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors z-50"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Logo */}
        <div className={`h-16 flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-5"} border-b border-slate-100 transition-all overflow-hidden`}>
          <img src="/logo.png" alt="Logo" className="w-9 h-9 object-contain drop-shadow-sm shrink-0" />
          <div className={`transition-all duration-300 whitespace-nowrap ${isCollapsed ? "opacity-0 w-0 hidden" : "opacity-100"}`}>
            <h1 className="font-bold text-slate-800 text-sm leading-tight">
              Kantor POS
            </h1>
            <p className="text-[10px] text-slate-400 font-medium">Kota Kediri</p>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-3 space-y-1 mt-2">
          {!isCollapsed && (
            <p className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3 whitespace-nowrap">
              Menu Utama
            </p>
          )}
          {menuItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                title={isCollapsed ? item.label : ""}
                className={`flex items-center ${isCollapsed ? "justify-center px-0" : "gap-3 px-3"} py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 text-blue-700 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 ${
                    isActive ? "text-blue-600" : "text-slate-400"
                  }`}
                />
                {!isCollapsed && (
                  <>
                    <span className="whitespace-nowrap">{item.label}</span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0" />
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100 overflow-hidden">
          {isCollapsed ? (
            <div className="flex justify-center">
              <Package2 className="w-6 h-6 text-blue-500" />
            </div>
          ) : (
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl p-3 whitespace-nowrap">
              <p className="text-xs font-semibold text-blue-700">PT Pos Indonesia</p>
              <p className="text-[10px] text-blue-500 mt-0.5">
                Kantor Pos Cabang Kediri
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
