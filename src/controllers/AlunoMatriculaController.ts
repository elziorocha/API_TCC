import { Request, Response } from "express";
import { AlunoMatriculaInterface } from "../helpers/interfaces.interface";
import { AlunoMatriculaRepository, AlunoRepository } from "../repositories";
import { NotFoundError, UnprocessableEntityError } from "../helpers/api-errors";
import { validate } from "class-validator";
import { Aluno_Matricula } from "../entities/Aluno_Matricula";
import { plainToInstance } from "class-transformer";
import { ErrosValidacao } from "../helpers/error-validator";
import { optionCamposPorGrau } from "../helpers/grau-escolaridade-options";

export class AlunoMatriculaController {
  async create(req: Request<any, any, AlunoMatriculaInterface>, res: Response) {
    const alunoId = req.alunoLogin.id;
    const alunoMatriculaData = req.body;

    const aluno = await AlunoRepository.findOne({
      where: { id: alunoId },
      relations: ["aluno_matricula"],
    });

    if (!aluno) throw new NotFoundError("Aluno não encontrado.");

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

    const alunoMatriculaDataFiltrado = optionCamposPorGrau(alunoMatriculaData);

    const novoAlunoMatricula = plainToInstance(Aluno_Matricula, {
      ...alunoMatriculaDataFiltrado,
      aluno,
    });

    const anoAtual = new Date().getFullYear();

    novoAlunoMatricula.status_matricula =
      novoAlunoMatricula.ano_letivo === anoAtual;

    const errosValidacao = await validate(novoAlunoMatricula);

    if (errosValidacao.length > 0) {
      ErrosValidacao(errosValidacao, res);
      return;
    }

    await AlunoMatriculaRepository.save(novoAlunoMatricula);

    const { aluno: _, id: __, ...novoAlunoMatriculaSemId } = novoAlunoMatricula;

    res.status(201).json({ ...novoAlunoMatriculaSemId, alunoId: aluno.id });
  }

  async list(req: Request, res: Response) {
    const alunoId = req.alunoLogin.id;

    const aluno = await AlunoRepository.findOne({
      where: { id: alunoId },
      relations: ["aluno_matricula"],
    });

    if (!aluno) {
      throw new NotFoundError(
        `Erro ao encontrar matrícula do aluno ${alunoId}`
      );
    }

    res.status(200).json(aluno.aluno_matricula);
  }
}
