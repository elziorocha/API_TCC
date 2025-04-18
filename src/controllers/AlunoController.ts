import { Request, Response } from "express";
import { alunoRepository } from "../repositories/alunoRepository";

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
      const newAluno = alunoRepository.create(alunoData);

      await alunoRepository.save(newAluno);

      res.status(201).json(newAluno);
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro ao criar Aluno" });
      return;
    }
  }
}
