//src/app/api/users/route.ts
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
      return error("Apenas administradores podem visualizar usuários.", 403);
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        vehicles: {
          select: {
            id: true,
            model: true,
            connector: true,
            rangeKm: true,
            maxPowerKw: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            createdAt: true,
            station: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        chargingHistory: {
          select: {
            id: true,
            kwh: true,
            minutes: true,
            cost: true,
            createdAt: true,
            station: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        favorites: {
          select: {
            id: true,
            station: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedUsers = users.map((user) => {
      const totalReviews = user.reviews.length;
      const totalCharges = user.chargingHistory.length;
      const totalKwh = user.chargingHistory.reduce(
        (sum, charge) => sum + charge.kwh,
        0
      );
      const totalSpent = user.chargingHistory.reduce(
        (sum, charge) => sum + charge.cost,
        0
      );

      const averageRating =
        totalReviews > 0
          ? user.reviews.reduce((sum, review) => sum + review.rating, 0) /
            totalReviews
          : 0;

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        vehicles: user.vehicles,
        reviews: user.reviews,
        chargingHistory: user.chargingHistory,
        favorites: user.favorites,
        totalReviews,
        totalCharges,
        totalKwh: Number(totalKwh.toFixed(1)),
        totalSpent: Number(totalSpent.toFixed(2)),
        totalFavorites: user.favorites.length,
        averageRating: Number(averageRating.toFixed(1)),
      };
    });

    return success(formattedUsers);
  } catch (err) {
    console.error(err);
    return error("Erro ao buscar usuários.", 500);
  }
}