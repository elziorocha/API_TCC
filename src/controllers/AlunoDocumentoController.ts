import { Request, Response } from "express";
import { AlunoRepository } from "../repositories/AlunoRepository";
import { AlunoDocumentoRepository } from "../repositories/AlunoDocumentoRepository";

export class AlunoDocumentoController {
  async create(req: Request, res: Response) {
    const {
      rg,
      cpf,
      orgao_emissor,
      comprovante_matricula,
      atestado_frequencia,
      tipo_cartao,
    } = req.body;

    const { alunoId } = req.params;

    try {
      const associarAoAluno = await AlunoRepository.findOneBy({
        id: Number(alunoId),
      });
      if (!associarAoAluno) {
        res.status(404).json({ message: "Aluno não encontrado" });
        return;
      }

      const alunoDocumentoData = AlunoDocumentoRepository.create({
        rg,
        cpf,
        orgao_emissor,
        comprovante_matricula,
        atestado_frequencia,
        tipo_cartao,
      });

      await AlunoDocumentoRepository.save(alunoDocumentoData);

      associarAoAluno.aluno_documento = alunoDocumentoData;
      await AlunoRepository.save(associarAoAluno);

      res.status(201).json(alunoDocumentoData);
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
