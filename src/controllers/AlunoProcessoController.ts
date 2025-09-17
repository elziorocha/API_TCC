import { Request, Response } from "express";
import { NotFoundError, UnprocessableEntityError } from "../helpers/api-errors";
import { validate } from "class-validator";
import { ErrosValidacao } from "../helpers/error-validator";
import { AlunoProcessoInterface } from "../helpers/interfaces.interface";
import { AlunoProcessosRepository, AlunoRepository } from "../repositories";

export class AlunoProcessoController {
  async create(req: Request<any, any, AlunoProcessoInterface>, res: Response) {
    const alunoId = req.alunoLogin.id;
    const alunoProcessoData = req.body;

    const aluno = await AlunoRepository.findOne({
      where: { id: alunoId },
      relations: ["aluno_processo"],
    });

    if (!aluno) {
      throw new NotFoundError("Aluno não encontrado.");
    }

    if (
      !aluno.aluno_documento ||
      !aluno.aluno_endereco ||
      !aluno.aluno_responsavel
    ) {
      throw new UnprocessableEntityError(
        "Para cadastrar um Processo Digital é necessário que o aluno tenha Documento, Endereço e Responsáveis cadastrados."
      );
    }

    const novoAlunoProcesso = AlunoProcessosRepository.create({
      ...alunoProcessoData,
      aluno,
    });

    const errosValidacao = await validate(novoAlunoProcesso);

    if (errosValidacao.length > 0) {
      ErrosValidacao(errosValidacao, res);
      return;
    }

    await AlunoProcessosRepository.save(novoAlunoProcesso);

    const { id: _, ...novoAlunoProcessoSemId } = novoAlunoProcesso;

    res.status(201).json(novoAlunoProcessoSemId);
  }

  async list(req: Request, res: Response) {
    const alunoId = req.alunoLogin.id;

    const aluno = await AlunoRepository.findOne({
      where: { id: alunoId },
      relations: ["aluno_processo"],
    });

    if (!aluno) {
      throw new NotFoundError(`Erro ao encontrar processo do aluno ${alunoId}`);
    }

    res.status(200).json(aluno.aluno_processo);
  }
}
