//src/app/api/chargers/[id]/finish-session/route.ts
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

type JwtPayload = {
  userId: string;
  role: "ADMIN" | "DRIVER";
};

function getUserFromRequest(request: NextRequest): JwtPayload | null {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.replace("Bearer ", "");
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET não configurado.");
    }

    return jwt.verify(token, secret) as JwtPayload;
  } catch {
    return null;
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = getUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { message: "Usuário não autenticado." },
        { status: 401 },
      );
    }

    if (user.role !== "DRIVER" && user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Usuário sem permissão para finalizar recarga." },
        { status: 403 },
      );
    }

    const { id } = await params;

    const charger = await prisma.charger.findUnique({
      where: { id },
    });

    if (!charger) {
      return NextResponse.json(
        { message: "Carregador não encontrado." },
        { status: 404 },
      );
    }

    if (charger.status !== "OCCUPIED") {
      return NextResponse.json(
        {
          message:
            "Este terminal não está ocupado. Não há recarga ativa para finalizar.",
        },
        { status: 400 },
      );
    }

    const updatedCharger = await prisma.charger.update({
      where: { id },
      data: {
        status: "AVAILABLE",
      },
    });

    return NextResponse.json({
      message: "Recarga finalizada. Cabo liberado e terminal disponível.",
      charger: updatedCharger,
    });
  } catch (error) {
    console.error("Erro ao finalizar recarga:", error);

    return NextResponse.json(
      { message: "Erro interno ao finalizar recarga." },
      { status: 500 },
    );
  }
}