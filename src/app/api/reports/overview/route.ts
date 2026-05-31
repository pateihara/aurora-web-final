//src/app/api/reports/overview/route.ts
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
      return error("Apenas administradores podem acessar relatórios.", 403);
    }

    const [
      totalUsers,
      totalStations,
      totalChargers,
      availableChargers,
      occupiedChargers,
      offlineChargers,
      totalReviews,
      reviews,
      totalChargingHistory,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.station.count(),
      prisma.charger.count(),
      prisma.charger.count({ where: { status: "AVAILABLE" } }),
      prisma.charger.count({ where: { status: "OCCUPIED" } }),
      prisma.charger.count({ where: { status: "OFFLINE" } }),
      prisma.review.count(),
      prisma.review.findMany({
        select: {
          rating: true,
        },
      }),
      prisma.chargingHistory.count(),
    ]);

    const ratingAverage =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;

    return success({
      totalUsers,
      totalStations,
      totalChargers,
      availableChargers,
      occupiedChargers,
      offlineChargers,
      totalReviews,
      totalChargingHistory,
      ratingAverage: Number(ratingAverage.toFixed(1)),
    });
  } catch (err) {
    console.error(err);
    return error("Erro ao gerar relatório.", 500);
  }
}