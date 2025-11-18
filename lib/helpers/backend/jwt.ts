import jwt from "jsonwebtoken";

const { AUTH_SECRET } = process.env;

export function verifyToken(token: string): { userId: string } {
  return jwt.verify(token, AUTH_SECRET!) as { userId: string };
}

export function getSignedToken(payload: object): string {
  return jwt.sign(payload, AUTH_SECRET!, { expiresIn: "15m" });
}