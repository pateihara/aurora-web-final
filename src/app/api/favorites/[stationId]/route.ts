//src/app/api/favorites/[stationId]/route.ts
import { getTokenFromHeader, verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { error, success } from "@/lib/responses";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ stationId: string }> }
) {
  try {
    const token = getTokenFromHeader(request);

    if (!token) {
      return error("Token não enviado.", 401);
    }

    const payload = verifyToken(token);
    const { stationId } = await params;

    await prisma.favorite.delete({
      where: {
        userId_stationId: {
          userId: payload.userId,
          stationId,
        },
      },
    });

    return success({
      message: "Favorito removido com sucesso.",
    });
  } catch (err) {
    console.error(err);
    return error("Erro ao remover favorito.", 500);
  }
}