import { AppDataSource } from "../data-source";
import { Aluno } from "../entities/Aluno";

export const alunoRepository = AppDataSource.getRepository(Aluno);
