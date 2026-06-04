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

const vehicleSelect = {
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
};

const stationSelect = {
  id: true,
  name: true,
  address: true,
  city: true,
  state: true,
};

const chargerSelect = {
  id: true,
  label: true,
  connector: true,
  powerKw: true,
  status: true,
};

export async function GET(request: Request) {
  try {
    const token = getTokenFromHeader(request);

    if (!token) {
      return error("Token não enviado.", 401);
    }

    const payload = verifyToken(token);

    if (payload.role !== "DRIVER") {
      return error("Apenas motoristas podem consultar recargas.", 403);
    }

    const sessions = await prisma.chargingSession.findMany({
      where: {
        userId: payload.userId,
        status: "ACTIVE",
      },
      include: {
        vehicle: {
          select: vehicleSelect,
        },
        station: {
          select: stationSelect,
        },
        charger: {
          select: chargerSelect,
        },
      },
      orderBy: {
        startedAt: "desc",
      },
    });

    return success(sessions);
  } catch (err) {
    console.error(err);
    return error("Erro ao buscar recargas.", 500);
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
      return error("Apenas motoristas podem iniciar recargas.", 403);
    }

    const body = (await request.json()) as CreateChargingSessionBody;

    if (!body.stationId) {
      return error("Ponto de recarga não informado.", 400);
    }

    if (!body.chargerId) {
      return error("Terminal não informado.", 400);
    }

    const stationId = body.stationId;
    const chargerId = body.chargerId;
    const vehicleId = body.vehicleId;

    const selectedMinutes = Math.round(
      parsePositiveNumber(body.selectedMinutes, 60),
    );

    const pricePerMinute = parsePositiveNumber(body.pricePerMinute, 1.25);
    const estimatedCost = Number((selectedMinutes * pricePerMinute).toFixed(2));

    const result = await prisma.$transaction(async (tx) => {
      const charger = await tx.charger.findUnique({
        where: {
          id: chargerId,
        },
        include: {
          station: true,
        },
      });

      if (!charger) {
        throw new Error("Terminal não encontrado.");
      }

      if (charger.stationId !== stationId) {
        throw new Error("Terminal não pertence ao ponto selecionado.");
      }

      if (charger.status !== "AVAILABLE") {
        throw new Error("Este terminal não está disponível para uso.");
      }

      const vehicle = vehicleId
        ? await tx.vehicle.findFirst({
            where: {
              id: vehicleId,
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

      const activeVehicleSession = await tx.chargingSession.findFirst({
        where: {
          userId: payload.userId,
          vehicleId: vehicle.id,
          status: "ACTIVE",
        },
        include: {
          station: {
            select: {
              name: true,
            },
          },
        },
      });

      if (activeVehicleSession) {
        throw new Error(
          `Este veículo já está carregando em ${activeVehicleSession.station.name}. Escolha outro veículo.`,
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
          stationId,
          chargerId,
          selectedMinutes,
          pricePerMinute,
          estimatedCost,
          status: "ACTIVE",
        },
        include: {
          vehicle: {
            select: vehicleSelect,
          },
          station: {
            select: stationSelect,
          },
          charger: {
            select: chargerSelect,
          },
        },
      });

      await tx.charger.update({
        where: {
          id: chargerId,
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