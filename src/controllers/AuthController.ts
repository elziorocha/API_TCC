import { Request, Response } from "express";
import { BadRequestError } from "../helpers/api-errors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validate } from "class-validator";
import { Aluno as AlunoEntity } from "../entities/Aluno";
import {
  AlterarSenhaInterface,
  AlunoInterface,
  AlunoLoginInterface,
} from "../helpers/interfaces.interface";
import { AlunoRepository } from "../repositories";
import { plainToInstance } from "class-transformer";
import { ErrosValidacao } from "../helpers/error-validator";
import {
  corpoVerificacaoEmail,
  emailTransporter,
} from "../helpers/verificar-email";

export class AuthController {
  async create(req: Request<any, any, AlunoInterface>, res: Response) {
    const alunoData = req.body;

    const dataNascimento = new Date(alunoData.data_nascimento);

    if (isNaN(dataNascimento.getTime())) {
      throw new BadRequestError("Data de nascimento inválida.");
    }

    const anoDataNascimento = dataNascimento.getFullYear();
    if (anoDataNascimento < 1925 || anoDataNascimento > 2020) {
      throw new BadRequestError(
        "A data de nascimento deve estar entre 1925 e 2020."
      );
    }

    const alunoInstancia = plainToInstance(AlunoEntity, {
      ...alunoData,
      data_nascimento: new Date(alunoData.data_nascimento),
    });

    const errosValidacao = await validate(alunoInstancia, {
      stopAtFirstError: false,
    });

    if (errosValidacao.length > 0) {
      ErrosValidacao(errosValidacao, res);
      return;
    }

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

    const codigoVerificacaoEmail = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const emailExpiraEm = new Date(Date.now() + 10 * 60 * 1000);

    const novoAluno = AlunoRepository.create({
      ...alunoData,
      senha: senhaCriptografada,
      email_verificado: false,
      codigo_verificacao: codigoVerificacaoEmail,
      codigo_expira_em: emailExpiraEm,
    });

    await AlunoRepository.save(novoAluno);

    const mailOptions = {
      from: `"Portal do Aluno" <${process.env.EMAIL_USER}>`,
      to: novoAluno.email,
      subject: "Código de verificação - Confirmação de e-mail",
      html: corpoVerificacaoEmail(novoAluno.nome, codigoVerificacaoEmail),
    };

    await emailTransporter.sendMail(mailOptions).catch(() => {
      throw new BadRequestError("Falha ao enviar e-mail de confirmação.");
    });

    res.status(201).json({
      message:
        "Cadastro realizado! Verifique seu e-mail para confirmar a conta.",
    });
  }

  async verificarEmail(req: Request, res: Response) {
    const { email, codigo } = req.body;

    if (!email || !codigo) {
      throw new BadRequestError("E-mail e código são obrigatórios.");
    }

    const aluno = await AlunoRepository.findOneBy({ email });

    if (!aluno) {
      throw new BadRequestError("Usuário não encontrado.");
    }

    if (aluno.email_verificado) {
      res.json({ message: "E-mail já foi verificado." });
      return;
    }

    const atualMomento = new Date();
    if (aluno.codigo_verificacao !== codigo) {
      throw new BadRequestError("Código inválido.");
    }

    if (aluno.codigo_expira_em && aluno.codigo_expira_em < atualMomento) {
      throw new BadRequestError("Código expirado. Solicite um novo.");
    }

    aluno.email_verificado = true;
    aluno.codigo_verificacao = null;
    aluno.codigo_expira_em = null;
    await AlunoRepository.save(aluno);

    res.json({ message: "E-mail confirmado com sucesso!" });
    return;
  }

  async login(req: Request<any, any, AlunoLoginInterface>, res: Response) {
    const authData = req.body;

    const alunoAuth = await AlunoRepository.findOneBy({
      email: authData.email,
    });

    if (!alunoAuth) {
      throw new BadRequestError("E-mail ou Senha inválidos.");
    }

    if (!alunoAuth.email_verificado) {
      throw new BadRequestError("Confirme seu e-mail antes de fazer login.");
    }

    const verificarSenha = await bcrypt.compare(
      authData.senha,
      alunoAuth.senha
    );

    if (!verificarSenha) {
      throw new BadRequestError("E-mail ou Senha inválidos.");
    }

    alunoAuth.tokenVersion += 1;
    await AlunoRepository.save(alunoAuth);

    const authToken = jwt.sign(
      { id: alunoAuth.id, tokenVersion: alunoAuth.tokenVersion },
      process.env.JWT_PASS ?? "",
      {
        expiresIn: "6h",
      }
    );

    const alunoAuthSemDados = {
      email: alunoAuth.email,
    };

    res.status(201).json({
      alunoAuth: alunoAuthSemDados,
      token: authToken,
    });
  }

  async getAluno(req: Request, res: Response) {
    res.json(req.alunoLogin);
  }

  async alterarSenha(
    req: Request<any, any, AlterarSenhaInterface>,
    res: Response
  ) {
    const { senhaAntiga, novaSenha } = req.body;
    const alunoId = req.alunoLogin.id;

    const aluno = await AlunoRepository.findOneBy({ id: alunoId });

    if (!aluno) {
      throw new BadRequestError("Aluno não encontrado.");
    }

    const senhaCorreta = await bcrypt.compare(senhaAntiga, aluno.senha);

    switch (true) {
      case !senhaCorreta:
        throw new BadRequestError("Senha antiga incorreta.");

      case !novaSenha || novaSenha.length < 6:
        throw new BadRequestError("A senha deve ter pelo menos 6 caracteres.");

      case senhaAntiga === novaSenha:
        throw new BadRequestError("As senhas não podem ser iguais.");
    }

    const senhaCriptografada = await bcrypt.hash(novaSenha, 10);
    aluno.senha = senhaCriptografada;

    aluno.tokenVersion += 1;
    await AlunoRepository.save(aluno);

    res.status(200).json({ message: "Senha alterada com sucesso!" });
  }

  async logout(req: Request, res: Response) {
    const alunoId = req.alunoLogin.id;

    const aluno = await AlunoRepository.findOneBy({ id: alunoId });
    if (!aluno) {
      throw new BadRequestError("Aluno não encontrado.");
    }

    aluno.tokenVersion += 1;
    await AlunoRepository.save(aluno);

    res.status(200).json({ message: "Logout realizado com sucesso!" });
  }
}
