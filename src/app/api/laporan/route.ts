import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  if (!startDate || !endDate) {
    return NextResponse.json(
      { error: "Tanggal mulai dan tanggal akhir harus diisi" },
      { status: 400 }
    );
  }

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  const pengiriman = await prisma.pengiriman.findMany({
    where: {
      tanggalKirim: {
        gte: start,
        lte: end,
      },
    },
    orderBy: { tanggalKirim: "desc" },
  });

  const totalBiaya = pengiriman.reduce((sum, p) => sum + p.biaya, 0);
  const totalBerat = pengiriman.reduce((sum, p) => sum + p.berat, 0);

  return NextResponse.json({
    data: pengiriman,
    summary: {
      totalPengiriman: pengiriman.length,
      totalBiaya,
      totalBerat: Math.round(totalBerat * 100) / 100,
    },
  });
}
