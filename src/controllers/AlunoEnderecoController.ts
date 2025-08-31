import { Request, Response } from "express";
import { AlunoEnderecoRepository, AlunoRepository } from "../repositories";
import { NotFoundError, UnprocessableEntityError } from "../helpers/api-errors";
import { AlunoEnderecoInterface } from "../helpers/interfaces.interface";

export class AlunoEnderecoController {
  async create(req: Request<any, any, AlunoEnderecoInterface>, res: Response) {
    const alunoId = req.alunoLogin.id;
    const alunoEnderecoData = req.body;

    const aluno = await AlunoRepository.findOne({
      where: { id: alunoId },
      relations: ["aluno_endereco"],
    });

    if (!aluno) {
      throw new NotFoundError("Aluno não encontrado.");
    }

    if (aluno.aluno_endereco) {
      throw new UnprocessableEntityError(
        "Aluno já possui endereços cadastrados."
      );
    }

    const novoAlunoEndereco = AlunoEnderecoRepository.create(alunoEnderecoData);
    await AlunoEnderecoRepository.save(novoAlunoEndereco);

    aluno.aluno_endereco = novoAlunoEndereco;
    await AlunoRepository.save(aluno);

    const { id: _, ...novoAlunoEnderecoSemId } = novoAlunoEndereco;

    res.status(201).json(novoAlunoEnderecoSemId);
  }

  async list(req: Request, res: Response) {
    const alunoId = req.alunoLogin.id;

    const aluno = await AlunoRepository.findOne({
      where: { id: alunoId },
      relations: ["aluno_endereco"],
    });

    if (!aluno) {
      throw new NotFoundError(`Erro ao encontrar endereço do aluno ${alunoId}`);
    }

    res.status(200).json(aluno.aluno_endereco);
  }
}
