import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Aluno } from "./Aluno";
import { IsString, Matches, IsOptional } from "class-validator";
import { Aluno_Matricula } from "./Aluno_Matricula";

@Entity("aluno_processos")
export class Aluno_Processo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  @Matches(/\.pdf$/i, { message: "O arquivo deve ser um PDF" })
  formulario_educard: string | null;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  @Matches(/\.pdf$/i, { message: "O arquivo deve ser um PDF" })
  declaracao_matricula: string | null;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  @Matches(/\.(jpg|jpeg|png)$/i, {
    message: "O arquivo deve ser JPG, JPEG ou PNG",
  })
  comprovante_pagamento: string | null;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  @Matches(/\.(jpg|jpeg|png)$/i, {
    message: "O arquivo deve ser JPG, JPEG ou PNG",
  })
  comprovante_residencia: string | null;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsString()
  @Matches(/\.(jpg|jpeg|png)$/i, {
    message: "O arquivo deve ser JPG, JPEG ou PNG",
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
