
import { ValidationError } from "class-validator";
import { Response } from "express";

export function ErrosValidacao(erros: ValidationError[], res: Response) {
  const mensagens: string[] = [];

  erros.forEach(err => {
    if (err.constraints) {
      mensagens.push(...Object.values(err.constraints));
    }
    if (err.children && err.children.length > 0) {
      mensagens.push(...ErrosValidacaoRecursivo(err.children));
    }
  });

  res.status(400).json({ errors: mensagens });
}

function ErrosValidacaoRecursivo(erros: ValidationError[]): string[] {
  const mensagens: string[] = [];

  erros.forEach(err => {
    if (err.constraints) {
      mensagens.push(...Object.values(err.constraints));
    }
    if (err.children && err.children.length > 0) {
      mensagens.push(...ErrosValidacaoRecursivo(err.children));
    }
  });
  
  return mensagens;
}
