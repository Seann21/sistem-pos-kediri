"use client";

import { useEffect, useState } from "react";
import {
  Package,
  CalendarDays,
  Clock,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import { formatRupiah, formatDateShort } from "@/lib/utils";

interface DashboardData {
  totalHariIni: number;
  totalBulanIni: number;
  totalSemuaPengiriman: number;
  statusCount: {
    diproses: number;
    dikirim: number;
    dalamPerjalanan: number;
    sampaiTujuan: number;
    diterima: number;
  };
  pengirimanTerbaru: Array<{
    id: string;
    nomorResi: string;
    namaPengirim: string;
    namaPenerima: string;
    alamatTujuan: string;
    biaya: number;
    tanggalKirim: string;
    status: string;
  }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await fetch("/api/dashboard");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 animate-pulse h-32"
            />
          ))}
        </div>
        <div className="bg-white rounded-2xl p-6 animate-pulse h-96" />
      </div>
    );
  }

  if (!data) return null;

  const statsCards = [
    {
      label: "Total Pengiriman",
      value: data.totalSemuaPengiriman,
      icon: Package,
      color: "from-blue-500 to-blue-600",
      shadowColor: "shadow-blue-500/20",
      bgLight: "bg-blue-50",
    },
    {
      label: "Pengiriman Hari Ini",
      value: data.totalHariIni,
      icon: CalendarDays,
      color: "from-emerald-500 to-emerald-600",
      shadowColor: "shadow-emerald-500/20",
      bgLight: "bg-emerald-50",
    },
    {
      label: "Pengiriman Bulan Ini",
      value: data.totalBulanIni,
      icon: TrendingUp,
      color: "from-violet-500 to-violet-600",
      shadowColor: "shadow-violet-500/20",
      bgLight: "bg-violet-50",
    },
    {
      label: "Sedang Diproses",
      value: data.statusCount.diproses,
      icon: Clock,
      color: "from-amber-500 to-amber-600",
      shadowColor: "shadow-amber-500/20",
      bgLight: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          Selamat datang di Sistem Informasi Pengiriman Kantor Pos Kediri
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`bg-white rounded-2xl p-5 border border-slate-100 hover:shadow-lg hover:${stat.shadowColor} transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 ${stat.bgLight} rounded-xl flex items-center justify-center`}
                >
                  <Icon
                    className={`w-5 h-5 bg-gradient-to-r ${stat.color} bg-clip-text`}
                    style={{
                      color:
                        stat.color.includes("blue")
                          ? "#3b82f6"
                          : stat.color.includes("emerald")
                          ? "#10b981"
                          : stat.color.includes("violet")
                          ? "#8b5cf6"
                          : "#f59e0b",
                    }}
                  />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Status Overview */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Status Pengiriman
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: "Diproses", count: data.statusCount.diproses, color: "bg-amber-500" },
            { label: "Dikirim", count: data.statusCount.dikirim, color: "bg-blue-500" },
            { label: "Dalam Perjalanan", count: data.statusCount.dalamPerjalanan, color: "bg-indigo-500" },
            { label: "Sampai Tujuan", count: data.statusCount.sampaiTujuan, color: "bg-emerald-500" },
            { label: "Diterima", count: data.statusCount.diterima, color: "bg-green-500" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-slate-50 rounded-xl p-3 text-center hover:bg-slate-100 transition-colors"
            >
              <div className={`w-3 h-3 ${item.color} rounded-full mx-auto mb-2`} />
              <p className="text-2xl font-bold text-slate-800">{item.count}</p>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Shipments */}
      <div className="bg-white rounded-2xl border border-slate-100">
        <div className="p-6 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Pengiriman Terbaru
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              10 pengiriman terakhir
            </p>
          </div>
          <Link
            href="/dashboard/pengiriman"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            Lihat Semua
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-t border-slate-100">
                <th className="text-left text-xs font-semibold text-slate-500 px-6 py-3 uppercase tracking-wider">
                  No. Resi
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 px-6 py-3 uppercase tracking-wider">
                  Pengirim
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 px-6 py-3 uppercase tracking-wider">
                  Penerima
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 px-6 py-3 uppercase tracking-wider">
                  Biaya
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 px-6 py-3 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 px-6 py-3 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {data.pengirimanTerbaru.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-3">
                    <span className="text-sm font-mono font-semibold text-blue-600">
                      {item.nomorResi}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-700">
                    {item.namaPengirim}
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-700">
                    {item.namaPenerima}
                  </td>
                  <td className="px-6 py-3 text-sm font-medium text-slate-700">
                    {formatRupiah(item.biaya)}
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-500">
                    {formatDateShort(item.tanggalKirim)}
                  </td>
                  <td className="px-6 py-3">
                    <StatusBadge status={item.status} />
                  </td>
                </tr>
              ))}
              {data.pengirimanTerbaru.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-sm text-slate-400"
                  >
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    Belum ada data pengiriman
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
