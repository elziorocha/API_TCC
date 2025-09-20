import { Convenio, GrauEscolaridade, TipoCartao, Turno } from "./entities-enum";

export interface TokenPayloadInterface {
  id: number;
  iat: number;
  exp: number;
  tokenVersion: number;
}

export interface AlterarSenhaInterface {
  senhaAntiga: string;
  novaSenha: string;
}

export interface AlunoLoginInterface {
  email: string;
  senha: string;
  id: number;
}

export interface AlunoInterface {
  email: string;
  senha: string;
  nome: string;
  telefone: string;
  data_nascimento: Date;
  tipo_cartao: TipoCartao;
  criado_em: Date;
}

export interface AlunoDocumentoInterface {
  rg: string;
  cpf: string;
  orgao_emissor: string;
}

export interface AlunoEnderecoInterface {
  cep: string;
  cidade: string;
  bairro: string;
  rua: string;
  numero: number;
}

export interface AlunoResponsavelInterface {
  cpf_mae: string;
  nome_mae: string;
  nome_pai: string;
  nome_responsavel: string;
}

export interface AlunoMatriculaInterface {
  ano_letivo: number;
  instituicao: string;
  data_inicio: Date;
  data_fim: Date;
  grau_scolaridade: GrauEscolaridade;
  serie_ou_periodo: number;
  curso?: string;
  turno: Turno;
  convenio: Convenio;
  cgm?: string;
  distancia_instituicao?: number;
  status_matricula: boolean;
}

export interface AlunoProcessoInterface {
  formulario_educard: string;
  declaracao_matricula: string;
  comprovante_pagamento: string;
  comprovante_residencia: string;
  rf_frente_ou_verso: string;
  liberado: boolean;
}
