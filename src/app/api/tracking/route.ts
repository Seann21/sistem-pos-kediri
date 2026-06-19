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
  const resi = searchParams.get("resi") || "";

  if (!resi) {
    return NextResponse.json({ error: "Nomor resi harus diisi" }, { status: 400 });
  }

  const pengiriman = await prisma.pengiriman.findUnique({
    where: { nomorResi: resi },
  });

  if (!pengiriman) {
    return NextResponse.json(
      { error: "Pengiriman dengan nomor resi tersebut tidak ditemukan" },
      { status: 404 }
    );
  }

  return NextResponse.json(pengiriman);
}
