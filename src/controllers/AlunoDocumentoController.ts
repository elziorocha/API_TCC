import { Request, Response } from "express";
import { AlunoRepository } from "../repositories/AlunoRepository";
import { AlunoDocumentoRepository } from "../repositories/AlunoDocumentoRepository";

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

    if (!alunoDocumentoData.cpf || !alunoDocumentoData.rg) {
      res.status(422).json({
        message: "Campos de CPF e RG são obrigatórios.",
      });
    }

    try {
      const associarAoAluno = await AlunoRepository.findOneBy({
        id: Number(alunoId),
      });
      if (!associarAoAluno) {
        res.status(404).json({ message: "Aluno não encontrado" });
        return;
      }
      if (associarAoAluno.aluno_documento) {
        res
          .status(422)
          .json({ message: "Aluno já possui documentos cadastrados." });
        return;
      }

      const novoAlunoDocumento =
        AlunoDocumentoRepository.create(alunoDocumentoData);
      await AlunoDocumentoRepository.save(novoAlunoDocumento);

      associarAoAluno.aluno_documento = novoAlunoDocumento;
      await AlunoRepository.save(associarAoAluno);

      res.status(201).json(novoAlunoDocumento);
      return;
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Erro ao cadastrar documentos de Aluno" });
      return;
    }
  }
}
