import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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
  formulario_educard: string | null;

  @Column()
  @IsString()
  @Matches(/\.pdf$/i, {
    message: "O Comprovante de Matrícula deve ser um arquivo .PDF",
  })
  declaracao_matricula: string | null;

  @Column()
  @IsString()
  @Matches(/\.(jpg|jpeg|png)$/i, {
    message: "O Comprovante de Pagamento deve ser uma imagem (.JPG ou .PNG)",
  })
  comprovante_pagamento: string | null;

  @Column()
  @IsString()
  @Matches(/\.(jpg|jpeg|png)$/i, {
    message: "O Comprovante de Residência deve ser uma imagem (.JPG ou .PNG)",
  })
  comprovante_residencia: string | null;

  @Column()
  @IsString()
  @Matches(/\.(jpg|jpeg|png)$/i, {
    message: "A foto do RG Frente e Verso deve ser uma imagem (.JPG ou .PNG)",
  })
  rg_frente_ou_verso: string | null;

  @Column({ type: "boolean", default: false })
  liberado: boolean;

  @ManyToOne(() => Aluno_Matricula, { nullable: false })
  aluno_matricula: Aluno_Matricula;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  data_criacao: Date;

  @Column({ type: "timestamp", nullable: true })
  prazo_final: Date;

  @ManyToOne(() => Aluno, (aluno) => aluno.aluno_processo, { nullable: false })
  aluno: Aluno;
}
