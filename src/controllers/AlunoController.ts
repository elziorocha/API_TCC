import { Request, Response } from "express";
import { AlunoRepository } from "../repositories/AlunoRepository";
import { BadRequestError, NotFoundError } from "../helpers/api-errors";
import bcrypt from "bcrypt";

interface Aluno {
  email: string;
  senha: string;
  nome: string;
  telefone: string;
  data_nascimento: Date;
  criado_em: Date;
}

export class AlunoController {
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

    const { senha: _, ...alunoDataSemSenha } = novoAluno;

    res.status(201).json(alunoDataSemSenha);
    return;
  }

  async list(req: Request, res: Response) {
    const buscarAluno = await AlunoRepository.find();

    if (buscarAluno.length === 0) {
      throw new NotFoundError("Nenhum aluno encontrado.");
    }

    res.status(200).json(buscarAluno);
  }
}
