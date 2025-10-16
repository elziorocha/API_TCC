import { Request, Response } from "express";
import { NotFoundError } from "../helpers/api-errors";
import { AlunoProcessosRepository, AlunoRepository } from "../repositories";
import fs from "fs";
import path from "path";

export class AlunoController {
  async list(req: Request, res: Response) {
    const alunoId = req.alunoLogin?.id;

    if (!alunoId) {
      throw new NotFoundError("Aluno não autenticado.");
    }

    const aluno = await AlunoRepository.findOne({
      where: { id: alunoId },
      relations: [
        "aluno_documento",
        "aluno_endereco",
        "aluno_responsavel",
        "aluno_matricula",
      ],
    });

    if (!aluno) {
      throw new NotFoundError("Aluno não encontrado.");
    }

    const { id: _, senha: __, ...alunoSemSenha } = aluno;
    res.status(200).json(alunoSemSenha);
  }

  async atualizarTipoCartao(req: Request, res: Response) {
    const alunoId = req.alunoLogin?.id;
    const { tipo_cartao } = req.body;

    const aluno = await AlunoRepository.findOneBy({ id: Number(alunoId) });
    if (!aluno) throw new NotFoundError("Aluno não encontrado.");

    aluno.tipo_cartao = tipo_cartao;
    await AlunoRepository.save(aluno);

    const processosAtivos = await AlunoProcessosRepository.find({
      where: { aluno: { id: alunoId }, liberado: false },
    });

    for (const processo of processosAtivos) {
      const camposArquivos = [
        "formulario_educard",
        "declaracao_matricula",
        "comprovante_pagamento",
        "comprovante_residencia",
        "rg_frente_ou_verso",
      ];

      for (const campo of camposArquivos) {
        const caminhoArquivo = processo[campo as keyof typeof processo] as
          | string
          | null;
        if (caminhoArquivo) {
          const caminhoAbsoluto = path.resolve(caminhoArquivo);
          if (fs.existsSync(caminhoAbsoluto)) {
            fs.unlinkSync(caminhoAbsoluto);
          }
          (processo as any)[campo] = null;
          (processo as any)[`${campo}_validado`] = false;
        }
      }

      processo.liberado = false;
      await AlunoProcessosRepository.save(processo);
    }

    res.status(200).json({
      message: "Tipo de cartão atualizado com sucesso.",
      aluno,
    });
    return;
  }
}
