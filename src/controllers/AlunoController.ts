import { Request, Response } from "express";
import { NotFoundError } from "../helpers/api-errors";
import { AlunoRepository } from "../repositories";

export class AlunoController {
  async list(req: Request, res: Response) {
    const alunoId = req.alunoLogin?.id;

    if (!alunoId) {
      throw new NotFoundError("Aluno não autenticado.");
    }

    const aluno = await AlunoRepository.findOne({
      where: { id: alunoId },
      relations: ["aluno_documento", "aluno_endereco", "aluno_responsavel"],
    });

    if (!aluno) {
      throw new NotFoundError("Aluno não encontrado.");
    }

    const { id: _, senha: __, ...alunoSemSenha } = aluno;
    res.status(200).json(alunoSemSenha);
  }
}
