import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface TokenPayload {
  id: number;
  iat: number;
  exp: number;
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401).json({ error: "Token não fornecido" });
    return;
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_PASS ?? ""
    ) as TokenPayload;
    req.alunoLogin = { id: decoded.id };
    return next();
  } catch (err) {
    res.status(401).json({ error: "Token inválido ou expirado" });
    return;
  }
}
