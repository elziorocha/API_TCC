import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Aluno } from "./Aluno";
import { Length, Matches } from "class-validator";

@Entity("aluno_documentos")
export class Aluno_Documento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  @Length(7, 10, { message: "O RG deve conter entre 7 e 10 dígitos" })
  @Matches(/^\d+$/, { message: "O RG deve conter apenas números" })
  rg: string;

  @Column({ unique: true, nullable: false })
  @Length(11, 11, { message: "O CPF deve conter exatamente 11 dígitos" })
  @Matches(/^\d{11}$/, { message: "O CPF deve conter apenas números" })
  cpf: string;

  @Column({ nullable: false })
  orgao_emissor: string;

  @OneToOne(() => Aluno, (aluno) => aluno.aluno_documento)
  aluno: Aluno;
}
