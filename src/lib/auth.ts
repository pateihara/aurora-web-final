//src/lib/auth.ts
import jwt from "jsonwebtoken";

type TokenPayload = {
  userId: string;
  role: "DRIVER" | "ADMIN";
};

export function signToken(payload: TokenPayload) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET não configurado.");
  }

  return jwt.sign(payload, secret, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET não configurado.");
  }

  return jwt.verify(token, secret) as TokenPayload;
}

export function getTokenFromHeader(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return null;
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    return null;
  }

  return token;
}