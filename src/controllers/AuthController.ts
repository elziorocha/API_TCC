import { Request, Response } from "express";
import { AlunoRepository } from "../repositories/AlunoRepository";
import { BadRequestError } from "../helpers/api-errors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

interface Login {
  email: string;
  senha: string;
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

    const token = jwt.sign({ id: alunoAuth.id }, process.env.JWT_PASS ?? "", {
      expiresIn: "6h",
    });

    const alunoAuthSemDados = {
      id: alunoAuth.id,
      email: alunoAuth.email,
    };

    res.json({
      alunoAuth: alunoAuthSemDados,
      token: token,
    });
  }

  async getAluno(req: Request, res: Response) {}
}
