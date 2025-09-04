import { Request, Response } from "express";
import { BadRequestError } from "../helpers/api-errors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validate } from "class-validator";
import { Aluno as AlunoEntity } from "../entities/Aluno";
import {
  AlunoInterface,
  AlunoLoginInterface,
} from "../helpers/interfaces.interface";
import { AlunoRepository } from "../repositories";
import { plainToInstance } from "class-transformer";
import { ErrosValidacao } from "../helpers/error-validator";

export class AuthController {
  async create(
    req: Request<{ id: string }, any, AlunoInterface>,
    res: Response
  ) {
    const alunoData = req.body;

    const alunoInstancia = plainToInstance(AlunoEntity, {
      ...alunoData,
      data_nascimento: new Date(alunoData.data_nascimento)
    });

    const errosValidacao = await validate(alunoInstancia, { stopAtFirstError: false });

    if (errosValidacao.length > 0) {
      ErrosValidacao(errosValidacao, res);
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

    const { senha: _, id: __, ...alunoPostDataSemSenha } = novoAluno;

    res.status(201).json({
      aluno: alunoPostDataSemSenha,
      token: authToken,
    });

    return;
  }

  async login(req: Request<AlunoLoginInterface>, res: Response) {
    const authData = req.body;

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
