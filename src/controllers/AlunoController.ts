import { Request, Response } from "express";
import { alunoRepository } from "../repositories/alunoRepository";

export class AlunoController {
  async create(req: Request, res: Response) {
    const { email, senha, nome, data_nascimento, criado_em } = req.body;

    if (!email || !senha || !nome || !data_nascimento) {
      res.status(400).json({ message: "Campo obrigatório em falta!" });
      return;
    }

    try {
      const newAluno = alunoRepository.create({
        email,
        senha,
        nome,
        data_nascimento,
        criado_em,
      });

      await alunoRepository.save(newAluno);

      res.status(201).json(newAluno);
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro ao criar Aluno" });
    }
  }
}
