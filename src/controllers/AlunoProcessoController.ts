import { Request, Response } from "express";
import {
  ConflictError,
  NotFoundError,
  UnprocessableEntityError,
} from "../helpers/api-errors";
import { validate } from "class-validator";
import { ErrosValidacao } from "../helpers/error-validator";
import { AlunoProcessoInterface } from "../helpers/interfaces.interface";
import { AlunoProcessosRepository, AlunoRepository } from "../repositories";
import { plainToInstance } from "class-transformer";
import { Aluno_Processo } from "../entities/Aluno_Processo";
import { gerarUrlsArquivos } from "../helpers/gerar-url-arquivos";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export class AlunoProcessoController {
  async create(req: Request, res: Response) {
    const alunoId = req.alunoLogin.id;
    const files = req.files as any;

    const processoAtivo = await AlunoProcessosRepository.findOne({
      where: { aluno: { id: alunoId }, liberado: false },
      relations: ["aluno", "aluno_matricula"],
    });

    if (!processoAtivo) {
      throw new UnprocessableEntityError(
        "Nenhum processo ativo encontrado. Inicie um processo antes de enviar documentos."
      );
    }

    if (new Date(processoAtivo.prazo_final) < new Date()) {
      throw new UnprocessableEntityError("O prazo do processo expirou.");
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

    if (!aluno) throw new NotFoundError("Aluno não encontrado.");

    if (
      !aluno.aluno_documento ||
      !aluno.aluno_endereco ||
      !aluno.aluno_responsavel
    ) {
      throw new UnprocessableEntityError(
        "Para enviar documentos do processo, o aluno precisa ter Documentos, Endereço e Responsáveis cadastrados."
      );
    }

    const camposArquivos = [
      "formulario_educard",
      "declaracao_matricula",
      "comprovante_pagamento",
      "comprovante_residencia",
      "rg_frente_ou_verso",
    ] as const;

    camposArquivos.forEach((campo) => {
      if (files[campo]?.[0]) {
        processoAtivo[campo] = files[campo][0].location;
        processoAtivo[`${campo}_validado`] = false;
      }
    });

    const anoAtual = new Date().getFullYear();
    const matriculaVigente = aluno.aluno_matricula?.find(
      (matricula) =>
        matricula.ano_letivo === anoAtual && matricula.status_matricula === true
    );

    if (!matriculaVigente) {
      throw new UnprocessableEntityError(
        "O aluno precisa ter uma matrícula vigente neste ano para enviar documentos."
      );
    }

    const alunoProcessoData: AlunoProcessoInterface = {
      formulario_educard: processoAtivo.formulario_educard,
      declaracao_matricula: processoAtivo.declaracao_matricula,
      comprovante_pagamento: processoAtivo.comprovante_pagamento,
      comprovante_residencia: processoAtivo.comprovante_residencia,
      rg_frente_ou_verso: processoAtivo.rg_frente_ou_verso,
      liberado: processoAtivo.liberado,
    };

    const novoAlunoProcesso = plainToInstance(Aluno_Processo, {
      ...alunoProcessoData,
      aluno,
      aluno_matricula: matriculaVigente,
      data_criacao: processoAtivo.data_criacao,
      prazo_final: processoAtivo.prazo_final,
    });

    const errosValidacao = await validate(novoAlunoProcesso);
    if (errosValidacao.length > 0) {
      ErrosValidacao(errosValidacao, res);
      return;
    }

    await AlunoProcessosRepository.save(processoAtivo);

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    res.status(200).json({
      message: "Documentos enviados/atualizados com sucesso.",
      processoId: processoAtivo.id,
      prazo_final: processoAtivo.prazo_final,
      ...gerarUrlsArquivos(processoAtivo, baseUrl),
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
      relations: [
        "aluno_matricula",
        "aluno_documento",
        "aluno_endereco",
        "aluno_responsavel",
        "aluno_processo",
      ],
    });

    if (!aluno) throw new NotFoundError("Aluno não encontrado.");

    if (!aluno.tipo_cartao) {
      throw new UnprocessableEntityError(
        "Declare o tipo de cartão antes de começar um processo!"
      );
    }

    if (
      !aluno.aluno_documento ||
      !aluno.aluno_endereco ||
      !aluno.aluno_responsavel
    ) {
      throw new UnprocessableEntityError(
        "Para criar um processo, o aluno precisa ter Documentos, Endereço e Responsáveis cadastrados."
      );
    }

    const anoAtual = new Date().getFullYear();
    const matriculaVigente = aluno.aluno_matricula?.find(
      (matricula) =>
        matricula.ano_letivo === anoAtual && matricula.status_matricula === true
    );

    if (!matriculaVigente) {
      throw new UnprocessableEntityError(
        "Para iniciar um Processo Digital é necessário ter uma matrícula vigente."
      );
    }

    const processoAtivo = aluno.aluno_processo?.find((processo) => {
      const prazoFinal = new Date(processo.prazo_final);
      return prazoFinal >= new Date() && processo.liberado === false;
    });

    if (processoAtivo) {
      throw new ConflictError("Já existe um processo em andamento.");
    }

    const novoProcesso = AlunoProcessosRepository.create({
      formulario_educard: null,
      formulario_educard_validado: false,
      declaracao_matricula: null,
      declaracao_matricula_validado: false,
      comprovante_pagamento: null,
      comprovante_pagamento_validado: false,
      comprovante_residencia: null,
      comprovante_residencia_validado: false,
      rg_frente_ou_verso: null,
      rg_frente_ou_verso_validado: false,
      liberado: false,
      aluno,
      aluno_matricula: matriculaVigente,
      data_criacao: new Date(),
      prazo_final: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    });

    await AlunoProcessosRepository.save(novoProcesso);

    res.status(201).json({
      message:
        "Processo iniciado com sucesso! Você tem 15 dias para concluir o envio dos documentos.",
      processoId: novoProcesso.id,
      prazo_final: novoProcesso.prazo_final,
      existente: false,
    });
  }

  async removerArquivo(req: Request, res: Response) {
    const alunoId = req.alunoLogin.id;
    const { campo } = req.params;

    const camposValidos = [
      "formulario_educard",
      "declaracao_matricula",
      "comprovante_pagamento",
      "comprovante_residencia",
      "rg_frente_ou_verso",
    ] as const;

    if (!camposValidos.includes(campo as any)) {
      throw new UnprocessableEntityError("Campo de arquivo inválido.");
    }

    const processo = await AlunoProcessosRepository.findOne({
      where: { aluno: { id: alunoId }, liberado: false },
      relations: ["aluno"],
    });

    if (!processo) {
      throw new NotFoundError("Nenhum processo ativo encontrado.");
    }

    const caminhoArquivo = processo[campo as keyof typeof processo] as
      | string
      | null;

    if (!caminhoArquivo) {
      throw new NotFoundError("Nenhum arquivo encontrado para este campo.");
    }

    try {
      const key = caminhoArquivo.split(".com/")[1];
      if (key) {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: key,
          })
        );
      }
    } catch (error) {
      console.error("Erro ao deletar arquivo do S3:", error);
    }

    (processo as any)[campo] = null;
    (processo as any)[`${campo}_validado`] = false;

    await AlunoProcessosRepository.save(processo);

    res.status(200).json({
      message: `Arquivo '${campo}' removido com sucesso.`,
    });
  }
}
