import { Request, Response } from "express";
import { AlunoEnderecoRepository } from "../repositories/AlunoEnderecoRepository";
import { AlunoRepository } from "../repositories/AlunoRepository";

interface AlunoEndereco {
  cep: string;
  cidade: string;
  bairro: string;
  rua: string;
  numero: number;
}

export class AlunoEnderecoController {
  async create(req: Request, res: Response) {
    const alunoEnderecoData = req.body as AlunoEndereco;
    const { alunoId } = req.params;

    for (const [field, value] of Object.entries(alunoEnderecoData)) {
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
      } else if (associarAoAluno.aluno_endereco) {
        res
          .status(422)
          .json({ message: "Aluno já possui endereços cadastrados." });
        return;
      }

      const novoAlunoEndereco =
        AlunoEnderecoRepository.create(alunoEnderecoData);
      await AlunoEnderecoRepository.save(novoAlunoEndereco);

      associarAoAluno.aluno_endereco = novoAlunoEndereco;
      await AlunoRepository.save(associarAoAluno);

      res.status(201).json(novoAlunoEndereco);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro ao cadastrar Endereço de Aluno" });
      return;
    }
  }
}
