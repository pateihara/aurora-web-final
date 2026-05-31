//prisma/seed.ts
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Limpando banco...");

  await prisma.chargingHistory.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.review.deleteMany();
  await prisma.charger.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.station.deleteMany();
  await prisma.user.deleteMany();

  console.log("Criando usuários...");

  const adminPassword = await bcrypt.hash("admin123", 10);
  const driverPassword = await bcrypt.hash("123456", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Flui Admin",
      email: "admin@flui.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const driver = await prisma.user.create({
    data: {
      name: "Ana Silva",
      email: "ana@aurora.com",
      password: driverPassword,
      role: "DRIVER",
      vehicles: {
        create: {
          model: "Tesla Model 3",
          connector: "CCS2",
          rangeKm: 350,
          maxPowerKw: 170,
        },
      },
    },
  });

  console.log("Criando pontos de recarga...");

  const fluiBatel = await prisma.station.create({
    data: {
      name: "Flui Batel",
      address: "Av. do Batel, 1230",
      city: "Curitiba",
      state: "PR",
      latitude: -25.4411,
      longitude: -49.2877,
      isOpen24h: true,
      amenities: ["Café", "Wi-Fi", "Estacionamento", "Shopping"],
      chargers: {
        create: [
          {
            label: "Ponto 1",
            connector: "CCS2",
            powerKw: 150,
            status: "AVAILABLE",
          },
          {
            label: "Ponto 2",
            connector: "CCS2",
            powerKw: 150,
            status: "AVAILABLE",
          },
          {
            label: "Ponto 3",
            connector: "CHADEMO",
            powerKw: 50,
            status: "OCCUPIED",
          },
          {
            label: "Ponto 4",
            connector: "TYPE2",
            powerKw: 22,
            status: "AVAILABLE",
          },
        ],
      },
    },
  });

  const fluiAguaVerde = await prisma.station.create({
    data: {
      name: "Flui Água Verde",
      address: "R. Dep. Westphalen, 400",
      city: "Curitiba",
      state: "PR",
      latitude: -25.4513,
      longitude: -49.2766,
      isOpen24h: true,
      amenities: ["Wi-Fi", "Estacionamento", "Banheiro"],
      chargers: {
        create: [
          {
            label: "Ponto 1",
            connector: "CCS2",
            powerKw: 150,
            status: "AVAILABLE",
          },
          {
            label: "Ponto 2",
            connector: "CCS2",
            powerKw: 150,
            status: "AVAILABLE",
          },
          {
            label: "Ponto 3",
            connector: "TYPE2",
            powerKw: 22,
            status: "AVAILABLE",
          },
        ],
      },
    },
  });

  const fluiCentro = await prisma.station.create({
    data: {
      name: "Flui Centro",
      address: "R. XV de Novembro, 700",
      city: "Curitiba",
      state: "PR",
      latitude: -25.4297,
      longitude: -49.2719,
      isOpen24h: false,
      amenities: ["Café", "Shopping"],
      chargers: {
        create: [
          {
            label: "Ponto 1",
            connector: "CHADEMO",
            powerKw: 50,
            status: "OCCUPIED",
          },
          {
            label: "Ponto 2",
            connector: "CCS2",
            powerKw: 100,
            status: "AVAILABLE",
          },
        ],
      },
    },
  });

  await prisma.station.create({
  data: {
    name: "Flui Portão",
    address: "Av. República Argentina, 3300",
    city: "Curitiba",
    state: "PR",
    latitude: -25.4767,
    longitude: -49.2929,
    isOpen24h: true,
    amenities: ["Estacionamento"],
    chargers: {
      create: [
        {
          label: "Ponto 1",
          connector: "CCS2",
          powerKw: 150,
          status: "OFFLINE",
        },
        {
          label: "Ponto 2",
          connector: "CCS2",
          powerKw: 150,
          status: "OFFLINE",
        },
      ],
    },
  },
});

  console.log("Criando avaliações...");

  await prisma.review.createMany({
    data: [
      {
        rating: 5,
        comment: "Ponto impecável. Carregou meu Model 3 em menos de 20 minutos.",
        availabilityScore: 5,
        qualityScore: 5,
        amenitiesScore: 4,
        signageScore: 5,
        userId: driver.id,
        stationId: fluiBatel.id,
      },
      {
        rating: 4,
        comment: "Boa localização e carregadores rápidos.",
        availabilityScore: 4,
        qualityScore: 5,
        amenitiesScore: 4,
        signageScore: 4,
        userId: driver.id,
        stationId: fluiAguaVerde.id,
      },
      {
        rating: 3,
        comment: "Um dos pontos estava ocupado e a sinalização poderia melhorar.",
        availabilityScore: 3,
        qualityScore: 3,
        amenitiesScore: 4,
        signageScore: 2,
        userId: driver.id,
        stationId: fluiCentro.id,
      },
    ],
  });

  console.log("Criando favoritos e histórico...");

  await prisma.favorite.create({
    data: {
      userId: driver.id,
      stationId: fluiBatel.id,
    },
  });

  await prisma.chargingHistory.createMany({
    data: [
      {
        userId: driver.id,
        stationId: fluiBatel.id,
        kwh: 32,
        minutes: 22,
        cost: 48.9,
      },
      {
        userId: driver.id,
        stationId: fluiAguaVerde.id,
        kwh: 18,
        minutes: 14,
        cost: 28.5,
      },
    ],
  });

  console.log("Seed finalizado!");
  console.log("Admin:", admin.email, "senha: admin123");
  console.log("Motorista:", driver.email, "senha: 123456");
}

main()
  .catch((error) => {
    console.error("Erro no seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });