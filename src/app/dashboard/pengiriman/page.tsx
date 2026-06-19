"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCw,
} from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { formatRupiah, formatDateShort, STATUS_LIST } from "@/lib/utils";

interface Pengiriman {
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

export default function PengirimanPage() {
  const [data, setData] = useState<Pengiriman[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [showStatusModal, setShowStatusModal] = useState<Pengiriman | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);

      const res = await fetch(`/api/pengiriman?${params}`);
      if (res.ok) {
        const json = await res.json();
        setData(json.data);
        setTotalPages(json.totalPages);
        setTotal(json.total);
      }
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/pengiriman/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchData();
        setShowDeleteModal(null);
      }
    } catch (error) {
      console.error("Failed to delete:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const pengiriman = data.find((p) => p.id === id);
      if (!pengiriman) return;

      const res = await fetch(`/api/pengiriman/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...pengiriman, status: newStatus }),
      });

      if (res.ok) {
        fetchData();
        setShowStatusModal(null);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Daftar Pengiriman
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Total {total} data pengiriman
          </p>
        </div>
        <Link
          href="/dashboard/pengiriman/tambah"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:from-blue-700 hover:to-blue-800 text-sm"
        >
          <Plus className="w-4 h-4" />
          Tambah Pengiriman
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari berdasarkan resi, pengirim, penerima, alamat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </form>
          <div className="flex gap-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
              >
                <option value="">Semua Status</option>
                {STATUS_LIST.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("");
                setPage(1);
              }}
              className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 cursor-pointer"
              title="Reset filter"
            >
              <RefreshCw className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/80">
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3 uppercase tracking-wider">
                  No. Resi
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3 uppercase tracking-wider">
                  Pengirim
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3 uppercase tracking-wider">
                  Penerima
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3 uppercase tracking-wider hidden lg:table-cell">
                  Tujuan
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3 uppercase tracking-wider">
                  Berat
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3 uppercase tracking-wider">
                  Biaya
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-center text-xs font-semibold text-slate-500 px-5 py-3 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-t border-slate-50">
                    {[...Array(9)].map((_, j) => (
                      <td key={j} className="px-5 py-3">
                        <div className="h-4 bg-slate-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-5 py-16 text-center text-sm text-slate-400"
                  >
                    <div className="flex flex-col items-center">
                      <Search className="w-10 h-10 text-slate-300 mb-3" />
                      <p className="font-medium">Data tidak ditemukan</p>
                      <p className="text-xs mt-1">
                        Coba ubah kata kunci pencarian atau filter
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <span className="text-sm font-mono font-semibold text-blue-600">
                        {item.nomorResi}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-700">
                      {item.namaPengirim}
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-700">
                      {item.namaPenerima}
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-500 hidden lg:table-cell max-w-[200px] truncate">
                      {item.alamatTujuan}
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-700">
                      {item.berat} kg
                    </td>
                    <td className="px-5 py-3 text-sm font-medium text-slate-700">
                      {formatRupiah(item.biaya)}
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-500">
                      {formatDateShort(item.tanggalKirim)}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => setShowStatusModal(item)}
                        className="cursor-pointer"
                      >
                        <StatusBadge status={item.status} />
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <Link
                          href={`/dashboard/pengiriman/${item.id}/edit`}
                          className="p-2 hover:bg-blue-50 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setShowDeleteModal(item.id)}
                          className="p-2 hover:bg-blue-50 rounded-lg text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
            <p className="text-sm text-slate-500">
              Halaman {page} dari {totalPages}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 hover:bg-slate-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium cursor-pointer ${
                    page === i + 1
                      ? "bg-blue-600 text-white"
                      : "hover:bg-slate-100 text-slate-600"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 hover:bg-slate-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full animate-fade-in">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800">
                Hapus Pengiriman?
              </h3>
              <p className="text-sm text-slate-500 mt-2">
                Data yang dihapus tidak dapat dikembalikan. Apakah Anda yakin?
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(showDeleteModal)}
                disabled={deleting}
                className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
              >
                {deleting ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full animate-fade-in">
            <h3 className="text-lg font-semibold text-slate-800 mb-1">
              Update Status
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Resi: <span className="font-mono font-semibold text-blue-600">{showStatusModal.nomorResi}</span>
            </p>
            <div className="space-y-2">
              {STATUS_LIST.map((status) => (
                <button
                  key={status}
                  onClick={() =>
                    handleStatusUpdate(showStatusModal.id, status)
                  }
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    showStatusModal.status === status
                      ? "bg-blue-50 text-blue-700 border-2 border-blue-200"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-2 border-transparent"
                  }`}
                >
                  {status}
                  {showStatusModal.status === status && (
                    <span className="text-xs ml-2 text-blue-500">(saat ini)</span>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowStatusModal(null)}
              className="w-full mt-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
