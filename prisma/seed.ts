// prisma/seed.ts
import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { Pool } from "pg";
import { PrismaClient } from "../src/generated/prisma/client";
import type { ChargerStatus, ConnectorType } from "../src/generated/prisma/client";

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

type ChargerSeed = {
  id: string;
  label: string;
  connector: ConnectorType;
  powerKw: number;
  status?: ChargerStatus;
};

type StationSeed = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  isOpen24h: boolean;
  amenities: string[];
  chargers: ChargerSeed[];
};

const stations: StationSeed[] = [
  {
    id: "seed-station-sp-paulista",
    name: "Flui Paulista",
    address: "Avenida Paulista, 1578",
    city: "São Paulo",
    state: "SP",
    latitude: -23.5617,
    longitude: -46.6559,
    isOpen24h: true,
    amenities: ["Café", "Banheiro", "Wi-Fi", "Shopping próximo"],
    chargers: [
      {
        id: "seed-charger-sp-paulista-ccs2-01",
        label: "Terminal 01",
        connector: "CCS2",
        powerKw: 150,
      },
      {
        id: "seed-charger-sp-paulista-type2-02",
        label: "Terminal 02",
        connector: "TYPE2",
        powerKw: 22,
      },
    ],
  },
  {
    id: "seed-station-sp-pinheiros",
    name: "Flui Pinheiros",
    address: "Rua dos Pinheiros, 1037",
    city: "São Paulo",
    state: "SP",
    latitude: -23.5663,
    longitude: -46.6943,
    isOpen24h: false,
    amenities: ["Café", "Restaurante", "Banheiro"],
    chargers: [
      {
        id: "seed-charger-sp-pinheiros-ccs2-01",
        label: "Terminal 01",
        connector: "CCS2",
        powerKw: 120,
      },
      {
        id: "seed-charger-sp-pinheiros-type2-02",
        label: "Terminal 02",
        connector: "TYPE2",
        powerKw: 22,
      },
    ],
  },
  {
    id: "seed-station-sp-morumbi",
    name: "Flui Morumbi",
    address: "Avenida Roque Petroni Júnior, 1089",
    city: "São Paulo",
    state: "SP",
    latitude: -23.6228,
    longitude: -46.6995,
    isOpen24h: true,
    amenities: ["Shopping", "Banheiro", "Restaurante", "Segurança"],
    chargers: [
      {
        id: "seed-charger-sp-morumbi-ccs2-01",
        label: "Terminal 01",
        connector: "CCS2",
        powerKw: 180,
      },
      {
        id: "seed-charger-sp-morumbi-ccs2-02",
        label: "Terminal 02",
        connector: "CCS2",
        powerKw: 120,
      },
      {
        id: "seed-charger-sp-morumbi-type2-03",
        label: "Terminal 03",
        connector: "TYPE2",
        powerKw: 22,
      },
    ],
  },
  {
    id: "seed-station-sp-tatuape",
    name: "Flui Tatuapé",
    address: "Rua Tuiuti, 1200",
    city: "São Paulo",
    state: "SP",
    latitude: -23.5406,
    longitude: -46.5764,
    isOpen24h: false,
    amenities: ["Shopping", "Banheiro", "Praça de alimentação"],
    chargers: [
      {
        id: "seed-charger-sp-tatuape-ccs2-01",
        label: "Terminal 01",
        connector: "CCS2",
        powerKw: 90,
      },
      {
        id: "seed-charger-sp-tatuape-type2-02",
        label: "Terminal 02",
        connector: "TYPE2",
        powerKw: 22,
      },
    ],
  },
  {
    id: "seed-station-sp-santana",
    name: "Flui Santana",
    address: "Avenida Braz Leme, 2033",
    city: "São Paulo",
    state: "SP",
    latitude: -23.5022,
    longitude: -46.6251,
    isOpen24h: true,
    amenities: ["Café", "Banheiro", "Wi-Fi"],
    chargers: [
      {
        id: "seed-charger-sp-santana-ccs2-01",
        label: "Terminal 01",
        connector: "CCS2",
        powerKw: 100,
      },
      {
        id: "seed-charger-sp-santana-chademo-02",
        label: "Terminal 02",
        connector: "CHADEMO",
        powerKw: 50,
      },
    ],
  },
  {
    id: "seed-station-sp-santo-amaro",
    name: "Flui Santo Amaro",
    address: "Avenida Santo Amaro, 1234",
    city: "São Paulo",
    state: "SP",
    latitude: -23.5995,
    longitude: -46.6826,
    isOpen24h: true,
    amenities: ["Café", "Banheiro", "Wi-Fi"],
    chargers: [
      {
        id: "seed-charger-sp-santo-amaro-ccs2-01",
        label: "Terminal 01",
        connector: "CCS2",
        powerKw: 150,
      },
      {
        id: "seed-charger-sp-santo-amaro-type2-02",
        label: "Terminal 02",
        connector: "TYPE2",
        powerKw: 22,
      },
    ],
  },
  {
    id: "seed-station-sp-vila-olimpia",
    name: "Flui Vila Olímpia",
    address: "Rua Olimpíadas, 360",
    city: "São Paulo",
    state: "SP",
    latitude: -23.5954,
    longitude: -46.6846,
    isOpen24h: false,
    amenities: ["Shopping", "Café", "Restaurante", "Banheiro"],
    chargers: [
      {
        id: "seed-charger-sp-vila-olimpia-ccs2-01",
        label: "Terminal 01",
        connector: "CCS2",
        powerKw: 120,
      },
      {
        id: "seed-charger-sp-vila-olimpia-type2-02",
        label: "Terminal 02",
        connector: "TYPE2",
        powerKw: 22,
      },
    ],
  },
  {
    id: "seed-station-sp-barueri",
    name: "Flui Barueri Castelo",
    address: "Alameda Rio Negro, 500",
    city: "Barueri",
    state: "SP",
    latitude: -23.4961,
    longitude: -46.8485,
    isOpen24h: true,
    amenities: ["Shopping", "Restaurante", "Banheiro", "Segurança"],
    chargers: [
      {
        id: "seed-charger-sp-barueri-ccs2-01",
        label: "Terminal 01",
        connector: "CCS2",
        powerKw: 150,
      },
      {
        id: "seed-charger-sp-barueri-type2-02",
        label: "Terminal 02",
        connector: "TYPE2",
        powerKw: 22,
      },
    ],
  },
  {
    id: "seed-station-sp-sorocaba",
    name: "Flui Sorocaba",
    address: "Avenida Antônio Carlos Comitre, 1500",
    city: "Sorocaba",
    state: "SP",
    latitude: -23.5015,
    longitude: -47.4526,
    isOpen24h: true,
    amenities: ["Shopping", "Banheiro", "Restaurante", "Wi-Fi"],
    chargers: [
      {
        id: "seed-charger-sp-sorocaba-ccs2-01",
        label: "Terminal 01",
        connector: "CCS2",
        powerKw: 120,
      },
      {
        id: "seed-charger-sp-sorocaba-type2-02",
        label: "Terminal 02",
        connector: "TYPE2",
        powerKw: 22,
      },
    ],
  },
  {
    id: "seed-station-pr-curitiba-centro",
    name: "Flui Curitiba Centro",
    address: "Avenida Sete de Setembro, 2775",
    city: "Curitiba",
    state: "PR",
    latitude: -25.4429,
    longitude: -49.2769,
    isOpen24h: true,
    amenities: ["Shopping", "Restaurante", "Banheiro"],
    chargers: [
      {
        id: "seed-charger-pr-curitiba-centro-ccs2-01",
        label: "Terminal 01",
        connector: "CCS2",
        powerKw: 120,
      },
      {
        id: "seed-charger-pr-curitiba-centro-type2-02",
        label: "Terminal 02",
        connector: "TYPE2",
        powerKw: 22,
      },
    ],
  },
  {
    id: "seed-station-pr-curitiba-batel",
    name: "Flui Batel",
    address: "Avenida do Batel, 1868",
    city: "Curitiba",
    state: "PR",
    latitude: -25.4436,
    longitude: -49.2924,
    isOpen24h: false,
    amenities: ["Shopping", "Café", "Banheiro", "Restaurante"],
    chargers: [
      {
        id: "seed-charger-pr-batel-ccs2-01",
        label: "Terminal 01",
        connector: "CCS2",
        powerKw: 150,
      },
      {
        id: "seed-charger-pr-batel-type2-02",
        label: "Terminal 02",
        connector: "TYPE2",
        powerKw: 22,
      },
    ],
  },
  {
    id: "seed-station-pr-curitiba-ecoville",
    name: "Flui Ecoville",
    address: "Rua Professor Pedro Viriato Parigot de Souza, 600",
    city: "Curitiba",
    state: "PR",
    latitude: -25.4381,
    longitude: -49.3297,
    isOpen24h: true,
    amenities: ["Shopping", "Banheiro", "Wi-Fi", "Segurança"],
    chargers: [
      {
        id: "seed-charger-pr-ecoville-ccs2-01",
        label: "Terminal 01",
        connector: "CCS2",
        powerKw: 180,
      },
      {
        id: "seed-charger-pr-ecoville-ccs2-02",
        label: "Terminal 02",
        connector: "CCS2",
        powerKw: 120,
      },
      {
        id: "seed-charger-pr-ecoville-type2-03",
        label: "Terminal 03",
        connector: "TYPE2",
        powerKw: 22,
      },
    ],
  },
  {
    id: "seed-station-pr-curitiba-agua-verde",
    name: "Flui Água Verde",
    address: "Avenida República Argentina, 1430",
    city: "Curitiba",
    state: "PR",
    latitude: -25.4491,
    longitude: -49.2916,
    isOpen24h: false,
    amenities: ["Café", "Banheiro", "Mercado próximo"],
    chargers: [
      {
        id: "seed-charger-pr-agua-verde-type2-01",
        label: "Terminal 01",
        connector: "TYPE2",
        powerKw: 22,
      },
      {
        id: "seed-charger-pr-agua-verde-ccs2-02",
        label: "Terminal 02",
        connector: "CCS2",
        powerKw: 90,
      },
    ],
  },
  {
    id: "seed-station-pr-curitiba-cabral",
    name: "Flui Cabral",
    address: "Avenida Paraná, 2800",
    city: "Curitiba",
    state: "PR",
    latitude: -25.4011,
    longitude: -49.2536,
    isOpen24h: true,
    amenities: ["Banheiro", "Wi-Fi", "Café"],
    chargers: [
      {
        id: "seed-charger-pr-cabral-ccs2-01",
        label: "Terminal 01",
        connector: "CCS2",
        powerKw: 100,
      },
      {
        id: "seed-charger-pr-cabral-chademo-02",
        label: "Terminal 02",
        connector: "CHADEMO",
        powerKw: 50,
      },
    ],
  },
  {
    id: "seed-station-pr-curitiba-jardim-botanico",
    name: "Flui Jardim Botânico",
    address: "Rua Engenheiro Ostoja Roguski, 350",
    city: "Curitiba",
    state: "PR",
    latitude: -25.4422,
    longitude: -49.2394,
    isOpen24h: true,
    amenities: ["Café", "Banheiro", "Parque próximo"],
    chargers: [
      {
        id: "seed-charger-pr-jardim-botanico-ccs2-01",
        label: "Terminal 01",
        connector: "CCS2",
        powerKw: 120,
      },
      {
        id: "seed-charger-pr-jardim-botanico-type2-02",
        label: "Terminal 02",
        connector: "TYPE2",
        powerKw: 22,
      },
    ],
  },
];

