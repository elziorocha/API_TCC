import { AppDataSource } from "../data-source";
import { Aluno } from "../entities/Aluno";

export const AlunoRepository = AppDataSource.getRepository(Aluno);
