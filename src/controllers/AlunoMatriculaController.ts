import { Request, Response } from "express";
import { AlunoMatriculaInterface } from "../helpers/interfaces.interface";
import { AlunoMatriculaRepository, AlunoRepository } from "../repositories";
import { NotFoundError, UnprocessableEntityError } from "../helpers/api-errors";

export class AlunoMatriculaController {
  async create(req: Request<any, any, AlunoMatriculaInterface>, res: Response) {
    const alunoId = req.alunoLogin.id;
    const alunoMatriculaData = req.body;

    const aluno = await AlunoRepository.findOne({
      where: { id: alunoId },
      relations: ["aluno_matricula"],
    });

    if (!aluno) {
      throw new NotFoundError("Aluno não encontrado.");
    }

    const matriculaExisteNesteAno = await AlunoMatriculaRepository.findOne({
        where: {
            aluno: { id: alunoId },
            ano_letivo: alunoMatriculaData.ano_letivo,
        },
    });

    if (matriculaExisteNesteAno) {
        throw new UnprocessableEntityError(
            "Aluno já possui matrícula cadastrada neste ano."
        );
    }

    const novoAlunoMatricula = AlunoMatriculaRepository.create(alunoMatriculaData);
    await AlunoMatriculaRepository.save(novoAlunoMatricula);

    const { id: _, ...novoAlunoMatriculaSemId } = novoAlunoMatricula;

    res.status(201).json(novoAlunoMatriculaSemId);
  }

  async list(req: Request, res: Response) {
    const alunoId = req.alunoLogin.id;

    const aluno = await AlunoRepository.findOne({
      where: { id: alunoId },
      relations: ["aluno_matricula"],
    });

    if (!aluno) {
      throw new NotFoundError(`Erro ao encontrar matrícula do aluno ${alunoId}`);
    }

    res.status(200).json(aluno.aluno_matricula);
  }
}

