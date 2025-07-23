import { Request, Response } from "express";
import { AlunoRepository } from "../repositories/AlunoRepository";
import { BadRequestError } from "../helpers/api-errors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validate } from "class-validator";
import { Aluno as AlunoEntity } from "../entities/Aluno";

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

    const validacaoAluno = new AlunoEntity();
    validacaoAluno.email = alunoData.email;
    validacaoAluno.senha = alunoData.senha;
    validacaoAluno.nome = alunoData.nome;
    validacaoAluno.telefone = alunoData.telefone;
    validacaoAluno.data_nascimento = new Date(alunoData.data_nascimento);

    const erroValidacao = await validate(validacaoAluno);
    if (erroValidacao.length > 0) {
      const mensagensErro = erroValidacao
        .map((err) => Object.values(err.constraints ?? {}))
        .flat();
      res.status(400).json({ errors: mensagensErro });
      return;
    }

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
