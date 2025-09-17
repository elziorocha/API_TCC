import { AppDataSource } from "./data-source";
import { Aluno } from "./entities/Aluno";
import { Aluno_Documento } from "./entities/Aluno_Documento";
import { Aluno_Responsavel } from "./entities/Aluno_Responsavel";
import { Aluno_Endereco } from "./entities/Aluno_Endereco";
import { Aluno_Matricula } from "./entities/Aluno_Matricula";
import { Aluno_Processo } from "./entities/Aluno_Processo";

export const AlunoRepository = AppDataSource.getRepository(Aluno);

export const AlunoDocumentoRepository =
  AppDataSource.getRepository(Aluno_Documento);

export const AlunoResponsavelRepository =
  AppDataSource.getRepository(Aluno_Responsavel);

export const AlunoEnderecoRepository =
  AppDataSource.getRepository(Aluno_Endereco);

export const AlunoMatriculaRepository =
  AppDataSource.getRepository(Aluno_Matricula);

export const AlunoProcessosRepository =
  AppDataSource.getRepository(Aluno_Processo);
