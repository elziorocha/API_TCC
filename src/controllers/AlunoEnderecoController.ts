import { Request, Response } from "express";

export class AlunoEnderecoController {
  async create(req: Request, res: Response) {
    const { cep, cidade, bairro, rua, numero } = req.body;

    try {
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro ao cadastrar endereço de Aluno" });
      return;
    }
  }
}
