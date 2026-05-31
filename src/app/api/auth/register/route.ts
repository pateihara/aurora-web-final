//src/app/api/auth/register/route.ts
import { prisma } from "@/lib/prisma";
import { error, success } from "@/lib/responses";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, email, password, role } = body;

    if (!name || !email || !password) {
      return error("Nome, e-mail e senha são obrigatórios.", 400);
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return error("E-mail já cadastrado.", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role === "ADMIN" ? "ADMIN" : "DRIVER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return success(user, 201);
  } catch (err) {
    console.error(err);
    return error("Erro ao cadastrar usuário.", 500);
  }
}