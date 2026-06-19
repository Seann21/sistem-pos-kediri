"use client";

import { useState } from "react";
import {
  Search,
  Calendar,
  FileText,
  Printer,
  Package,
  CreditCard,
  Weight,
  Loader2,
} from "lucide-react";
import { formatRupiah, formatDate, formatDateShort, STATUS_LIST } from "@/lib/utils";
import StatusBadge from "@/components/StatusBadge";

interface Pengiriman {
  id: string;
  nomorResi: string;
  namaPengirim: string;
  namaPenerima: string;
  berat: number;
  biaya: number;
  tanggalKirim: string;
  status: string;
}

interface LaporanResponse {
  data: Pengiriman[];
  summary: {
    totalPengiriman: number;
    totalBiaya: number;
    totalBerat: number;
  };
}

export default function LaporanPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LaporanResponse | null>(null);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) return;

    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const params = new URLSearchParams({
        startDate,
        endDate,
      });
      const res = await fetch(`/api/laporan?${params}`);
      
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        const data = await res.json();
        setError(data.error || "Gagal memuat laporan");
      }
    } catch {
      setError("Terjadi kesalahan saat memuat laporan");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in print:max-w-none print:m-0 print:space-y-4">
      {/* Header - Hidden on print */}
      <div className="print:hidden">
        <h1 className="text-2xl font-bold text-slate-800">Laporan Pengiriman</h1>
        <p className="text-sm text-slate-500 mt-1">
          Cetak dan lihat rekapitulasi data pengiriman berdasarkan periode tanggal
        </p>
      </div>

      {/* Print Header - Only visible on print */}
      <div className="hidden print:block text-center mb-8 border-b-2 border-slate-800 pb-6">
        <h1 className="text-2xl font-bold text-slate-800 uppercase tracking-wider">
          Kantor Pos Kediri
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Laporan Rekapitulasi Pengiriman Barang
        </p>
        <p className="text-xs text-slate-500 mt-2">
          Periode: {startDate ? formatDate(startDate) : "-"} s/d {endDate ? formatDate(endDate) : "-"}
        </p>
      </div>

      {/* Filter - Hidden on print */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 print:hidden">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-slate-700 mb-1.5 items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              Dari Tanggal
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              required
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-slate-700 mb-1.5 items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              Sampai Tanggal
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading || !startDate || !endDate}
            className="w-full sm:w-auto px-6 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 hover:from-blue-700 hover:to-blue-800 text-sm disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            Tampilkan Laporan
          </button>
        </form>
      </div>

      {/* Error - Hidden on print */}
      {error && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-blue-600 text-sm font-medium print:hidden">
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-6 animate-fade-in print:space-y-4">
          {/* Action Bar - Hidden on print */}
          <div className="flex justify-end print:hidden">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-800 text-white font-medium rounded-xl text-sm hover:bg-slate-900 shadow-lg shadow-slate-800/20 flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
            >
              <Printer className="w-4 h-4" />
              Cetak Laporan
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 print:grid-cols-3 print:gap-2">
            <div className="bg-white rounded-2xl border border-slate-100 p-5 print:rounded-none print:border-slate-300 print:p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center print:hidden">
                  <Package className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-medium text-slate-500 print:text-slate-800">Total Pengiriman</h3>
              </div>
              <p className="text-2xl font-bold text-slate-800 print:text-xl">{result.summary.totalPengiriman} <span className="text-sm font-medium text-slate-500 print:hidden">paket</span></p>
            </div>
            
            <div className="bg-white rounded-2xl border border-slate-100 p-5 print:rounded-none print:border-slate-300 print:p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center print:hidden">
                  <Weight className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-medium text-slate-500 print:text-slate-800">Total Berat</h3>
              </div>
              <p className="text-2xl font-bold text-slate-800 print:text-xl">{result.summary.totalBerat} <span className="text-sm font-medium text-slate-500 print:hidden">kg</span></p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-5 print:rounded-none print:border-slate-300 print:p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center print:hidden">
                  <CreditCard className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-medium text-slate-500 print:text-slate-800">Total Pendapatan</h3>
              </div>
              <p className="text-2xl font-bold text-slate-800 print:text-xl">{formatRupiah(result.summary.totalBiaya)}</p>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden print:rounded-none print:border-slate-300 shadow-sm print:shadow-none">
            <div className="p-5 border-b border-slate-100 print:hidden bg-slate-50/50">
              <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-400" />
                Rincian Data Pengiriman
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full print:text-sm">
                <thead>
                  <tr className="bg-slate-50/80 print:bg-slate-100 border-b border-slate-200">
                    <th className="text-left text-xs font-semibold text-slate-600 px-5 py-3 print:py-2 uppercase tracking-wider print:border-r print:border-slate-300 last:border-0">No. Resi</th>
                    <th className="text-left text-xs font-semibold text-slate-600 px-5 py-3 print:py-2 uppercase tracking-wider print:border-r print:border-slate-300 last:border-0">Tanggal</th>
                    <th className="text-left text-xs font-semibold text-slate-600 px-5 py-3 print:py-2 uppercase tracking-wider print:border-r print:border-slate-300 last:border-0">Pengirim</th>
                    <th className="text-left text-xs font-semibold text-slate-600 px-5 py-3 print:py-2 uppercase tracking-wider print:border-r print:border-slate-300 last:border-0">Penerima</th>
                    <th className="text-right text-xs font-semibold text-slate-600 px-5 py-3 print:py-2 uppercase tracking-wider print:border-r print:border-slate-300 last:border-0">Berat (kg)</th>
                    <th className="text-right text-xs font-semibold text-slate-600 px-5 py-3 print:py-2 uppercase tracking-wider print:border-r print:border-slate-300 last:border-0">Biaya</th>
                    <th className="text-center text-xs font-semibold text-slate-600 px-5 py-3 print:py-2 uppercase tracking-wider print:border-r print:border-slate-300 last:border-0">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 print:divide-slate-300">
                  {result.data.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-12 text-center text-sm text-slate-500">
                        Tidak ada data pengiriman pada periode tersebut.
                      </td>
                    </tr>
                  ) : (
                    result.data.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors print:hover:bg-transparent">
                        <td className="px-5 py-3 print:py-2 text-sm font-mono text-slate-700 print:border-r print:border-slate-300 last:border-0">{item.nomorResi}</td>
                        <td className="px-5 py-3 print:py-2 text-sm text-slate-600 print:border-r print:border-slate-300 last:border-0">{formatDateShort(item.tanggalKirim)}</td>
                        <td className="px-5 py-3 print:py-2 text-sm text-slate-700 print:border-r print:border-slate-300 last:border-0">{item.namaPengirim}</td>
                        <td className="px-5 py-3 print:py-2 text-sm text-slate-700 print:border-r print:border-slate-300 last:border-0">{item.namaPenerima}</td>
                        <td className="px-5 py-3 print:py-2 text-sm text-slate-700 text-right print:border-r print:border-slate-300 last:border-0">{item.berat}</td>
                        <td className="px-5 py-3 print:py-2 text-sm font-medium text-slate-700 text-right print:border-r print:border-slate-300 last:border-0">{formatRupiah(item.biaya)}</td>
                        <td className="px-5 py-3 print:py-2 text-center print:border-r print:border-slate-300 last:border-0">
                          <div className="print:hidden">
                            <StatusBadge status={item.status} />
                          </div>
                          <span className="hidden print:inline text-xs font-semibold uppercase">{item.status}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                {result.data.length > 0 && (
                  <tfoot className="bg-slate-50/80 font-semibold text-slate-800 print:bg-slate-100 border-t-2 border-slate-200">
                    <tr>
                      <td colSpan={4} className="px-5 py-3 text-right">TOTAL</td>
                      <td className="px-5 py-3 text-right text-sm">{result.summary.totalBerat}</td>
                      <td className="px-5 py-3 text-right text-sm">{formatRupiah(result.summary.totalBiaya)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
          
          {/* Print Signature Section - Only visible on print */}
          <div className="hidden print:flex justify-end mt-12 pt-8">
            <div className="text-center w-64">
              <p className="text-sm mb-16">Kediri, {formatDate(new Date())}</p>
              <p className="text-sm font-bold underline">Admin Kantor Pos</p>
            </div>
          </div>
        </div>
      )}

      {/* Empty State - Hidden on print */}
      {!result && !error && !loading && !searched && (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center print:hidden">
          <FileText className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-400">
            Laporan Kosong
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Pilih rentang tanggal dan klik "Tampilkan Laporan"
          </p>
        </div>
      )}
    </div>
  );
}
