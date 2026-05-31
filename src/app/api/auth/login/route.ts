//src/app/api/auth/login/route.ts
import { signToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { error, success } from "@/lib/responses";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { email, password } = body;

    if (!email || !password) {
      return error("E-mail e senha são obrigatórios.", 400);
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return error("Credenciais inválidas.", 401);
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return error("Credenciais inválidas.", 401);
    }

    const token = signToken({
      userId: user.id,
      role: user.role,
    });

    return success({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    return error("Erro ao fazer login.", 500);
  }
}