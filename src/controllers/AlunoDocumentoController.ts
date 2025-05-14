import { Request, Response } from "express";
import { AlunoRepository } from "../repositories/AlunoRepository";
import { AlunoDocumentoRepository } from "../repositories/AlunoDocumentoRepository";
import { NotFoundError, UnprocessableEntityError } from "../helpers/api-errors";

interface AlunoDocumento {
  rg: string;
  cpf: string;
  orgao_emissor: string;
  comprovante_matricula: string;
  atestado_frequencia: string;
  tipo_cartao: "EDUCARD" | "VEM";
}

export class AlunoDocumentoController {
  async create(req: Request, res: Response) {
    const alunoDocumentoData = req.body as AlunoDocumento;
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
