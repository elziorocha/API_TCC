import { Request, Response } from "express";
import { NotFoundError, UnprocessableEntityError } from "../helpers/api-errors";
import { validate } from "class-validator";
import { ErrosValidacao } from "../helpers/error-validator";
import { AlunoProcessoInterface } from "../helpers/interfaces.interface";
import { AlunoProcessosRepository, AlunoRepository } from "../repositories";
import { plainToInstance } from "class-transformer";
import { Aluno_Processo } from "../entities/Aluno_Processo";

export class AlunoProcessoController {
  async create(req: Request<any, any, AlunoProcessoInterface>, res: Response) {
    const alunoId = req.alunoLogin.id;
    const alunoProcessoData = req.body;

    const aluno = await AlunoRepository.findOne({
      where: { id: alunoId },
      relations: [
        "aluno_documento",
        "aluno_endereco",
        "aluno_responsavel",
        "aluno_matricula",
      ],
    });

    if (!aluno) throw new NotFoundError("Aluno não encontrado.");

    if (
      !aluno.aluno_documento ||
      !aluno.aluno_endereco ||
      !aluno.aluno_responsavel
    ) {
      throw new UnprocessableEntityError(
        "Para cadastrar um Processo Digital é necessário que o aluno tenha Documento, Endereço e Responsáveis cadastrados."
      );
    }

    const anoAtual = new Date().getFullYear();
    const matriculaVigente = aluno.aluno_matricula?.find(
      (matricula) =>
        matricula.ano_letivo === anoAtual && matricula.status_matricula === true
    );

    if (!matriculaVigente) {
      throw new UnprocessableEntityError(
        "Para cadastrar um Processo Digital é necessário que o aluno tenha uma Matrícula vigente neste ano."
      );
    }

    const novoAlunoProcesso = plainToInstance(Aluno_Processo, {
      ...alunoProcessoData,
      aluno,
      aluno_matricula: matriculaVigente,
    });

    const errosValidacao = await validate(novoAlunoProcesso);
    if (errosValidacao.length > 0) {
      ErrosValidacao(errosValidacao, res);
      return;
    }

    await AlunoProcessosRepository.save(novoAlunoProcesso);

    const {
      aluno: _,
      aluno_matricula: __,
      ...novoAlunoProcessoOtimizado
    } = novoAlunoProcesso;

    res.status(201).json({
      ...novoAlunoProcessoOtimizado,
      alunoId: aluno.id,
      matriculaId: matriculaVigente.id,
    });
  }

  async list(req: Request, res: Response) {
    const alunoId = req.alunoLogin.id;

    const aluno = await AlunoRepository.findOne({
      where: { id: alunoId },
      relations: ["aluno_processo", "aluno_processo.aluno_matricula"],
    });

    if (!aluno) {
      throw new NotFoundError(`Erro ao encontrar processo do aluno ${alunoId}`);
    }

    const alunoProcessosData = aluno.aluno_processo?.map(
      ({ aluno_matricula, aluno, ...processo }) => ({
        ...processo,
        alunoId: aluno?.id ?? alunoId,
        matriculaId: aluno_matricula?.id,
      })
    );

    res.status(200).json(alunoProcessosData);
  }
}
