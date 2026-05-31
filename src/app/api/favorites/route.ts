//src/app/api/favorites/route.ts
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

    const favorites = await prisma.favorite.findMany({
      where: {
        userId: payload.userId,
      },
      include: {
        station: {
          include: {
            chargers: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return success(favorites);
  } catch (err) {
    console.error(err);
    return error("Erro ao buscar favoritos.", 500);
  }
}

export async function POST(request: Request) {
  try {
    const token = getTokenFromHeader(request);

    if (!token) {
      return error("Token não enviado.", 401);
    }

    const payload = verifyToken(token);
    const body = await request.json();

    const { stationId } = body;

    if (!stationId) {
      return error("stationId é obrigatório.", 400);
    }

    const favorite = await prisma.favorite.upsert({
      where: {
        userId_stationId: {
          userId: payload.userId,
          stationId,
        },
      },
      update: {},
      create: {
        userId: payload.userId,
        stationId,
      },
      include: {
        station: true,
      },
    });

    return success(favorite, 201);
  } catch (err) {
    console.error(err);
    return error("Erro ao favoritar ponto.", 500);
  }
}