import { Request, Response } from "express";
import { AlunoRepository } from "../repositories/AlunoRepository";
import { BadRequestError, NotFoundError } from "../helpers/api-errors";

interface Aluno {
  email: string;
  senha: string;
  nome: string;
  telefone: string;
  data_nascimento: Date;
  criado_em: Date;
}

export class AlunoController {
  async list(req: Request, res: Response) {
    const { alunoId } = req.params;

    const buscarAluno = await AlunoRepository.findOne({
      where: {
        id: Number(alunoId),
      },
    });

    if (!buscarAluno) {
      throw new NotFoundError("Nenhum aluno encontrado.");
    }

    const { senha: _, ...alunoGetDataSemSenha } = buscarAluno;

    res.status(200).json(alunoGetDataSemSenha);
  }
}
