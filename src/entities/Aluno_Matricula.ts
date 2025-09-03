import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Aluno } from "./Aluno";
import { IsDate, Length, Matches, Max, Min } from "class-validator";
import { GrauEscolaridade } from "../helpers/grauEscolaridade";

@Entity("aluno_matriculas")
export class Aluno_Matricula {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  @Length(4, 4, { message: "O Ano letivo deve conter exatamente 4 dígitos." })
  @Matches(/^\d{4}$/, { message: "O Ano letivo deve conter apenas números." })
  ano_letivo: string;

  @Length(8, 155, { message: "A instituição deve conter entre 8 e 155 dígitos." })
  @Column({ nullable: false })
  instituicao: string;

  @Column({ type: "date", nullable: false })
  @IsDate({ message: "Data de início deve ser uma data válida." })
  data_inicio: Date;

  @Column({ type: "date", nullable: false })
  @IsDate({ message: "Data de término deve ser uma data válida." })
  data_fim: Date;

  @Column({
    type: "enum",
    enum: GrauEscolaridade,
    nullable: false,
  })
  tipo_cartao: GrauEscolaridade;

  @Column({
    type: "char",
    length: 1,
    nullable: false,
  })
  @Min(0, { message: "A série ou o período deve ser um dígito entre 0 e 9" })
  @Max(9, { message: "A série ou o período deve ser um dígito entre 0 e 9" })
  serieOuPeriodo: number;

  @Length(4, 155, { message: "A instituição deve conter entre 4 e 155 dígitos." })
  @Column({ nullable: true })
  curso: string;

  @Column({
    type: "enum",
    enum: ["Matutino", "Vespertino", "Noturno"],
    nullable: false,
  })
  turno: "Matutino" | "Vespertino" | "Noturno";

  @Column({
    type: "enum",
    enum: ["PROUNI", "FIES", "EDUCAMAIS", "BOLSA"],
    nullable: true,
  })
  convenio: "PROUNI" | "FIES" | "EDUCAMAIS" | "BOLSA";

  @Length(4, 20, { message: "O CGM deve conter entre 4 e 20 dígitos." })
  @Column({ nullable: true })
  cgm: string;

  @Length(1, 4, { message: "A distância deve conter entre 1 e 4 dígitos." })
  @Column({ nullable: true })
  distanciaInstituicao: number;

  @OneToOne(() => Aluno, (aluno) => aluno.aluno_matricula)
  aluno: Aluno;
}
