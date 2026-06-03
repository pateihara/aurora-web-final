// src/app/api/reviews/route.ts
import { getTokenFromHeader, verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { error, success } from "@/lib/responses";

const SPARKS_PER_REVIEW = 30;

type CreateReviewBody = {
  stationId?: string;
  rating?: number;
  feeling?: string;
  comment?: string;
  availabilityScore?: number;
  qualityScore?: number;
  amenitiesScore?: number;
  signageScore?: number;
};

function parseScore(value: unknown, fallback: number) {
  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    return fallback;
  }

  return Math.min(Math.max(Math.round(numberValue), 1), 5);
}

export async function GET(request: Request) {
  try {
    const token = getTokenFromHeader(request);

    if (!token) {
      return error("Token não enviado.", 401);
    }

    const payload = verifyToken(token);

    if (payload.role !== "ADMIN") {
      return error("Apenas administradores podem visualizar avaliações.", 403);
    }

    const reviews = await prisma.review.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
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
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return success(reviews);
  } catch (err) {
    console.error(err);
    return error("Erro ao buscar avaliações.", 500);
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
      return error("Apenas motoristas podem enviar avaliações.", 403);
    }

    const body = (await request.json()) as CreateReviewBody;

    if (!body.stationId) {
      return error("Ponto de recarga não informado.", 400);
    }

    const station = await prisma.station.findUnique({
      where: {
        id: body.stationId,
      },
      select: {
        id: true,
      },
    });

    if (!station) {
      return error("Ponto de recarga não encontrado.", 404);
    }

    const availabilityScore = parseScore(body.availabilityScore, 4);
    const qualityScore = parseScore(body.qualityScore, 4);
    const amenitiesScore = parseScore(body.amenitiesScore, 4);
    const signageScore = parseScore(body.signageScore, 4);

    const averageRating =
      body.rating ??
      Math.round(
        (availabilityScore + qualityScore + amenitiesScore + signageScore) / 4,
      );

    const rating = parseScore(averageRating, 4);

    const result = await prisma.$transaction(async (tx) => {
      const review = await tx.review.create({
        data: {
          userId: payload.userId,
          stationId: body.stationId as string,
          rating,
          feeling: body.feeling ?? null,
          comment: body.comment?.trim() ? body.comment.trim() : null,
          availabilityScore,
          qualityScore,
          amenitiesScore,
          signageScore,
          sparksEarned: SPARKS_PER_REVIEW,
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
        },
      });

      const user = await tx.user.update({
        where: {
          id: payload.userId,
        },
        data: {
          sparks: {
            increment: SPARKS_PER_REVIEW,
          },
          reviewsCount: {
            increment: 1,
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          sparks: true,
          reviewsCount: true,
        },
      });

      return {
        review,
        user,
        sparksEarned: SPARKS_PER_REVIEW,
      };
    });

    return success(result);
  } catch (err) {
    console.error(err);
    return error("Erro ao enviar avaliação.", 500);
  }
}