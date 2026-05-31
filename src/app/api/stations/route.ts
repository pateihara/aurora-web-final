//src/app/api/stations/route.ts
import { getTokenFromHeader, verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { error, success } from "@/lib/responses";

type ChargerInput = {
  label: string;
  connector: "CCS2" | "CHADEMO" | "TYPE2" | "AC" | "GBT";
  powerKw: number;
  status?: "AVAILABLE" | "OCCUPIED" | "OFFLINE" | "MAINTENANCE";
};

export async function GET() {
  try {
    const stations = await prisma.station.findMany({
      include: {
        chargers: true,
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    const formattedStations = stations.map((station) => {
      const totalReviews = station.reviews.length;

      const ratingAverage =
        totalReviews > 0
          ? station.reviews.reduce((sum, review) => sum + review.rating, 0) /
            totalReviews
          : 0;

      const availableChargers = station.chargers.filter(
        (charger) => charger.status === "AVAILABLE"
      ).length;

      return {
        id: station.id,
        name: station.name,
        address: station.address,
        city: station.city,
        state: station.state,
        latitude: station.latitude,
        longitude: station.longitude,
        isOpen24h: station.isOpen24h,
        amenities: station.amenities,
        chargers: station.chargers,
        totalChargers: station.chargers.length,
        availableChargers,
        totalReviews,
        ratingAverage: Number(ratingAverage.toFixed(1)),
        createdAt: station.createdAt,
        updatedAt: station.updatedAt,
      };
    });

    return success(formattedStations);
  } catch (err) {
    console.error(err);
    return error("Erro ao buscar pontos.", 500);
  }
}

export async function POST(request: Request) {
  try {
    const token = getTokenFromHeader(request);

    if (!token) {
      return error("Token não enviado.", 401);
    }

    const payload = verifyToken(token);

    if (payload.role !== "ADMIN") {
      return error("Apenas administradores podem criar pontos.", 403);
    }

    const body = await request.json();

    const {
      name,
      address,
      city,
      state,
      latitude,
      longitude,
      isOpen24h,
      amenities,
      chargers,
    } = body;

    if (!name || !address || !city || !state) {
      return error("Nome, endereço, cidade e estado são obrigatórios.", 400);
    }

    if (typeof latitude !== "number" || typeof longitude !== "number") {
      return error("Latitude e longitude devem ser números.", 400);
    }

    const station = await prisma.station.create({
      data: {
        name,
        address,
        city,
        state,
        latitude,
        longitude,
        isOpen24h: isOpen24h ?? true,
        amenities: amenities ?? [],
        chargers: {
          create:
            chargers?.map((charger: ChargerInput) => ({
              label: charger.label,
              connector: charger.connector,
              powerKw: charger.powerKw,
              status: charger.status ?? "AVAILABLE",
            })) ?? [],
        },
      },
      include: {
        chargers: true,
      },
    });

    return success(station, 201);
  } catch (err) {
    console.error(err);
    return error("Erro ao criar ponto.", 500);
  }
}