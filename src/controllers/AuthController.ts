import { Request, Response } from "express";
import { AlunoRepository } from "../repositories/AlunoRepository";
import { BadRequestError } from "../helpers/api-errors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

interface AlunoLogin {
  email: string;
  senha: string;
  id: number;
}

interface Aluno {
  email: string;
  senha: string;
  nome: string;
  telefone: string;
  data_nascimento: Date;
  criado_em: Date;
}

export class AuthController {
  async create(req: Request, res: Response) {
    const alunoData = req.body as Aluno;
  
    const [emailExistente, telefoneExistente] = await Promise.all([
      AlunoRepository.findOneBy({ email: alunoData.email }),
      AlunoRepository.findOneBy({ telefone: alunoData.telefone }),
    ]);
  
    if (emailExistente) {
      throw new BadRequestError("Email já cadastrado no sistema.");
    }
    if (telefoneExistente) {
      throw new BadRequestError("Telefone já cadastrado no sistema.");
    }
  
    const senhaCriptografada = await bcrypt.hash(alunoData.senha, 10);
  
    const novoAluno = AlunoRepository.create({
      ...alunoData,
      senha: senhaCriptografada,
    });
    await AlunoRepository.save(novoAluno);
  
    const authToken = jwt.sign(
      { id: novoAluno.id },
        process.env.JWT_PASS ?? "",
      {
        expiresIn: "6h",
      }
    );
  
    const { senha: _, ...alunoPostDataSemSenha } = novoAluno;
  
    res.status(201).json({
      aluno: alunoPostDataSemSenha,
      token: authToken,
    });
    
    return;
  }

  async login(req: Request, res: Response) {
    const authData = req.body as AlunoLogin;

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

    res.status(201).json({
      alunoAuth: alunoAuthSemDados,
      token: authToken,
    });
  }

  async getAluno(req: Request, res: Response) {
    res.json(req.alunoLogin);
  }
}
