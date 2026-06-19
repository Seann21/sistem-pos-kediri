"use client";

import { useState } from "react";
import {
  Search,
  Package,
  User,
  MapPin,
  Phone,
  Calendar,
  Weight,
  CreditCard,
  CheckCircle,
  Circle,
  Loader2,
} from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { formatRupiah, formatDate, STATUS_LIST, getStatusIndex } from "@/lib/utils";

interface TrackingResult {
  id: string;
  nomorResi: string;
  namaPengirim: string;
  namaPenerima: string;
  alamatTujuan: string;
  telpPengirim: string;
  telpPenerima: string;
  berat: number;
  biaya: number;
  tanggalKirim: string;
  status: string;
}

export default function TrackingPage() {
  const [resi, setResi] = useState("");
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resi.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);
    setSearched(true);

    try {
      const res = await fetch(`/api/tracking?resi=${encodeURIComponent(resi.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        const data = await res.json();
        setError(data.error || "Pengiriman tidak ditemukan");
      }
    } catch {
      setError("Terjadi kesalahan saat mencari data");
    } finally {
      setLoading(false);
    }
  };

  const currentStatusIndex = result ? getStatusIndex(result.status) : -1;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Tracking Pengiriman</h1>
        <p className="text-sm text-slate-500 mt-1">
          Lacak status pengiriman berdasarkan nomor resi
        </p>
      </div>

      {/* Search Box */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={resi}
              onChange={(e) => setResi(e.target.value)}
              placeholder="Masukkan nomor resi (contoh: POS-20240101-0001)"
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !resi.trim()}
            className="px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 hover:from-blue-700 hover:to-blue-800 text-sm disabled:opacity-50 cursor-pointer flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            Cari
          </button>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center animate-fade-in">
          <Package className="w-12 h-12 text-blue-300 mx-auto mb-3" />
          <p className="text-blue-600 font-medium">{error}</p>
          <p className="text-sm text-blue-400 mt-1">Periksa kembali nomor resi Anda</p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-4 animate-fade-in">
          {/* Status Timeline */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-800">
                Status Pengiriman
              </h2>
              <StatusBadge status={result.status} />
            </div>

            <div className="flex items-center justify-between relative">
              {/* Line */}
              <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200" />
              <div
                className="absolute top-4 left-6 h-0.5 bg-blue-500 transition-all duration-500"
                style={{
                  width: `${(currentStatusIndex / (STATUS_LIST.length - 1)) * (100 - 10)}%`,
                }}
              />

              {STATUS_LIST.map((status, index) => {
                const isCompleted = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;

                return (
                  <div
                    key={status}
                    className="flex flex-col items-center relative z-10"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isCompleted
                          ? "bg-blue-500 shadow-lg shadow-blue-500/30"
                          : "bg-slate-200"
                      } ${isCurrent ? "ring-4 ring-blue-100 scale-110" : ""}`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <p
                      className={`text-[9px] sm:text-[10px] mt-2 font-medium text-center max-w-[60px] sm:max-w-[80px] ${
                        isCompleted ? "text-blue-600" : "text-slate-400"
                      }`}
                    >
                      {status}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detail Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Resi Info */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Package className="w-4 h-4 text-blue-500" />
                <h3 className="text-sm font-semibold text-slate-800">
                  Informasi Pengiriman
                </h3>
              </div>
              <div className="space-y-2.5">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                    Nomor Resi
                  </p>
                  <p className="text-sm font-mono font-semibold text-blue-600">
                    {result.nomorResi}
                  </p>
                </div>
                <div className="flex gap-4">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Weight className="w-3 h-3" /> Berat
                    </p>
                    <p className="text-sm font-medium text-slate-800">
                      {result.berat} kg
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <CreditCard className="w-3 h-3" /> Biaya
                    </p>
                    <p className="text-sm font-medium text-slate-800">
                      {formatRupiah(result.biaya)}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Tanggal Kirim
                  </p>
                  <p className="text-sm font-medium text-slate-800">
                    {formatDate(result.tanggalKirim)}
                  </p>
                </div>
              </div>
            </div>

            {/* Sender & Receiver */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-blue-500" />
                    <h3 className="text-sm font-semibold text-slate-800">
                      Pengirim
                    </h3>
                  </div>
                  <p className="text-sm text-slate-700">{result.namaPengirim}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3" /> {result.telpPengirim}
                  </p>
                </div>
                <hr className="border-slate-100" />
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    <h3 className="text-sm font-semibold text-slate-800">
                      Penerima
                    </h3>
                  </div>
                  <p className="text-sm text-slate-700">{result.namaPenerima}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3" /> {result.telpPenerima}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {result.alamatTujuan}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!result && !error && !loading && !searched && (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <Search className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-400">
            Masukkan Nomor Resi
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Ketik nomor resi pengiriman untuk melihat status terkini
          </p>
        </div>
      )}
    </div>
  );
}
