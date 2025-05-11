import { AppDataSource } from "../data-source";
import { Aluno_Responsavel } from "../entities/Aluno_Responsavel";

export const AlunoResponsavelRepository =
  AppDataSource.getRepository(Aluno_Responsavel);
