import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET all pengiriman with search, filter, pagination
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { nomorResi: { contains: search } },
      { namaPengirim: { contains: search } },
      { namaPenerima: { contains: search } },
      { alamatTujuan: { contains: search } },
    ];
  }

  if (status) {
    where.status = status;
  }

  const [pengiriman, total] = await Promise.all([
    prisma.pengiriman.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.pengiriman.count({ where }),
  ]);

  return NextResponse.json({
    data: pengiriman,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

// POST create new pengiriman
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const pengiriman = await prisma.pengiriman.create({
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
        status: body.status || "Diproses",
      },
    });

    return NextResponse.json(pengiriman, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Gagal membuat pengiriman";
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    );
  }
}
