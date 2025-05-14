import { Request, Response } from "express";
import { AlunoEnderecoRepository } from "../repositories/AlunoEnderecoRepository";
import { AlunoRepository } from "../repositories/AlunoRepository";
import { NotFoundError, UnprocessableEntityError } from "../helpers/api-errors";

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

    const associarAoAluno = await AlunoRepository.findOneBy({
      id: Number(alunoId),
    });

    if (!associarAoAluno) {
      throw new NotFoundError("Aluno não encontrado.");
    } else if (associarAoAluno.aluno_endereco) {
      throw new UnprocessableEntityError(
        "Aluno já possui endereços cadastrados."
      );
    }

    const novoAlunoEndereco = AlunoEnderecoRepository.create(alunoEnderecoData);
    await AlunoEnderecoRepository.save(novoAlunoEndereco);

    associarAoAluno.aluno_endereco = novoAlunoEndereco;
    await AlunoRepository.save(associarAoAluno);

    res.status(201).json(novoAlunoEndereco);
  }

  async list(req: Request, res: Response) {
    const { alunoId } = req.params;

    const buscarAlunoEndereco = await AlunoRepository.findOne({
      where: {
        id: Number(alunoId),
      },
      relations: ["aluno_endereco"],
    });

    if (!buscarAlunoEndereco) {
      throw new NotFoundError(`Erro ao encontrar endereço do aluno ${alunoId}`);
    }

    res.status(200).json(buscarAlunoEndereco.aluno_endereco);
  }
}
