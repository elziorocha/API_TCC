import { Request, Response } from "express";
import { AlunoRepository } from "../repositories/AlunoRepository";
import { AlunoResponsavelRepository } from "../repositories/AlunoResponsavelRepository";
import { NotFoundError, UnprocessableEntityError } from "../helpers/api-errors";

interface AlunoResponsavel {
  cpf_mae: string;
  nome_mae: string;
  nome_pai: string;
  nome_responsavel: string;
}

export class AlunoResponsavelController {
  async create(req: Request, res: Response) {
    const alunoResponsavelData = req.body as AlunoResponsavel;
    const { alunoId } = req.params;

    const associarAoAluno = await AlunoRepository.findOneBy({
      id: Number(alunoId),
    });

    if (!associarAoAluno) {
      throw new NotFoundError("Aluno não encontrado.");
    } else if (associarAoAluno.aluno_responsavel) {
      throw new UnprocessableEntityError(
        "Aluno já possui responsáveis cadastrados."
      );
    }

    const novoAlunoResponsavel =
      AlunoResponsavelRepository.create(alunoResponsavelData);
    await AlunoResponsavelRepository.save(novoAlunoResponsavel);

    associarAoAluno.aluno_responsavel = novoAlunoResponsavel;
    await AlunoRepository.save(associarAoAluno);

    res.status(201).json(novoAlunoResponsavel);
  }

  async list(req: Request, res: Response) {
    const { alunoId } = req.params;

    const buscarAlunoResponsavel = await AlunoRepository.findOne({
      where: {
        id: Number(alunoId),
      },
      relations: ["aluno_responsavel"],
    });

    if (!buscarAlunoResponsavel) {
      throw new NotFoundError(
        `Erro ao encontrar responsável do aluno ${alunoId}`
      );
    }

    res.status(200).json(buscarAlunoResponsavel.aluno_responsavel);
  }
}
