import { Aluno } from "../entities/Aluno";

declare global {
  namespace Express {
    export interface Request {
      alunoLogin: Partial<Aluno>;
    }
  }
}
