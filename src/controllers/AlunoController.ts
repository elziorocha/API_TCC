import { Request, Response } from "express";
import { AlunoRepository } from "../repositories/AlunoRepository";
import { BadRequestError, NotFoundError } from "../helpers/api-errors";
import bcrypt from "bcrypt";

interface Aluno {
  email: string;
  senha: string;
  nome: string;
  telefone: string;
  data_nascimento: Date;
  criado_em: Date;
}

interface Login {
  email: string;
  senha: string;
}

export class AlunoController {
  async create(req: Request, res: Response) {
    const alunoData = req.body as Aluno;

    const [emailExistente, telefoneExistente] = await Promise.all([
      AlunoRepository.findOneBy({ email: alunoData.email }),
      AlunoRepository.findOneBy({ telefone: alunoData.telefone }),
    ]);

    if (emailExistente) {
      throw new BadRequestError("Email já cadastrado no sistema.");
    }
    if (telefoneExistente) {
      throw new BadRequestError("Telefone já cadastrado no sistema.");
    }

    const senhaCriptografada = await bcrypt.hash(alunoData.senha, 10);

    const novoAluno = AlunoRepository.create({
      ...alunoData,
      senha: senhaCriptografada,
    });
    await AlunoRepository.save(novoAluno);

    const { senha: _, ...alunoPostDataSemSenha } = novoAluno;

    res.status(201).json(alunoPostDataSemSenha);
    return;
  }

  async list(req: Request, res: Response) {
    const { alunoId } = req.params;

    const buscarAluno = await AlunoRepository.findOne({
      where: {
        id: Number(alunoId),
      },
    });

    if (!buscarAluno) {
      throw new NotFoundError("Nenhum aluno encontrado.");
    }

    const { senha: _, ...alunoGetDataSemSenha } = buscarAluno;

    res.status(200).json(alunoGetDataSemSenha);
  }

  // async login(req: Request, res: Response) {
  //   const authData = req.body as Login;

  //   const auth = await AlunoRepository.findOneBy({ email: authData.email });

  //   if (!auth) {
  //     throw new BadRequestError("E-mail ou Senha inválidos.");
  //   }

  //   const verificarSenha = await bcrypt.compare(authData.senha, auth.senha);

  //   if (!verificarSenha) {
  //     throw new BadRequestError("E-mail ou Senha inválidos.");
  //   }
  // }
}
