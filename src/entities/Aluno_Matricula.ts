import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Aluno } from "./Aluno";
import {
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  Length,
  Matches,
  Max,
  Min,
} from "class-validator";
import { Type } from "class-transformer";
import { Convenio, GrauEscolaridade, Turno } from "../helpers/entities-enum";

@Entity("aluno_matriculas")
export class Aluno_Matricula {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", nullable: false })
  @IsInt({ message: "Ano letivo deve ser um número inteiro." })
  @Min(1950, { message: "Ano letivo inválido." })
  @Max(2150, { message: "Ano letivo inválido." })
  ano_letivo: number;

  @Column({ nullable: false })
  @Length(8, 155, {
    message: "A instituição deve conter entre 8 e 155 caracteres.",
  })
  instituicao: string;

  @Column({ type: "date", nullable: false })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: "Data de início inválida." })
  data_inicio: string;

  @Column({ type: "date", nullable: false })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: "Data de término inválida." })
  data_fim: string;

  @Column({ type: "enum", enum: GrauEscolaridade, nullable: false })
  @IsEnum(GrauEscolaridade, { message: "Grau de escolaridade inválido." })
  grau_scolaridade: GrauEscolaridade;

  @Column({ type: "int", nullable: false, default: 0 })
  @IsInt({ message: "Série ou período deve ser um número." })
  @Min(1, { message: "A série ou o período deve ser entre 1 e 20." })
  @Max(20, { message: "A série ou o período deve ser entre 1 e 20." })
  serie_ou_periodo: number;

  @Column({ nullable: true })
  @IsOptional()
  @Length(4, 155, { message: "O curso deve conter entre 4 e 155 caracteres." })
  curso?: string;

  @Column({ type: "enum", enum: Turno, nullable: false })
  @IsEnum(Turno, { message: "Turno fornecido inválido." })
  turno: Turno;

  @Column({ type: "enum", enum: Convenio, nullable: true })
  @IsOptional()
  @IsEnum(Convenio, { message: "Convênio fornecido inválido." })
  convenio?: Convenio;

  @Column({ nullable: true })
  @IsOptional()
  @Length(4, 20, { message: "O CGM deve conter entre 4 e 20 caracteres." })
  cgm?: string;

  @Column({ type: "int", nullable: true })
  @IsOptional()
  @IsInt({ message: "A distância deve ser um número." })
  @Min(1, { message: "Distância mínima: 1" })
  @Max(1000, { message: "Distância máxima: 1000" })
  distancia_instituicao?: number;

  @Column({ type: "boolean", default: true })
  status_matricula: boolean;

  @ManyToOne(() => Aluno, (aluno) => aluno.aluno_matricula, { nullable: false })
  aluno: Aluno;
}
