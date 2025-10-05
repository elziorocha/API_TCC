import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Aluno } from "./Aluno";
import { IsString, Matches } from "class-validator";
import { Aluno_Matricula } from "./Aluno_Matricula";

@Entity("aluno_processos")
export class Aluno_Processo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", nullable: true })
  @IsString()
  @Matches(/\.pdf$/i, { message: "..." })
  formulario_educard: string | null;

  @Column({ type: "varchar", nullable: true })
  @IsString()
  @Matches(/\.pdf$/i, { message: "..." })
  declaracao_matricula: string | null;

  @Column({ type: "varchar", nullable: true })
  @IsString()
  @Matches(/\.(jpg|jpeg|png)$/i, { message: "..." })
  comprovante_pagamento: string | null;

  @Column({ type: "varchar", nullable: true })
  @IsString()
  @Matches(/\.(jpg|jpeg|png)$/i, { message: "..." })
  comprovante_residencia: string | null;

  @Column({ type: "varchar", nullable: true })
  @IsString()
  @Matches(/\.(jpg|jpeg|png)$/i, { message: "..." })
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
