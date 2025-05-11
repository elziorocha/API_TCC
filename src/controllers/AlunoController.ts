import { Request, Response } from "express";
import { AlunoRepository } from "../repositories/AlunoRepository";

interface Aluno {
  email: string;
  senha: string;
  nome: string;
  telefone: string;
  data_nascimento: Date;
  criado_em: Date;
}

export class AlunoController {
  async create(req: Request, res: Response) {
    const alunoData = req.body as Aluno;

    for (const [field, value] of Object.entries(alunoData)) {
      if (!value) {
        res.status(400).json({ message: `Campo ${field} em falta!` });
        return;
      }
    }

    try {
      const novoAluno = AlunoRepository.create(alunoData);
      await AlunoRepository.save(novoAluno);

      res.status(201).json(novoAluno);
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro ao criar Aluno" });
      return;
    }
  }

  async list(req: Request, res: Response) {
    try {
      const buscarAluno = await AlunoRepository.find();

      res.status(201).json(buscarAluno);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro ao buscar Aluno" });
      return;
    }
  }
}
