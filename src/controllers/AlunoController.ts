import { Request, Response } from "express";
import { AlunoRepository } from "../repositories/AlunoRepository";
import { NotFoundError, UnprocessableEntityError } from "../helpers/api-errors";

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

    const requiredFields: (keyof Aluno)[] = [
      "email",
      "senha",
      "nome",
      "telefone",
      "data_nascimento",
      "criado_em",
    ];
    for (const field of requiredFields) {
      if (!alunoData[field]) {
        throw new UnprocessableEntityError(`Campo ${field} ausente.`);
      }
    }

    const novoAluno = AlunoRepository.create(alunoData);
    await AlunoRepository.save(novoAluno);

    res.status(201).json(novoAluno);
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
