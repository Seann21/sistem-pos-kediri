import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create default admin user
  const hashedPassword = await hash("admin123", 12);
  
  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: hashedPassword,
      nama: "Administrator",
    },
  });

  console.log("✅ Admin user created:", admin.username);

  // Create sample pengiriman data
  const sampleData = [
    {
      nomorResi: "POS-20240101-0001",
      namaPengirim: "Budi Santoso",
      namaPenerima: "Siti Rahayu",
      alamatTujuan: "Jl. Merdeka No. 10, Surabaya",
      telpPengirim: "081234567890",
      telpPenerima: "082345678901",
      berat: 2.5,
      biaya: 25000,
      tanggalKirim: new Date("2024-01-15"),
      status: "Diterima",
    },
    {
      nomorResi: "POS-20240101-0002",
      namaPengirim: "Ahmad Wijaya",
      namaPenerima: "Dewi Lestari",
      alamatTujuan: "Jl. Sudirman No. 45, Malang",
      telpPengirim: "083456789012",
      telpPenerima: "084567890123",
      berat: 1.0,
      biaya: 15000,
      tanggalKirim: new Date("2024-01-16"),
      status: "Dalam Perjalanan",
    },
    {
      nomorResi: "POS-20240101-0003",
      namaPengirim: "Rina Kartika",
      namaPenerima: "Joko Prasetyo",
      alamatTujuan: "Jl. Ahmad Yani No. 22, Blitar",
      telpPengirim: "085678901234",
      telpPenerima: "086789012345",
      berat: 5.0,
      biaya: 45000,
      tanggalKirim: new Date("2024-01-17"),
      status: "Diproses",
    },
    {
      nomorResi: "POS-20240101-0004",
      namaPengirim: "Eko Saputra",
      namaPenerima: "Maya Sari",
      alamatTujuan: "Jl. Diponegoro No. 8, Tulungagung",
      telpPengirim: "087890123456",
      telpPenerima: "088901234567",
      berat: 3.2,
      biaya: 32000,
      tanggalKirim: new Date(),
      status: "Dikirim",
    },
    {
      nomorResi: "POS-20240101-0005",
      namaPengirim: "Wahyu Hidayat",
      namaPenerima: "Nur Fadilah",
      alamatTujuan: "Jl. Gatot Subroto No. 15, Nganjuk",
      telpPengirim: "089012345678",
      telpPenerima: "081123456789",
      berat: 0.5,
      biaya: 10000,
      tanggalKirim: new Date(),
      status: "Diproses",
    },
  ];

  for (const data of sampleData) {
    await prisma.pengiriman.upsert({
      where: { nomorResi: data.nomorResi },
      update: {},
      create: data,
    });
  }

  console.log("✅ Sample pengiriman data created:", sampleData.length, "records");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
