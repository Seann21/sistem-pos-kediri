import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

  const [
    totalHariIni,
    totalBulanIni,
    totalDiproses,
    totalDikirim,
    totalDalamPerjalanan,
    totalSampaiTujuan,
    totalDiterima,
    pengirimanTerbaru,
    totalSemuaPengiriman,
  ] = await Promise.all([
    prisma.pengiriman.count({
      where: {
        tanggalKirim: { gte: today, lt: tomorrow },
      },
    }),
    prisma.pengiriman.count({
      where: {
        tanggalKirim: { gte: firstDayOfMonth, lte: lastDayOfMonth },
      },
    }),
    prisma.pengiriman.count({ where: { status: "Diproses" } }),
    prisma.pengiriman.count({ where: { status: "Dikirim" } }),
    prisma.pengiriman.count({ where: { status: "Dalam Perjalanan" } }),
    prisma.pengiriman.count({ where: { status: "Sampai Tujuan" } }),
    prisma.pengiriman.count({ where: { status: "Diterima" } }),
    prisma.pengiriman.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.pengiriman.count(),
  ]);

  return NextResponse.json({
    totalHariIni,
    totalBulanIni,
    totalSemuaPengiriman,
    statusCount: {
      diproses: totalDiproses,
      dikirim: totalDikirim,
      dalamPerjalanan: totalDalamPerjalanan,
      sampaiTujuan: totalSampaiTujuan,
      diterima: totalDiterima,
    },
    pengirimanTerbaru,
  });
}
