import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET single pengiriman
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const pengiriman = await prisma.pengiriman.findUnique({
    where: { id },
  });

  if (!pengiriman) {
    return NextResponse.json({ error: "Pengiriman tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json(pengiriman);
}

// PUT update pengiriman
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const pengiriman = await prisma.pengiriman.update({
      where: { id },
      data: {
        nomorResi: body.nomorResi,
        namaPengirim: body.namaPengirim,
        namaPenerima: body.namaPenerima,
        alamatTujuan: body.alamatTujuan,
        telpPengirim: body.telpPengirim,
        telpPenerima: body.telpPenerima,
        berat: parseFloat(body.berat),
        biaya: parseInt(body.biaya),
        tanggalKirim: new Date(body.tanggalKirim),
        status: body.status,
      },
    });

    return NextResponse.json(pengiriman);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal mengupdate pengiriman";
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    );
  }
}

// DELETE pengiriman
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.pengiriman.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Pengiriman berhasil dihapus" });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus pengiriman" },
      { status: 400 }
    );
  }
}
