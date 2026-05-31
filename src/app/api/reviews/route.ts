//src/app/api/reviews/route.ts
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