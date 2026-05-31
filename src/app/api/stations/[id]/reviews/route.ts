//src/app/api/stations/[id]/reviews/route.ts
import { getTokenFromHeader, verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { error, success } from "@/lib/responses";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const reviews = await prisma.review.findMany({
      where: {
        stationId: id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getTokenFromHeader(request);

    if (!token) {
      return error("Token não enviado.", 401);
    }

    const payload = verifyToken(token);

    if (payload.role !== "DRIVER") {
      return error("Apenas motoristas podem avaliar pontos.", 403);
    }

    const { id } = await params;
    const body = await request.json();

    const {
      rating,
      comment,
      availabilityScore,
      qualityScore,
      amenitiesScore,
      signageScore,
    } = body;

    if (
      typeof rating !== "number" ||
      typeof availabilityScore !== "number" ||
      typeof qualityScore !== "number" ||
      typeof amenitiesScore !== "number" ||
      typeof signageScore !== "number"
    ) {
      return error("Notas inválidas.", 400);
    }

    const stationExists = await prisma.station.findUnique({
      where: { id },
    });

    if (!stationExists) {
      return error("Ponto não encontrado.", 404);
    }

    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        availabilityScore,
        qualityScore,
        amenitiesScore,
        signageScore,
        userId: payload.userId,
        stationId: id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return success(review, 201);
  } catch (err) {
    console.error(err);
    return error("Erro ao criar avaliação.", 500);
  }
}