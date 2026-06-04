// src/app/api/charging-sessions/route.ts
import { getTokenFromHeader, verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { error, success } from "@/lib/responses";

type CreateChargingSessionBody = {
  stationId?: string;
  chargerId?: string;
  vehicleId?: string;
  selectedMinutes?: number;
  pricePerMinute?: number;
};

function parsePositiveNumber(value: unknown, fallback: number) {
  const parsed = Number(value);

  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

export async function POST(request: Request) {
  try {
    const token = getTokenFromHeader(request);

    if (!token) {
      return error("Token não enviado.", 401);
    }

    const payload = verifyToken(token);

    if (payload.role !== "DRIVER") {
      return error("Apenas motoristas podem iniciar recargas.", 403);
    }

    const body = (await request.json()) as CreateChargingSessionBody;

    if (!body.stationId) {
      return error("Ponto de recarga não informado.", 400);
    }

    if (!body.chargerId) {
      return error("Terminal não informado.", 400);
    }

    const selectedMinutes = Math.round(
      parsePositiveNumber(body.selectedMinutes, 60),
    );

    const pricePerMinute = parsePositiveNumber(body.pricePerMinute, 1.25);
    const estimatedCost = Number((selectedMinutes * pricePerMinute).toFixed(2));

    const result = await prisma.$transaction(async (tx) => {
      const activeSession = await tx.chargingSession.findFirst({
        where: {
          userId: payload.userId,
          status: "ACTIVE",
        },
      });

      if (activeSession) {
        throw new Error("Você já possui uma recarga ativa.");
      }

      const charger = await tx.charger.findUnique({
        where: {
          id: body.chargerId,
        },
        include: {
          station: true,
        },
      });

      if (!charger) {
        throw new Error("Terminal não encontrado.");
      }

      if (charger.stationId !== body.stationId) {
        throw new Error("Terminal não pertence ao ponto selecionado.");
      }

      if (charger.status !== "AVAILABLE") {
        throw new Error("Este terminal não está disponível para uso.");
      }

      const vehicle = body.vehicleId
        ? await tx.vehicle.findFirst({
            where: {
              id: body.vehicleId,
              userId: payload.userId,
            },
          })
        : await tx.vehicle.findFirst({
            where: {
              userId: payload.userId,
              isActive: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          });

      if (!vehicle) {
        throw new Error(
          "Nenhum veículo encontrado. Cadastre ou selecione um veículo antes de iniciar a recarga.",
        );
      }

      if (vehicle.connector !== charger.connector) {
        throw new Error(
          `Este terminal usa ${charger.connector}, mas o veículo selecionado usa ${vehicle.connector}. Escolha outro terminal ou outro veículo.`,
        );
      }

      const session = await tx.chargingSession.create({
        data: {
          userId: payload.userId,
          vehicleId: vehicle.id,
          stationId: body.stationId as string,
          chargerId: body.chargerId as string,
          selectedMinutes,
          pricePerMinute,
          estimatedCost,
          status: "ACTIVE",
        },
        include: {
          vehicle: {
            select: {
              id: true,
              nickname: true,
              brand: true,
              model: true,
              year: true,
              plate: true,
              type: true,
              connector: true,
              batteryCapacityKwh: true,
              currentBatteryPercent: true,
              rangeKm: true,
              maxPowerKw: true,
              isActive: true,
            },
          },
          station: {
            select: {
              id: true,
              name: true,
              address: true,
              city: true,
              state: true,
            },
          },
          charger: {
            select: {
              id: true,
              label: true,
              connector: true,
              powerKw: true,
              status: true,
            },
          },
        },
      });

      await tx.charger.update({
        where: {
          id: body.chargerId,
        },
        data: {
          status: "OCCUPIED",
        },
      });

      return session;
    });

    return success(result, 201);
  } catch (err) {
    console.error(err);

    if (err instanceof Error) {
      return error(err.message, 400);
    }

    return error("Erro ao iniciar recarga.", 500);
  }
}