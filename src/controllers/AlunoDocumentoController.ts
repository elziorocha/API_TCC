import { Request, Response } from "express";
import { AlunoRepository } from "../repositories/AlunoRepository";
import { AlunoDocumentoRepository } from "../repositories/AlunoDocumentoRepository";
import { NotFoundError, UnprocessableEntityError } from "../helpers/api-errors";
import { AlunoDocumentoInterface } from "../interfaces/alunoDocumento.interface";

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

    const novoAlunoDocumento =
      AlunoDocumentoRepository.create(alunoDocumentoData);
    await AlunoDocumentoRepository.save(novoAlunoDocumento);

    aluno.aluno_documento = novoAlunoDocumento;
    await AlunoRepository.save(aluno);

    res.status(201).json(novoAlunoDocumento);
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
