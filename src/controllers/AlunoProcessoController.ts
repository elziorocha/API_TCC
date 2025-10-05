import { Request, Response } from "express";
import { NotFoundError, UnprocessableEntityError } from "../helpers/api-errors";
import { validate } from "class-validator";
import { ErrosValidacao } from "../helpers/error-validator";
import { AlunoProcessoInterface } from "../helpers/interfaces.interface";
import { AlunoProcessosRepository, AlunoRepository } from "../repositories";
import { plainToInstance } from "class-transformer";
import { Aluno_Processo } from "../entities/Aluno_Processo";
import { gerarUrlsArquivos } from "../helpers/gerar-url-arquivos";

export class AlunoProcessoController {
  async create(req: Request, res: Response) {
    const alunoId = req.alunoLogin.id;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const aluno = await AlunoRepository.findOne({
      where: { id: alunoId },
      relations: [
        "aluno_documento",
        "aluno_endereco",
        "aluno_responsavel",
        "aluno_matricula",
      ],
    });

    if (!aluno) throw new NotFoundError("Aluno não encontrado.");

    if (
      !aluno.aluno_documento ||
      !aluno.aluno_endereco ||
      !aluno.aluno_responsavel
    ) {
      throw new UnprocessableEntityError(
        "Para cadastrar um Processo Digital é necessário que o aluno tenha Documento, Endereço e Responsáveis cadastrados."
      );
    }

    const anoAtual = new Date().getFullYear();
    const matriculaVigente = aluno.aluno_matricula?.find(
      (matricula) =>
        matricula.ano_letivo === anoAtual && matricula.status_matricula === true
    );

    if (!matriculaVigente) {
      throw new UnprocessableEntityError(
        "Para cadastrar um Processo Digital é necessário que o aluno tenha uma Matrícula vigente neste ano."
      );
    }

    const alunoProcessoData: AlunoProcessoInterface = {
      formulario_educard: files.formulario_educard?.[0]?.path || "",
      declaracao_matricula: files.declaracao_matricula?.[0]?.path || "",
      comprovante_pagamento: files.comprovante_pagamento?.[0]?.path || "",
      comprovante_residencia: files.comprovante_residencia?.[0]?.path || "",
      rg_frente_ou_verso: files.rg_frente_ou_verso?.[0]?.path || "",
      liberado: false,
    };

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const novoAlunoProcesso = plainToInstance(Aluno_Processo, {
      ...alunoProcessoData,
      aluno,
      aluno_matricula: matriculaVigente,
    });

    const errosValidacao = await validate(novoAlunoProcesso);
    if (errosValidacao.length > 0) {
      ErrosValidacao(errosValidacao, res);
      return;
    }

    await AlunoProcessosRepository.save(novoAlunoProcesso);

    const {
      aluno: _,
      aluno_matricula: __,
      ...novoAlunoProcessoOtimizado
    } = novoAlunoProcesso;

    res.status(201).json({
      ...novoAlunoProcessoOtimizado,
      ...gerarUrlsArquivos(novoAlunoProcessoOtimizado, baseUrl),
      alunoId: aluno.id,
      matriculaId: matriculaVigente.id,
    });
  }

  async list(req: Request, res: Response) {
    const alunoId = req.alunoLogin.id;

    const aluno = await AlunoRepository.findOne({
      where: { id: alunoId },
      relations: ["aluno_processo", "aluno_processo.aluno_matricula"],
    });

    if (!aluno) {
      throw new NotFoundError(`Erro ao encontrar processo do aluno ${alunoId}`);
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const alunoProcessosData = aluno.aluno_processo?.map(
      ({ aluno_matricula, aluno, ...processo }) => ({
        ...processo,
        ...gerarUrlsArquivos(processo, baseUrl),
        alunoId: aluno?.id ?? alunoId,
        matriculaId: aluno_matricula?.id,
      })
    );

    res.status(200).json(alunoProcessosData);
  }

  async iniciarProcesso(req: Request, res: Response) {
    const alunoId = req.alunoLogin.id;

    const aluno = await AlunoRepository.findOne({
      where: { id: alunoId },
      relations: ["aluno_matricula"],
    });

    if (!aluno) throw new NotFoundError("Aluno não encontrado.");

    const anoAtual = new Date().getFullYear();
    const matriculaVigente = aluno.aluno_matricula?.find(
      (matricula) =>
        matricula.ano_letivo === anoAtual && matricula.status_matricula === true
    );

    if (!matriculaVigente) {
      throw new UnprocessableEntityError(
        "Para iniciar um Processo Digital, é necessário ter uma matrícula vigente."
      );
    }

    const novoProcesso = AlunoProcessosRepository.create({
      formulario_educard: null,
      declaracao_matricula: null,
      comprovante_pagamento: null,
      comprovante_residencia: null,
      rg_frente_ou_verso: null,
      liberado: false,
      aluno,
      aluno_matricula: matriculaVigente,
      data_criacao: new Date(),
      prazo_final: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    });

    await AlunoProcessosRepository.save(novoProcesso);

    return res.status(201).json({
      message:
        "Processo iniciado com sucesso! Você tem 15 dias para concluir o envio dos itens necessários.",
      processoId: novoProcesso.id,
      prazo_final: novoProcesso.prazo_final,
    });
  }
}
