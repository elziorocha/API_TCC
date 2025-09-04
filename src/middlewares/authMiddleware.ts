import { Request, Response, NextFunction } from "express";
import { TokenPayloadInterface } from "../helpers/interfaces.interface";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../helpers/api-errors";
import { AlunoRepository } from "../repositories";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new UnauthorizedError("Token não fornecido");
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_PASS ?? ""
    ) as TokenPayloadInterface;

    const aluno = await AlunoRepository.findOneBy({ id: decoded.id });

    switch (true) {
      case !aluno:
        throw new UnauthorizedError("Usuário não encontrado");

      case aluno?.tokenVersion !== decoded.tokenVersion:
        throw new UnauthorizedError("Token expirado ou inválido");
    }

    req.alunoLogin = { id: decoded.id };
    return next();

  } catch (err) {
    throw new UnauthorizedError("Token inválido ou expirado");
  }
}
