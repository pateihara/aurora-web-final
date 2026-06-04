// src/app/api/vehicles/route.ts
import { getTokenFromHeader, verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { error, success } from "@/lib/responses";

type VehicleBody = {
  nickname?: string;
  brand?: string;
  model?: string;
  year?: string;
  plate?: string;
  type?: "EV" | "PHEV";
  connector?: "CCS2" | "CHADEMO" | "TYPE2" | "AC" | "GBT";
  batteryCapacityKwh?: number;
  currentBatteryPercent?: number;
  rangeKm?: number;
  maxPowerKw?: number;
  isActive?: boolean;
};

function toNumber(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
}

export async function GET(request: Request) {
  try {
    const token = getTokenFromHeader(request);

    if (!token) {
      return error("Token não enviado.", 401);
    }

    const payload = verifyToken(token);

    const vehicles = await prisma.vehicle.findMany({
      where: {
        userId: payload.userId,
      },
      orderBy: [
        {
          isActive: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
    });

    return success(vehicles);
  } catch (err) {
    console.error(err);
    return error("Erro ao buscar veículos.", 500);
  }
}

export async function POST(request: Request) {
  try {
    const token = getTokenFromHeader(request);

    if (!token) {
      return error("Token não enviado.", 401);
    }

    const payload = verifyToken(token);

    if (payload.role !== "DRIVER") {
      return error("Apenas motoristas podem cadastrar veículos.", 403);
    }

    const body = (await request.json()) as VehicleBody;

    const nickname = body.nickname?.trim() || "Meu veículo";
    const brand = body.brand?.trim() || "Outro";
    const model = body.model?.trim();
    const year = body.year?.trim() || "2023";
    const plate = body.plate?.trim().toUpperCase().replace(/\s/g, "");
    const type = body.type ?? "EV";
    const connector = body.connector;
    const batteryCapacityKwh = toNumber(body.batteryCapacityKwh, 75);
    const currentBatteryPercent = Math.min(
      Math.max(Math.round(toNumber(body.currentBatteryPercent, 80)), 0),
      100,
    );
    const rangeKm = Math.round(toNumber(body.rangeKm, 0));
    const maxPowerKw = Math.round(toNumber(body.maxPowerKw, 0));
    const requestedActive = Boolean(body.isActive);

    if (!model || !plate || !connector || rangeKm <= 0 || maxPowerKw <= 0) {
      return error("Dados do veículo incompletos.", 400);
    }

    const vehicle = await prisma.$transaction(async (tx) => {
      const vehiclesCount = await tx.vehicle.count({
        where: {
          userId: payload.userId,
        },
      });

      const shouldBeActive = requestedActive || vehiclesCount === 0;

      if (shouldBeActive) {
        await tx.vehicle.updateMany({
          where: {
            userId: payload.userId,
          },
          data: {
            isActive: false,
          },
        });
      }

      return tx.vehicle.create({
        data: {
          nickname,
          brand,
          model,
          year,
          plate,
          type,
          connector,
          batteryCapacityKwh,
          currentBatteryPercent,
          rangeKm,
          maxPowerKw,
          isActive: shouldBeActive,
          userId: payload.userId,
        },
      });
    });

    return success(vehicle, 201);
  } catch (err) {
    console.error(err);
    return error("Erro ao cadastrar veículo.", 500);
  }
}