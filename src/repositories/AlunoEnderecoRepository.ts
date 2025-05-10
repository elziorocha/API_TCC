import { AppDataSource } from "../data-source";
import { Aluno_Endereco } from "../entities/Aluno_Endereco";

export const AlunoEnderecoRepository =
  AppDataSource.getRepository(Aluno_Endereco);
