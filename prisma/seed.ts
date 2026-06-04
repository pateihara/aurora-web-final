// prisma/seed.ts
import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { Pool } from "pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL não encontrada no arquivo .env.");
}

const pool = new Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const passwordHash = await bcrypt.hash("123456", 10);

  const admin = await prisma.user.upsert({
    where: {
      email: "admin@flui.com",
    },
    update: {
      name: "Admin Flui",
      role: "ADMIN",
    },
    create: {
      name: "Admin Flui",
      email: "admin@flui.com",
      password: passwordHash,
      role: "ADMIN",
    },
  });

  const driver = await prisma.user.upsert({
    where: {
      email: "motorista@aurora.com",
    },
    update: {
      name: "Motorista Aurora",
      role: "DRIVER",
      sparks: 0,
      reviewsCount: 0,
    },
    create: {
      name: "Motorista Aurora",
      email: "motorista@aurora.com",
      password: passwordHash,
      role: "DRIVER",
      sparks: 0,
      reviewsCount: 0,
    },
  });

  await prisma.vehicle.upsert({
    where: {
      id: "seed-vehicle-tesla",
    },
    update: {
      nickname: "Meu Tesla",
      brand: "Tesla",
      model: "Model 3",
      year: "2023",
      plate: "ABC1D23",
      type: "EV",
      connector: "CCS2",
      batteryCapacityKwh: 75,
      rangeKm: 350,
      maxPowerKw: 170,
      currentBatteryPercent: 80,
      isActive: true,
      userId: driver.id,
    },
    create: {
      id: "seed-vehicle-tesla",
      nickname: "Meu Tesla",
      brand: "Tesla",
      model: "Model 3",
      year: "2023",
      plate: "ABC1D23",
      type: "EV",
      connector: "CCS2",
      batteryCapacityKwh: 75,
      rangeKm: 350,
      maxPowerKw: 170,
      currentBatteryPercent: 80,
      isActive: true,
      userId: driver.id,
    },
  });

  const stationSp = await prisma.station.upsert({
    where: {
      id: "seed-station-sao-paulo",
    },
    update: {
      name: "Flui São Paulo",
      address: "Avenida Santo Amaro, 1234",
      city: "São Paulo",
      state: "SP",
      latitude: -23.5995,
      longitude: -46.6826,
      isOpen24h: true,
      amenities: ["Café", "Banheiro", "Wi-Fi"],
    },
    create: {
      id: "seed-station-sao-paulo",
      name: "Flui São Paulo",
      address: "Avenida Santo Amaro, 1234",
      city: "São Paulo",
      state: "SP",
      latitude: -23.5995,
      longitude: -46.6826,
      isOpen24h: true,
      amenities: ["Café", "Banheiro", "Wi-Fi"],
    },
  });

  const stationCuritiba = await prisma.station.upsert({
    where: {
      id: "seed-station-curitiba",
    },
    update: {
      name: "Flui Curitiba",
      address: "Avenida Sete de Setembro, 2775",
      city: "Curitiba",
      state: "PR",
      latitude: -25.4429,
      longitude: -49.2769,
      isOpen24h: true,
      amenities: ["Shopping", "Restaurante", "Banheiro"],
    },
    create: {
      id: "seed-station-curitiba",
      name: "Flui Curitiba",
      address: "Avenida Sete de Setembro, 2775",
      city: "Curitiba",
      state: "PR",
      latitude: -25.4429,
      longitude: -49.2769,
      isOpen24h: true,
      amenities: ["Shopping", "Restaurante", "Banheiro"],
    },
  });

  await prisma.charger.upsert({
    where: {
      id: "seed-charger-sp-ccs2",
    },
    update: {
      label: "Terminal 01",
      connector: "CCS2",
      powerKw: 150,
      status: "AVAILABLE",
      stationId: stationSp.id,
    },
    create: {
      id: "seed-charger-sp-ccs2",
      label: "Terminal 01",
      connector: "CCS2",
      powerKw: 150,
      status: "AVAILABLE",
      stationId: stationSp.id,
    },
  });

  await prisma.charger.upsert({
    where: {
      id: "seed-charger-sp-type2",
    },
    update: {
      label: "Terminal 02",
      connector: "TYPE2",
      powerKw: 22,
      status: "AVAILABLE",
      stationId: stationSp.id,
    },
    create: {
      id: "seed-charger-sp-type2",
      label: "Terminal 02",
      connector: "TYPE2",
      powerKw: 22,
      status: "AVAILABLE",
      stationId: stationSp.id,
    },
  });

  await prisma.charger.upsert({
    where: {
      id: "seed-charger-curitiba-ccs2",
    },
    update: {
      label: "Terminal 01",
      connector: "CCS2",
      powerKw: 120,
      status: "AVAILABLE",
      stationId: stationCuritiba.id,
    },
    create: {
      id: "seed-charger-curitiba-ccs2",
      label: "Terminal 01",
      connector: "CCS2",
      powerKw: 120,
      status: "AVAILABLE",
      stationId: stationCuritiba.id,
    },
  });

  console.log("Seed concluído com sucesso.");
  console.log({
    admin: admin.email,
    driver: driver.email,
  });
}

main()
  .catch((error) => {
    console.error("Erro ao executar seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });