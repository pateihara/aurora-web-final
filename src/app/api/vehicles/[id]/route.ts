// src/app/api/vehicles/[id]/route.ts
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

async function getVehicleForUser(vehicleId: string, userId: string) {
  return prisma.vehicle.findFirst({
    where: {
      id: vehicleId,
      userId,
    },
  });
}

export async function GET(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    const token = getTokenFromHeader(request);

    if (!token) {
      return error("Token não enviado.", 401);
    }

    const payload = verifyToken(token);
    const { id } = await context.params;

    const vehicle = await getVehicleForUser(id, payload.userId);

    if (!vehicle) {
      return error("Veículo não encontrado.", 404);
    }

    return success(vehicle);
  } catch (err) {
    console.error(err);
    return error("Erro ao buscar veículo.", 500);
  }
}

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    const token = getTokenFromHeader(request);

    if (!token) {
      return error("Token não enviado.", 401);
    }

    const payload = verifyToken(token);

    if (payload.role !== "DRIVER") {
      return error("Apenas motoristas podem alterar veículos.", 403);
    }

    const { id } = await context.params;
    const body = (await request.json()) as VehicleBody;

    const existingVehicle = await getVehicleForUser(id, payload.userId);

    if (!existingVehicle) {
      return error("Veículo não encontrado.", 404);
    }

    const shouldBeActive = Boolean(body.isActive);

    const vehicle = await prisma.$transaction(async (tx) => {
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

      return tx.vehicle.update({
        where: {
          id,
        },
        data: {
          nickname: body.nickname?.trim() ?? existingVehicle.nickname,
          brand: body.brand?.trim() ?? existingVehicle.brand,
          model: body.model?.trim() ?? existingVehicle.model,
          year: body.year?.trim() ?? existingVehicle.year,
          plate:
            body.plate?.trim().toUpperCase().replace(/\s/g, "") ??
            existingVehicle.plate,
          type: body.type ?? existingVehicle.type,
          connector: body.connector ?? existingVehicle.connector,
          batteryCapacityKwh:
            body.batteryCapacityKwh !== undefined
              ? toNumber(
                  body.batteryCapacityKwh,
                  existingVehicle.batteryCapacityKwh,
                )
              : existingVehicle.batteryCapacityKwh,
          currentBatteryPercent:
            body.currentBatteryPercent !== undefined
              ? Math.min(
                  Math.max(
                    Math.round(
                      toNumber(
                        body.currentBatteryPercent,
                        existingVehicle.currentBatteryPercent,
                      ),
                    ),
                    0,
                  ),
                  100,
                )
              : existingVehicle.currentBatteryPercent,
          rangeKm:
            body.rangeKm !== undefined
              ? Math.round(toNumber(body.rangeKm, existingVehicle.rangeKm))
              : existingVehicle.rangeKm,
          maxPowerKw:
            body.maxPowerKw !== undefined
              ? Math.round(toNumber(body.maxPowerKw, existingVehicle.maxPowerKw))
              : existingVehicle.maxPowerKw,
          isActive: shouldBeActive ? true : existingVehicle.isActive,
        },
      });
    });

    return success(vehicle);
  } catch (err) {
    console.error(err);
    return error("Erro ao alterar veículo.", 500);
  }
}

export async function DELETE(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    const token = getTokenFromHeader(request);

    if (!token) {
      return error("Token não enviado.", 401);
    }

    const payload = verifyToken(token);

    if (payload.role !== "DRIVER") {
      return error("Apenas motoristas podem excluir veículos.", 403);
    }

    const { id } = await context.params;

    const existingVehicle = await getVehicleForUser(id, payload.userId);

    if (!existingVehicle) {
      return error("Veículo não encontrado.", 404);
    }

    const vehiclesCount = await prisma.vehicle.count({
      where: {
        userId: payload.userId,
      },
    });

    if (vehiclesCount <= 1) {
      return error("Você precisa manter pelo menos um veículo cadastrado.", 400);
    }

    await prisma.$transaction(async (tx) => {
      await tx.vehicle.delete({
        where: {
          id,
        },
      });

      if (existingVehicle.isActive) {
        const nextVehicle = await tx.vehicle.findFirst({
          where: {
            userId: payload.userId,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        if (nextVehicle) {
          await tx.vehicle.update({
            where: {
              id: nextVehicle.id,
            },
            data: {
              isActive: true,
            },
          });
        }
      }
    });

    return success({
      deleted: true,
    });
  } catch (err) {
    console.error(err);
    return error("Erro ao excluir veículo.", 500);
  }
}