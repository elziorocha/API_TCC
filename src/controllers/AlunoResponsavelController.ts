import { Request, Response } from "express";
import { AlunoRepository } from "../repositories/AlunoRepository";
import { AlunoResponsavelRepository } from "../repositories/AlunoResponsavelRepository";

interface AlunoResponsavel {
  cpf_mae: string;
  nome_mae: string;
  nome_pai: string;
  nome_responsavel: string;
}

export class AlunoResponsavelController {
  async create(req: Request, res: Response) {
    const alunoResponsavelData = req.body as AlunoResponsavel;
    const { alunoId } = req.params;

    for (const [field, value] of Object.entries(alunoResponsavelData)) {
      if (!value) {
        res.status(400).json({ message: `Campo ${field} em falta!` });
        return;
      }
    }

    try {
      const associarAoAluno = await AlunoRepository.findOneBy({
        id: Number(alunoId),
      });

      if (!associarAoAluno) {
        res.status(404).json({ message: "Aluno não encontrado" });
        return;
      } else if (associarAoAluno.aluno_responsavel) {
        res
          .status(422)
          .json({ message: "Aluno já possui responsáveis cadastrados." });
        return;
      }

      const novoAlunoResponsavel =
        AlunoResponsavelRepository.create(alunoResponsavelData);
      await AlunoResponsavelRepository.save(novoAlunoResponsavel);

      associarAoAluno.aluno_responsavel = novoAlunoResponsavel;
      await AlunoRepository.save(associarAoAluno);

      res.status(201).json(novoAlunoResponsavel);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Erro ao cadastrar Responsável de Aluno" });
      return;
    }
  }
}
