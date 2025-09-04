import { Request, Response } from "express";
import { AlunoDocumentoRepository, AlunoRepository } from "../repositories";
import {
  BadRequestError,
  NotFoundError,
  UnprocessableEntityError,
} from "../helpers/api-errors";
import { AlunoDocumentoInterface } from "../helpers/interfaces.interface";
import validarCPF from "../helpers/cpf-helper";
import { validate } from "class-validator";
import { ErrosValidacao } from "../helpers/error-validator";

export class AlunoDocumentoController {
  async create(req: Request<any, any, AlunoDocumentoInterface>, res: Response) {
    const alunoId = req.alunoLogin.id;
    const alunoDocumentoData = req.body;

    const aluno = await AlunoRepository.findOne({
      where: { id: alunoId },
      relations: ["aluno_documento"],
    });

    if (!aluno) {
      throw new NotFoundError("Aluno não encontrado.");
    }

    if (aluno.aluno_documento) {
      throw new UnprocessableEntityError(
        "Aluno já possui documentos cadastrados."
      );
    }

    const documentoExistente = await AlunoDocumentoRepository.findOne({
      where: [{ cpf: alunoDocumentoData.cpf }, { rg: alunoDocumentoData.rg }],
    });

    if (documentoExistente) {
      if (documentoExistente.cpf === alunoDocumentoData.cpf) {
        res.status(400).json({ error: "CPF já cadastrado no sistema." });
      }
      if (documentoExistente.rg === alunoDocumentoData.rg) {
        res.status(400).json({ error: "RG já cadastrado no sistema." });
      }
    }

    if (!validarCPF(alunoDocumentoData.cpf)) {
      throw new BadRequestError("CPF inválido.");
    }

    const novoAlunoDocumento =
      AlunoDocumentoRepository.create(alunoDocumentoData);
    await AlunoDocumentoRepository.save(novoAlunoDocumento);

    aluno.aluno_documento = novoAlunoDocumento;

    const errosValidacao = await validate(novoAlunoDocumento);
    
    if (errosValidacao.length > 0) {
      ErrosValidacao(errosValidacao, res);
      return;
    }

    await AlunoRepository.save(aluno);

    const { id: _, ...novoAlunoDocumentoSemId } = novoAlunoDocumento;

    res.status(201).json(novoAlunoDocumentoSemId);
  }

  async list(req: Request, res: Response) {
    const alunoId = req.alunoLogin.id;

    const aluno = await AlunoRepository.findOne({
      where: { id: alunoId },
      relations: ["aluno_documento"],
    });

    if (!aluno) {
      throw new NotFoundError(
        `Erro ao encontrar documento do aluno ${alunoId}`
      );
    }

    res.status(200).json(aluno.aluno_documento);
  }
}
