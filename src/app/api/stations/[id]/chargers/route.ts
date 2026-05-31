//src/app/api/stations/[id]/chargers/route.ts
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

    if (payload.role !== "ADMIN") {
      return error("Apenas administradores podem criar carregadores.", 403);
    }

    const { id } = await params;
    const body = await request.json();

    const { label, connector, powerKw, status } = body as {
      label?: string;
      connector?: ConnectorType;
      powerKw?: number;
      status?: ChargerStatus;
    };

    if (!label || !connector || !powerKw) {
      return error("Nome, conector e potência são obrigatórios.", 400);
    }

    if (!validConnectors.includes(connector)) {
      return error("Conector inválido.", 400);
    }

    if (status && !validStatuses.includes(status)) {
      return error("Status inválido.", 400);
    }

    const stationExists = await prisma.station.findUnique({
      where: {
        id,
      },
    });

    if (!stationExists) {
      return error("Ponto não encontrado.", 404);
    }

    const charger = await prisma.charger.create({
      data: {
        label,
        connector,
        powerKw,
        status: status ?? "AVAILABLE",
        stationId: id,
      },
    });

    return success(charger, 201);
  } catch (err) {
    console.error(err);
    return error("Erro ao criar carregador.", 500);
  }
}