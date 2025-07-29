import { Request, Response } from "express";
import { AlunoRepository } from "../repositories/AlunoRepository";
import { AlunoDocumentoRepository } from "../repositories/AlunoDocumentoRepository";
import {
  BadRequestError,
  NotFoundError,
  UnprocessableEntityError,
} from "../helpers/api-errors";
import { AlunoDocumentoInterface } from "../interfaces/alunoDocumento.interface";
import testaCPF from "../helpers/cpf-helper";
import validarCPF from "../helpers/cpf-helper";

export class AlunoDocumentoController {
  async create(
    req: Request<{ alunoId: string }, any, AlunoDocumentoInterface>,
    res: Response
  ) {
    const alunoDocumentoData = req.body;
    const { alunoId } = req.params;

    const associarAoAluno = await AlunoRepository.findOneBy({
      id: Number(alunoId),
    });

    if (!associarAoAluno) {
      throw new NotFoundError("Aluno não encontrado.");
    } else if (associarAoAluno.aluno_documento) {
      throw new UnprocessableEntityError(
        "Aluno já possui documentos cadastrados."
      );
    }

    if (!validarCPF(alunoDocumentoData.cpf)) {
      throw new BadRequestError("CPF inválido.");
    }

    const novoAlunoDocumento =
      AlunoDocumentoRepository.create(alunoDocumentoData);
    await AlunoDocumentoRepository.save(novoAlunoDocumento);

    associarAoAluno.aluno_documento = novoAlunoDocumento;
    await AlunoRepository.save(associarAoAluno);

    res.status(201).json(novoAlunoDocumento);
    return;
  }

  async list(req: Request, res: Response) {
    const { alunoId } = req.params;

    const buscarAlunoDocumento = await AlunoRepository.findOne({
      where: {
        id: Number(alunoId),
      },
      relations: ["aluno_documento"],
    });

    if (!buscarAlunoDocumento) {
      throw new NotFoundError(
        `Erro ao encontrar documento do aluno ${alunoId}`
      );
    }

    res.status(200).json(buscarAlunoDocumento.aluno_documento);
  }
}
