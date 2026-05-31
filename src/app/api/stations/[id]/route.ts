//src/app/api/stations/[id]/route.ts
import { getTokenFromHeader, verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { error, success } from "@/lib/responses";

type StationUpdateBody = {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
  isOpen24h?: boolean;
  amenities?: string[];
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const station = await prisma.station.findUnique({
      where: { id },
      include: {
        chargers: {
          orderBy: {
            createdAt: "asc",
          },
        },
        reviews: {
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
        },
      },
    });

    if (!station) {
      return error("Ponto não encontrado.", 404);
    }

    const totalReviews = station.reviews.length;

    const ratingAverage =
      totalReviews > 0
        ? station.reviews.reduce((sum, review) => sum + review.rating, 0) /
          totalReviews
        : 0;

    const availableChargers = station.chargers.filter(
      (charger) => charger.status === "AVAILABLE"
    ).length;

    return success({
      ...station,
      totalReviews,
      ratingAverage: Number(ratingAverage.toFixed(1)),
      availableChargers,
      totalChargers: station.chargers.length,
    });
  } catch (err) {
    console.error(err);
    return error("Erro ao buscar ponto.", 500);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getTokenFromHeader(request);

    if (!token) {
      return error("Token não enviado.", 401);
    }

    const payload = verifyToken(token);

    if (payload.role !== "ADMIN") {
      return error("Apenas administradores podem editar pontos.", 403);
    }

    const { id } = await params;
    const body = (await request.json()) as StationUpdateBody;

    const stationExists = await prisma.station.findUnique({
      where: {
        id,
      },
    });

    if (!stationExists) {
      return error("Ponto não encontrado.", 404);
    }

    const station = await prisma.station.update({
      where: {
        id,
      },
      data: {
        name: body.name,
        address: body.address,
        city: body.city,
        state: body.state,
        latitude: body.latitude,
        longitude: body.longitude,
        isOpen24h: body.isOpen24h,
        amenities: body.amenities,
      },
      include: {
        chargers: {
          orderBy: {
            createdAt: "asc",
          },
        },
        reviews: {
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
        },
      },
    });

    const totalReviews = station.reviews.length;

    const ratingAverage =
      totalReviews > 0
        ? station.reviews.reduce((sum, review) => sum + review.rating, 0) /
          totalReviews
        : 0;

    const availableChargers = station.chargers.filter(
      (charger) => charger.status === "AVAILABLE"
    ).length;

    return success({
      ...station,
      totalReviews,
      ratingAverage: Number(ratingAverage.toFixed(1)),
      availableChargers,
      totalChargers: station.chargers.length,
    });
  } catch (err) {
    console.error(err);
    return error("Erro ao atualizar ponto.", 500);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getTokenFromHeader(request);

    if (!token) {
      return error("Token não enviado.", 401);
    }

    const payload = verifyToken(token);

    if (payload.role !== "ADMIN") {
      return error("Apenas administradores podem excluir pontos.", 403);
    }

    const { id } = await params;

    const stationExists = await prisma.station.findUnique({
      where: {
        id,
      },
    });

    if (!stationExists) {
      return error("Ponto não encontrado.", 404);
    }

    await prisma.station.delete({
      where: {
        id,
      },
    });

    return success({
      message: "Ponto excluído com sucesso.",
    });
  } catch (err) {
    console.error(err);
    return error("Erro ao excluir ponto.", 500);
  }
}