import { Request, Response } from "express";
import { AlunoRepository } from "../repositories/AlunoRepository";

export class AlunoController {
  async create(req: Request, res: Response) {
    const { email, senha, nome, data_nascimento, telefone, criado_em } =
      req.body;

    const alunoData = {
      email,
      senha,
      nome,
      telefone,
      data_nascimento,
      criado_em,
    };

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
}
