import { Request, Response } from "express";
import { AlunoRepository } from "../repositories/AlunoRepository";
import { NotFoundError } from "../helpers/api-errors";

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
