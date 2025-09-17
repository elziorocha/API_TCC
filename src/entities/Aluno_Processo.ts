import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Aluno } from "./Aluno";
import { IsString, Matches } from "class-validator";
import { Aluno_Matricula } from "./Aluno_Matricula";

@Entity("aluno_processos")
export class Aluno_Processo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  @Matches(/\.pdf$/i, {
    message: "O Formulário EDUCARD deve ser um arquivo .PDF",
  })
  formulario_educard: string;

  @Column()
  @IsString()
  @Matches(/\.pdf$/i, {
    message: "O Comprovante de Matrícula deve ser um arquivo .PDF",
  })
  declaracao_matricula: string;

  @Column()
  @IsString()
  @Matches(/\.(jpg|jpeg|png)$/i, {
    message: "O Comprovante de Pagamento deve ser uma imagem (.JPG ou .PNG)",
  })
  comprovante_pagamento: string;

  @Column()
  @IsString()
  @Matches(/\.(jpg|jpeg|png)$/i, {
    message: "O Comprovante de Residência deve ser uma imagem (.JPG ou .PNG)",
  })
  comprovante_residência: string;

  @Column()
  @IsString()
  @Matches(/\.(jpg|jpeg|png)$/i, {
    message: "A foto do RG Frente e Verso deve ser uma imagem (.JPG ou .PNG)",
  })
  rf_frente_ou_verso: string;

  @Column({ type: "boolean", default: false })
  liberado: boolean;

  @ManyToOne(() => Aluno_Matricula, { nullable: false })
  aluno_matricula: Aluno_Matricula;

  @ManyToOne(() => Aluno, (aluno) => aluno.aluno_processo, { nullable: false })
  aluno: Aluno;
}
