// src/app/api/auth/me/route.ts
import { getTokenFromHeader, verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { error, success } from "@/lib/responses";

export async function GET(request: Request) {
  const token = getTokenFromHeader(request);

  if (!token) {
    return error("Token não enviado.", 401);
  }

  let payload: {
    userId: string;
    role: "DRIVER" | "ADMIN";
  };

  try {
    payload = verifyToken(token);
  } catch (err) {
    console.error("Erro ao validar token:", err);
    return error("Token inválido.", 401);
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        sparks: true,
        reviewsCount: true,
        createdAt: true,
      },
    });

    if (!user) {
      return error("Usuário não encontrado.", 404);
    }

    return success(user);
  } catch (err) {
    console.error("Erro ao buscar usuário no /auth/me:", err);
    return error("Erro ao buscar usuário.", 500);
  }
}