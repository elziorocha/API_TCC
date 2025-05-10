import { AppDataSource } from "../data-source";
import { Aluno_Documento } from "../entities/Aluno_Documento";

export const AlunoDocumentoRepository =
  AppDataSource.getRepository(Aluno_Documento);
