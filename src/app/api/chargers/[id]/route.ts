//src/app/api/chargers/[id]/route.ts
import { getTokenFromHeader, verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { error, success } from "@/lib/responses";

type ConnectorType = "CCS2" | "CHADEMO" | "TYPE2" | "AC" | "GBT";

type ChargerStatus = "AVAILABLE" | "OCCUPIED" | "OFFLINE" | "MAINTENANCE";

const validConnectors: ConnectorType[] = ["CCS2", "CHADEMO", "TYPE2", "AC", "GBT"];

const validStatuses: ChargerStatus[] = [
  "AVAILABLE",
  "OCCUPIED",
  "OFFLINE",
  "MAINTENANCE",
];

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
      return error("Apenas administradores podem atualizar carregadores.", 403);
    }

    const { id } = await params;
    const body = await request.json();

    const { label, connector, powerKw, status } = body as {
      label?: string;
      connector?: ConnectorType;
      powerKw?: number;
      status?: ChargerStatus;
    };

    if (connector && !validConnectors.includes(connector)) {
      return error("Conector inválido.", 400);
    }

    if (status && !validStatuses.includes(status)) {
      return error("Status inválido.", 400);
    }

    const chargerExists = await prisma.charger.findUnique({
      where: {
        id,
      },
    });

    if (!chargerExists) {
      return error("Carregador não encontrado.", 404);
    }

    const charger = await prisma.charger.update({
      where: {
        id,
      },
      data: {
        label,
        connector,
        powerKw,
        status,
      },
      include: {
        station: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return success(charger);
  } catch (err) {
    console.error(err);
    return error("Erro ao atualizar carregador.", 500);
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
      return error("Apenas administradores podem remover carregadores.", 403);
    }

    const { id } = await params;

    const chargerExists = await prisma.charger.findUnique({
      where: {
        id,
      },
    });

    if (!chargerExists) {
      return error("Carregador não encontrado.", 404);
    }

    await prisma.charger.delete({
      where: {
        id,
      },
    });

    return success({
      message: "Carregador removido com sucesso.",
    });
  } catch (err) {
    console.error(err);
    return error("Erro ao remover carregador.", 500);
  }
}