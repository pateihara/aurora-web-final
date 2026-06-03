//src/app/api/auth/me/route.ts
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

    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        vehicles: true,
        sparks: true,
        reviewsCount: true,
      },
    });

    if (!user) {
      return error("Usuário não encontrado.", 404);
    }

    return success(user);
  } catch (err) {
    console.error(err);
    return error("Token inválido.", 401);
  }
}