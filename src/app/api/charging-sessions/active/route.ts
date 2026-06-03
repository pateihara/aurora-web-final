// src/app/api/charging-sessions/active/route.ts
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

    if (payload.role !== "DRIVER") {
      return error("Apenas motoristas podem consultar recargas ativas.", 403);
    }

    const activeSession = await prisma.chargingSession.findFirst({
      where: {
        userId: payload.userId,
        status: "ACTIVE",
      },
      include: {
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
      orderBy: {
        startedAt: "desc",
      },
    });

    return success(activeSession);
  } catch (err) {
    console.error(err);
    return error("Erro ao buscar recarga ativa.", 500);
  }
}