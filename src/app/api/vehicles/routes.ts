//src/app/api/vehicles/route.ts
import { getTokenFromHeader, verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { error, success } from "@/lib/responses";

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
      orderBy: {
        createdAt: "desc",
      },
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

    const body = await request.json();

    const { model, connector, rangeKm, maxPowerKw } = body;

    if (!model || !connector || !rangeKm || !maxPowerKw) {
      return error("Dados do veículo incompletos.", 400);
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        model,
        connector,
        rangeKm,
        maxPowerKw,
        userId: payload.userId,
      },
    });

    return success(vehicle, 201);
  } catch (err) {
    console.error(err);
    return error("Erro ao cadastrar veículo.", 500);
  }
}