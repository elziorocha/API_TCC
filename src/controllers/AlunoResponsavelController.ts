import { Request, Response } from "express";
import { AlunoRepository, AlunoResponsavelRepository } from "../repositories";
import { NotFoundError, UnprocessableEntityError } from "../helpers/api-errors";
import { AlunoResponsavelInterface } from "../helpers/interfaces.interface";
import { validate } from "class-validator";
import { ErrosValidacao } from "../helpers/error-validator";

export class AlunoResponsavelController {
  async create(
    req: Request<any, any, AlunoResponsavelInterface>,
    res: Response
  ) {
    const alunoId = req.alunoLogin.id;
    const alunoResponsavelData = req.body;

    const aluno = await AlunoRepository.findOne({
      where: { id: alunoId },
      relations: ["aluno_responsavel"],
    });

    if (!aluno) {
      throw new NotFoundError("Aluno não encontrado.");
    }

    if (aluno.aluno_responsavel) {
      throw new UnprocessableEntityError(
        "Aluno já possui responsáveis cadastrados."
      );
    }

    const novoAlunoResponsavel =
      AlunoResponsavelRepository.create(alunoResponsavelData);
    await AlunoResponsavelRepository.save(novoAlunoResponsavel);

    aluno.aluno_responsavel = novoAlunoResponsavel;

    const errosValidacao = await validate(novoAlunoResponsavel);
    
    if (errosValidacao.length > 0) {
      ErrosValidacao(errosValidacao, res);
      return;
    }

    await AlunoRepository.save(aluno);

    const { id: _, ...novoAlunoResponsavelSemId } = novoAlunoResponsavel;

    res.status(201).json(novoAlunoResponsavelSemId);
  }

  async list(req: Request, res: Response) {
    const alunoId = req.alunoLogin.id;

    const aluno = await AlunoRepository.findOne({
      where: { id: alunoId },
      relations: ["aluno_responsavel"],
    });

    if (!aluno) {
      throw new NotFoundError(
        `Erro ao encontrar responsável do aluno ${alunoId}`
      );
    }

    res.status(200).json(aluno.aluno_responsavel);
  }
}
