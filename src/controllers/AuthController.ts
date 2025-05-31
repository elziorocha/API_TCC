import { Request, Response } from "express";
import { AlunoRepository } from "../repositories/AlunoRepository";
import { BadRequestError, UnauthorizedError } from "../helpers/api-errors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

interface Login {
  email: string;
  senha: string;
  id: number;
}

export class AuthController {
  async login(req: Request, res: Response) {
    const authData = req.body as Login;

    const alunoAuth = await AlunoRepository.findOneBy({
      email: authData.email,
    });

    if (!alunoAuth) {
      throw new BadRequestError("E-mail ou Senha inválidos.");
    }

    const verificarSenha = await bcrypt.compare(
      authData.senha,
      alunoAuth.senha
    );

    if (!verificarSenha) {
      throw new BadRequestError("E-mail ou Senha inválidos.");
    }

    const authToken = jwt.sign(
      { id: alunoAuth.id },
      process.env.JWT_PASS ?? "",
      {
        expiresIn: "6h",
      }
    );

    const alunoAuthSemDados = {
      id: alunoAuth.id,
      email: alunoAuth.email,
    };

    res.json({
      alunoAuth: alunoAuthSemDados,
      token: authToken,
    });
  }

  async getAluno(req: Request, res: Response) {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new UnauthorizedError("Não autorizado");
    }

    const acessoToken = authorization.split(" ")[1];

    const { id } = jwt.verify(acessoToken, process.env.JWT_PASS ?? "") as Login;

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

    res.json(alunoAuthSemDados);
  }
}
