export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateShort(date: Date | string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateInput(date: Date | string): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function generateResi(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const random = String(Math.floor(Math.random() * 9999) + 1).padStart(4, "0");
  return `POS-${year}${month}${day}-${random}`;
}

export const STATUS_LIST = [
  "Diproses",
  "Dikirim",
  "Dalam Perjalanan",
  "Sampai Tujuan",
  "Diterima",
] as const;

export type StatusType = (typeof STATUS_LIST)[number];

export function getStatusColor(status: string): string {
  switch (status) {
    case "Diproses":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "Dikirim":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Dalam Perjalanan":
      return "bg-indigo-100 text-indigo-800 border-indigo-200";
    case "Sampai Tujuan":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "Diterima":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

export function getStatusIndex(status: string): number {
  return STATUS_LIST.indexOf(status as StatusType);
}