async function upsertStationWithChargers(stationSeed: StationSeed) {
  const station = await prisma.station.upsert({
    where: {
      id: stationSeed.id,
    },
    update: {
      name: stationSeed.name,
      address: stationSeed.address,
      city: stationSeed.city,
      state: stationSeed.state,
      latitude: stationSeed.latitude,
      longitude: stationSeed.longitude,
      isOpen24h: stationSeed.isOpen24h,
      amenities: stationSeed.amenities,
    },
    create: {
      id: stationSeed.id,
      name: stationSeed.name,
      address: stationSeed.address,
      city: stationSeed.city,
      state: stationSeed.state,
      latitude: stationSeed.latitude,
      longitude: stationSeed.longitude,
      isOpen24h: stationSeed.isOpen24h,
      amenities: stationSeed.amenities,
    },
  });

  for (const chargerSeed of stationSeed.chargers) {
    await prisma.charger.upsert({
      where: {
        id: chargerSeed.id,
      },
      update: {
        label: chargerSeed.label,
        connector: chargerSeed.connector,
        powerKw: chargerSeed.powerKw,
        status: chargerSeed.status ?? "AVAILABLE",
        stationId: station.id,
      },
      create: {
        id: chargerSeed.id,
        label: chargerSeed.label,
        connector: chargerSeed.connector,
        powerKw: chargerSeed.powerKw,
        status: chargerSeed.status ?? "AVAILABLE",
        stationId: station.id,
      },
    });
  }

  return station;
}

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

  for (const stationSeed of stations) {
    await upsertStationWithChargers(stationSeed);
  }

  console.log("Seed concluído com sucesso.");
  console.log({
    admin: admin.email,
    driver: driver.email,
    stations: stations.length,
    chargers: stations.reduce(
      (total, station) => total + station.chargers.length,
      0,
    ),
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