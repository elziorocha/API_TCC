import { NextFunction, Response, Request } from "express";
import { UnauthorizedError } from "../helpers/api-errors";
import { AlunoRepository } from "../repositories/AlunoRepository";
import jwt from "jsonwebtoken";

interface JWTLogin {
  id: number;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const acessoToken = req.headers.authorization?.split(" ")[1];

  if (!acessoToken) {
    throw new UnauthorizedError("Não autorizado");
  }

  const { id } = jwt.verify(
    acessoToken,
    process.env.JWT_PASS ?? ""
  ) as JWTLogin;

  const alunoAuth = await AlunoRepository.findOneBy({
    id,
  });

  if (!alunoAuth) {
    throw new UnauthorizedError("Não autorizado");
  }

  const alunoAuthSemDados = {
    id: alunoAuth.id,
    email: alunoAuth.email,
  };

  req.aluno = alunoAuthSemDados;

  next();
};
