// src/app/api/charging-sessions/[id]/finish/route.ts
import { getTokenFromHeader, verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { error, success } from "@/lib/responses";

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
    const { id } = await context.params;

    if (payload.role !== "DRIVER") {
      return error("Apenas motoristas podem finalizar recargas.", 403);
    }

    const result = await prisma.$transaction(async (tx) => {
      const session = await tx.chargingSession.findUnique({
        where: {
          id,
        },
        include: {
          charger: true,
        },
      });

      if (!session) {
        throw new Error("Sessão de recarga não encontrada.");
      }

      if (session.userId !== payload.userId) {
        throw new Error("Você não pode finalizar esta recarga.");
      }

      if (session.status !== "ACTIVE") {
        throw new Error("Esta recarga já foi finalizada.");
      }

      const updatedSession = await tx.chargingSession.update({
        where: {
          id,
        },
        data: {
          status: "COMPLETED",
          finishedAt: new Date(),
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
      });

      await tx.charger.update({
        where: {
          id: session.chargerId,
        },
        data: {
          status: "AVAILABLE",
        },
      });

      return updatedSession;
    });

    return success(result);
  } catch (err) {
    console.error(err);

    if (err instanceof Error) {
      return error(err.message, 400);
    }

    return error("Erro ao finalizar recarga.", 500);
  }
}