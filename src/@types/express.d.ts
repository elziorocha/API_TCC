import { Aluno } from "../entities/Aluno";

declare global {
  namespace Express {
    export interface Request {
      aluno: Partial<Aluno>;
    }
  }
}
